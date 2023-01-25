export enum TokenType {
  AccessToken = "access_token",
  RefreshToken = "refresh_token",
}

export interface AuthTokenType {
  email: string;
  userId?: string;
  adminId?: string;
  name: string;
  type: TokenType;
  iss: string;
}

export interface UserAuthTokenPayload extends AuthTokenType {
  email: string;
  userId: string;
  name: string;
  type: TokenType;
  iss: string;
}

export interface AdminAuthTokenPayload extends AuthTokenType {
  email: string;
  adminId: string;
  name: string;
  type: TokenType;
  iss: string;
}
