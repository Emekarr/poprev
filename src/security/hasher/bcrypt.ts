import { HasherType } from "./type";

const bcrypt = require("bcrypt");

class Hasher implements HasherType {
  private hasher = bcrypt;

  private saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return this.hasher.hash(password, await this._genSalt());
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.hasher.compare(password, hash);
  }

  async _genSalt(): Promise<string> {
    return this.hasher.genSalt(this.saltRounds);
  }
}

export default Object.freeze(new Hasher());
