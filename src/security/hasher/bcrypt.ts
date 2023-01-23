import { HasherType } from "./type";

const bcrypt = require("bcrypt");

class Hasher implements HasherType {
  private hasher = bcrypt;

  private saltRounds = 10;

  hashPassword(password: string): string {
    return this.hasher.hash(password, this._genSalt());
  }

  verifyPassword(password: string, hash: string): boolean {
    return this.hasher.compare(password, hash);
  }

  _genSalt(): number {
    return this.hasher.genSalt(this.saltRounds);
  }
}

export default Object.freeze(new Hasher());
