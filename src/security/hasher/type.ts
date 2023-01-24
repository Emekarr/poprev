export interface HasherType {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  _genSalt(): Promise<string>;
}
