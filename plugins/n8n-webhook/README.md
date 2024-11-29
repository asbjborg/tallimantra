# n8n Webhook Plugin

Connect Tallimantra to n8n webhook triggers for text-based message processing. This plugin supports multiple instances, allowing you to connect to different n8n webhook endpoints with different configurations.

## n8n Setup

1. Create a new workflow in n8n
2. Add a "Webhook" trigger node as the first node
3. Configure the webhook:
   - Authentication (optional):
     - Basic Auth: Username and password
     - Header Auth: Custom header (e.g., `X-API-Key`)
     - JWT: Choose between passphrase or PEM key
   - Add a "Respond to Webhook" node at the end of your workflow
   - Optional: Enable test webhook

Example webhook configurations in n8n:

### Basic Auth Example
```json
{
  "name": "chat-processor",
  "endpoint": "process-chat",
  "auth": {
    "type": "basicAuth",
    "basic_auth": {
      "username": "webhook_user",
      "password": "strong_password"
    }
  }
}
```

In n8n:
1. Set Authentication to "Basic Auth"
2. Enter the same username and password
3. The webhook URL will be: `http://your-n8n:5678/webhook/process-chat`

### Header Auth Example
```json
{
  "name": "sentiment",
  "endpoint": "analyze-sentiment",
  "auth": {
    "type": "headerAuth",
    "header_auth": {
      "name": "X-Webhook-Key",
      "value": "your-secret-key"
    }
  }
}
```

In n8n:
1. Set Authentication to "Header Auth"
2. Header Name: `X-Webhook-Key`
3. Header Value: `your-secret-key`

### JWT Auth Example
```json
{
  "name": "translator",
  "endpoint": "translate-text",
  "auth": {
    "type": "jwtAuth",
    "jwt_auth": {
      "key_type": "passphrase",
      "secret": "your-jwt-secret",
      "algorithm": "HS256"
    }
  }
}
```

In n8n:
1. Set Authentication to "JWT"
2. Key Type: "Passphrase"
3. Secret: `your-jwt-secret`
4. Algorithm: HS256

## n8n Workflow Examples

### Chat Processing Workflow
```
[Webhook]
  ↓
[Function] → Format incoming message
  ↓
[HTTP Request] → Call LLM API
  ↓
[Function] → Format response
  ↓
[Respond to Webhook]  # Returns text response
```

### Translation Workflow
```
[Webhook]
  ↓
[Function] → Extract text and target language
  ↓
[HTTP Request] → Call Translation API
  ↓
[Function] → Format translated text
  ↓
[Respond to Webhook]  # Returns translated text
```

### Sentiment Analysis Workflow
```
[Webhook]
  ↓
[Function] → Prepare text for analysis
  ↓
[HTTP Request] → Call Sentiment API
  ↓
[Function] → Format sentiment result
  ↓
[Respond to Webhook]  # Returns sentiment analysis
```

### Test Mode Usage
Each webhook in n8n provides a test URL. Enable test mode in your config:

```json
{
  "name": "chat-processor",
  "endpoint": "process-chat",
  "test_mode": true  // Uses /webhook-test/ instead of /webhook/
}
```

Use test mode to:
1. Debug your workflow
2. Test authentication
3. View detailed execution logs
4. Try different inputs

## Multiple Instances

You can create multiple instances for different text processing tasks:

```json
// Instance 1: Chat Processing
{
  "name": "chat",
  "endpoint": "process-chat",
  "auth": {
    "type": "basicAuth",
    "basic_auth": {
      "username": "chat_user",
      "password": "chat_pass"
    }
  }
}

// Instance 2: Translation
{
  "name": "translate",
  "endpoint": "translate-text",
  "auth": {
    "type": "headerAuth",
    "header_auth": {
      "name": "X-API-Key",
      "value": "translate_key"
    }
  }
}

// Instance 3: Sentiment Analysis
{
  "name": "sentiment",
  "endpoint": "analyze-sentiment",
  "test_mode": true,  // For testing
  "auth": {
    "type": "jwtAuth",
    "jwt_auth": {
      "key_type": "passphrase",
      "secret": "sentiment_secret",
      "algorithm": "HS256"
    }
  }
}
```

Each instance will be registered as `n8n-webhook-[name]` (e.g., `n8n-webhook-chat`).

## n8n Response Format

Your n8n workflow must end with a "Respond to Webhook" node that returns JSON with a text response:

```json
{
  "response": "Text response from the workflow",
  "execution_time": 123  // Optional execution time in ms
}
```

Example "Respond to Webhook" node configurations:

```javascript
// Chat response
{
  "response": items[0].json.aiResponse,
  "execution_time": Date.now() - items[0].json.startTime
}

// Translation response
{
  "response": items[0].json.translatedText,
  "execution_time": Date.now() - items[0].json.startTime
}

// Sentiment response
{
  "response": `Sentiment: ${items[0].json.sentiment}, Score: ${items[0].json.score}`,
  "execution_time": Date.now() - items[0].json.startTime
}
```

## Security Best Practices

1. **Webhook URLs**
   - Use non-guessable endpoint names
   - Always enable authentication
   - Consider using test mode during development

2. **Authentication**
   - Prefer JWT or Header Auth over Basic Auth
   - Use strong secrets and passwords
   - Rotate credentials regularly

3. **n8n Settings**
   - Enable HTTPS in production
   - Set appropriate response timeout
   - Use webhook deactivation when not in use

## Error Handling

Common n8n webhook errors:
- 401: Authentication failed
- 403: Invalid JWT or expired token
- 404: Webhook endpoint not found
- 429: Rate limit exceeded
- 500: Workflow execution error

The plugin provides detailed error messages and logs for debugging.