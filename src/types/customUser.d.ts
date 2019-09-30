declare namespace Express {
  export interface Request {
    user?: import('../builtinModels/user').UserInterface;
  }
}
