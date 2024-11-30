export type AuthType = 'none' | 'basicAuth' | 'headerAuth' | 'jwtAuth';
export type JWTKeyType = 'passphrase' | 'pemKey';
export type JWTAlgorithm = 
  | 'HS256' | 'HS384' | 'HS512'
  | 'RS256' | 'RS384' | 'RS512'
  | 'ES256' | 'ES384' | 'ES512'
  | 'PS256' | 'PS384' | 'PS512';

export interface BasicAuth {
  username: string;
  password: string;
}

export interface HeaderAuth {
  name: string;
  value: string;
}

export interface JWTAuth {
  key_type: JWTKeyType;
  secret: string;
  algorithm: JWTAlgorithm;
}

export interface AuthConfig {
  type: AuthType;
  basic_auth?: BasicAuth;
  header_auth?: HeaderAuth;
  jwt_auth?: JWTAuth;
}

export interface N8nWebhookConfig {
  name: string;
  endpoint: string;
  test_mode?: boolean;
  timeout?: number;
  auth?: AuthConfig;
}

export interface MessageContext {
  data: Record<string, any>;
}

export interface Message {
  content: string;
  metadata?: Record<string, any>;
}

export interface N8nResponse {
  response: string;
  execution_time: number;
} 