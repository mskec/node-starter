import httpStatus from 'http-status';
import APIError from './APIError';


/**
 * Checks if the user is allowed to call the route.
 * Usage:
 *   router.use('/admin', authMiddleware(), aclMiddleware('admin'), adminRoutes);
 */
export default role => (req, res, next) => {
  const { user } = req;

  if (!user) {
    throw new APIError({ status: httpStatus.UNAUTHORIZED, isPublic: true });
  }

  if (user.role !== role) {
    throw new APIError({ status: httpStatus.FORBIDDEN, isPublic: true });
  }

  next();
};
