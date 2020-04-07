declare namespace Express {
  export interface EverseUser {
    id: number;
    name: string;
    email: string;
    developer: Boolean;
    verified: Boolean;
    disabled: Boolean;
  }

  export interface Request {
     user?: EverseUser
  }
}