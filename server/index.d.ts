import { Request as ExpressRequest } from 'express';
import { UserRole } from './models/user.model';

export interface Request<P = null> extends ExpressRequest<P> {
  user: {
    user_id: string
    role: UserRole
  }
}
