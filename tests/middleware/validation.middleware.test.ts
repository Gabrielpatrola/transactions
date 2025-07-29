import { validate } from '../../src/middlewares/validation.middleware';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { handleError } from '../../src/utils/errorHandler';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));
jest.mock('../../src/utils/errorHandler', () => ({
  handleError: jest.fn(),
}));

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next if there are no validation errors', () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });

    validate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockNext).toHaveBeenCalled();
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should call handleError if there are validation errors', () => {
    const mockErrors = [{ msg: 'Invalid value', param: 'email' }];
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue(mockErrors),
    });

    validate(mockRequest as Request, mockResponse as Response, mockNext);

    expect(validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockNext).not.toHaveBeenCalled();
    expect(handleError).toHaveBeenCalledWith(
      mockResponse,
      mockErrors,
      400,
      'Validation error'
    );
  });
});