export interface HasherType {
  hashPassword(password: string): string;
  verifyPassword(password: string, hash: string): boolean;
  _genSalt(): number;
}
