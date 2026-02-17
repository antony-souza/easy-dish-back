import { IUserAuth } from "./user-auth.type.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUserAuth;
    }
  }
}
