import { Response } from 'express';
import { handleError } from '../../src/utils/errorHandler';

describe('handleError', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should handle an instance of Error', () => {
    const error = new Error('Test error');
    handleError(mockResponse as Response, error, 500, 'An error occurred');

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An error occurred',
      details: { error: 'Test error' },
    });
  });

  it('should use default statusCode and message when not provided', () => {
    const error = new Error('Default error');

    handleError(mockResponse as Response, error);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      details: { error: 'Default error' },
    });
  });

  it('should handle an object error', () => {
    const error = { field: 'name', message: 'Name is required' };
    handleError(mockResponse as Response, error, 400, 'Validation error');

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: { field: 'name', message: 'Name is required' },
    });
  });

  it('should handle a string error', () => {
    const error = 'A string error occurred';
    handleError(mockResponse as Response, error, 400, 'String error');

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'String error',
      details: { error: 'A string error occurred' },
    });
  });

  it('should handle null/undefined error', () => {
    handleError(mockResponse as Response, null, 500, 'Unknown error');

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unknown error',
    });
  });
});