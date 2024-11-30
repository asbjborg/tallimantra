import { Plugin } from '../types';
import { eventBus } from '../core/eventBus';
import jwt from 'jsonwebtoken';
import {
  N8nWebhookConfig,
  Message,
  MessageContext,
  N8nResponse,
  AuthConfig
} from './types';

class N8nWebhookPlugin {
  private config: N8nWebhookConfig;

  constructor(config: N8nWebhookConfig) {
    this.config = {
      timeout: 30000,
      test_mode: false,
      ...config
    };
  }

  private buildAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
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
      this.addWebhookAuth(headers, this.config.auth);
    }

    return headers;
  }

  private addWebhookAuth(headers: Record<string, string>, auth: AuthConfig): void {
    switch (auth.type) {
      case 'basicAuth':
        if (auth.basic_auth?.username && auth.basic_auth?.password) {
          const authStr = Buffer.from(
            `${auth.basic_auth.username}:${auth.basic_auth.password}`
          ).toString('base64');
          headers['Authorization'] = `Basic ${authStr}`;
        }
        break;

      case 'headerAuth':
        if (auth.header_auth?.name && auth.header_auth?.value) {
          headers[auth.header_auth.name] = auth.header_auth.value;
        }
        break;

      case 'jwtAuth':
        if (auth.jwt_auth?.secret) {
          const payload = {
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 5) // 5 minutes expiry
          };

          const token = jwt.sign(
            payload,
            auth.jwt_auth.secret,
            {
              algorithm: auth.jwt_auth.algorithm || 'HS256'
            }
          );

          headers['Authorization'] = `Bearer ${token}`;
        }
        break;
    }
  }

  async handleMessage(message: Message, context: MessageContext): Promise<Message> {
    const n8nUrl = process.env.N8N_URL;
    if (!n8nUrl) {
      throw new Error('N8N_URL environment variable is not set');
    }

    const endpoint = this.config.endpoint;
    const webhookType = this.config.test_mode ? 'webhook-test' : 'webhook';
    const timeout = this.config.timeout || 30000;

    try {
      const response = await fetch(`${n8nUrl}/${webhookType}/${endpoint}`, {
        method: 'POST',
        headers: this.buildAuthHeaders(),
        body: JSON.stringify({
          message: message.content,
          context: context.data
        }),
        signal: AbortSignal.timeout(timeout)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`n8n webhook failed (${response.status}): ${errorText}`);
      }

      const data = await response.json() as N8nResponse;
      return {
        content: data.response,
        metadata: {
          endpoint,
          execution_time: data.execution_time,
          test_mode: this.config.test_mode
        }
      };
    } catch (error) {
      console.error('n8n webhook error:', error);
      throw new Error(`Failed to process message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

const plugin: Plugin = {
  id: '@tallimantra/n8n-webhook',
  name: '@tallimantra/n8n-webhook',
  version: '0.1.0',
  description: 'N8N webhook integration for Tallimantra',
  author: 'Tallimantra',
  dependencies: {
    '@tallimantra/core': '^0.1.0'
  },

  async initialize() {
    console.log('N8N Webhook plugin initializing...');
    const webhookPlugin = new N8nWebhookPlugin({
      name: 'default',
      endpoint: process.env.N8N_WEBHOOK_ENDPOINT || 'default'
    });

    // Subscribe to message events
    eventBus.onAsync('message', async (message: Message, context: MessageContext) => {
      try {
        const response = await webhookPlugin.handleMessage(message, context);
        await eventBus.emitAsync('message:processed', response);
      } catch (error) {
        console.error('Error processing message:', error);
        await eventBus.emitAsync('message:error', {
          error: error instanceof Error ? error.message : String(error),
          message,
          context
        });
      }
    });
  },

  async activate() {
    console.log('N8N Webhook plugin activated!');
  },

  async deactivate() {
    console.log('N8N Webhook plugin deactivated.');
  }
};

export default plugin; 