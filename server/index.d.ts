import { Request as ExpressRequest } from 'express';
import { UserRole } from './models/user.model';

export interface AuthToken {
  jti: string
  user_id: string
  role: UserRole
  iat: number
  exp: number
}

export type Request<P = null> = ExpressRequest<P> & {
  user: AuthToken
}
