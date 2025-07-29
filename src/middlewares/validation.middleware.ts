import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { handleError } from '../utils/errorHandler';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return handleError(res, errors.array(), 400, 'Validation error');
  }

  next();
};