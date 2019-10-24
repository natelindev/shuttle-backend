import { UserInterface } from '../builtinModels/user';

interface ExtendedUser extends UserInterface {
  id: string;
}
declare module 'express-serve-static-core' {
  interface Request {
    user?: ExtendedUser;
  }
  interface Response {
    user?: ExtendedUser;
  }
}
