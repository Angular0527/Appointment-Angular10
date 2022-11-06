import { Timestamp } from "firebase/firestore";

export class User {
  constructor(public email: string,public uid: string,public _token : string, public _tokenExpirationTime: Date) {}

  get token() {
    if(!this._tokenExpirationTime || new Date() > this._tokenExpirationTime) {
      return null;
    }
    return this._token;
  }
}

