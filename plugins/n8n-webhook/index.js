import { Plugin } from '@tallimantra/sdk';
import jwt from 'jsonwebtoken';

export class N8nWorkflowPlugin extends Plugin {
  constructor(context) {
    super(context);
    this.config = context.config;
  }

  async onLoad() {
    // Register message handler
    this.context.on('message', this.handleMessage.bind(this));
    
    // Register settings component
    this.context.registerComponent('settings', {
      name: 'N8n Settings',
      component: 'n8n-settings'
    });
  }

  buildAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Layer 1: ngrok auth if configured
    if (process.env.NGROK_BASIC_AUTH_USER && process.env.NGROK_BASIC_AUTH_PASS) {
      const ngrokAuth = Buffer.from(
        `${process.env.NGROK_BASIC_AUTH_USER}:${process.env.NGROK_BASIC_AUTH_PASS}`
      ).toString('base64');
      headers['Ngrok-Authorization'] = `Basic ${ngrokAuth}`;
    }

    // Layer 2: n8n instance auth
    if (process.env.N8N_API_KEY) {
      headers['X-N8N-API-KEY'] = process.env.N8N_API_KEY;
    } else if (process.env.N8N_BASIC_AUTH_USER && process.env.N8N_BASIC_AUTH_PASS) {
      const n8nAuth = Buffer.from(
        `${process.env.N8N_BASIC_AUTH_USER}:${process.env.N8N_BASIC_AUTH_PASS}`
      ).toString('base64');
      headers['Authorization'] = `Basic ${n8nAuth}`;
    }

    // Layer 3: webhook-specific auth
    if (this.config.auth?.type && this.config.auth.type !== 'none') {
      switch (this.config.auth.type) {
        case 'basicAuth':
          if (this.config.auth.basic_auth?.username && this.config.auth.basic_auth?.password) {
            const auth = Buffer.from(
              `${this.config.auth.basic_auth.username}:${this.config.auth.basic_auth.password}`
            ).toString('base64');
            headers['Authorization'] = `Basic ${auth}`;
          }
          break;

        case 'headerAuth':
          if (this.config.auth.header_auth?.name && this.config.auth.header_auth?.value) {
            headers[this.config.auth.header_auth.name] = this.config.auth.header_auth.value;
          }
          break;

        case 'jwtAuth':
          if (this.config.auth.jwt_auth?.secret) {
            const payload = {
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + (60 * 5) // 5 minutes expiry
            };

            const token = jwt.sign(
              payload,
              this.config.auth.jwt_auth.secret,
              {
                algorithm: this.config.auth.jwt_auth.algorithm || 'HS256'
              }
            );

            headers['Authorization'] = `Bearer ${token}`;
          }
          break;
      }
    }

    return headers;
  }

  async handleMessage(message, context) {
    const n8nUrl = process.env.N8N_URL;
    const endpoint = this.config.endpoint;
    const webhookType = this.config.test_mode ? 'webhook-test' : 'webhook';
    const timeout = this.config.timeout || 30000;

    try {
      // Call n8n webhook
      const response = await fetch(`${n8nUrl}/${webhookType}/${endpoint}`, {
        method: 'POST',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify({
          message: message.content,
          context: context.data
        }),
        timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`n8n webhook failed (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return {
        content: data.response,
        metadata: {
          endpoint,
          execution_time: data.execution_time,
          test_mode: this.config.test_mode
        }
      };
    } catch (error) {
      this.context.logger.error('n8n webhook error:', error);
      throw new Error(`Failed to process message: ${error.message}`);
    }
  }

  async onUnload() {
    // Cleanup
    this.context.off('message', this.handleMessage);
  }
} 