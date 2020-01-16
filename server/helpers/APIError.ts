import httpStatus from 'http-status';

class ExtendableError extends Error {
  public status: number;
  public isPublic: boolean;
  public isOperational: boolean;
  constructor(message, status, isPublic) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this);
  }
}

class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor({ message = '', status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false }) {
    super(message || httpStatus[status], status, isPublic);
  }
}


export default APIError;
