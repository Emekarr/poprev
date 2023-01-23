export enum TokenType {
  AccessToken = "access_token",
  RefreshToken = "refresh_token",
}

export interface UserAuthTokenPayload {
  email: string;
  userId: string;
  name: string;
  type: TokenType;
  iss: string;
}

export interface AdminAuthTokenPayload {
  email: string;
  adminId: string;
  name: string;
  type: TokenType;
  iss: string;
}
