import { Request as ExpressRequest } from 'express';
import { UserRole } from './models/user.model';

export interface AuthToken {
  jti: string
  user_id: string
  role: UserRole
  iat: number
  exp: number
}

export interface Request<P = null> extends ExpressRequest<P> {
  user: AuthToken
}
