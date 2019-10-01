import { UserInterface } from '../builtinModels/user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserInterface;
  }
  interface Response {
    user?: UserInterface;
  }
}
