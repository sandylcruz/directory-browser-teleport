import * as AuthenticationController from '../authenticationController';

import type { Request, Response } from 'express';

describe('authentication controller', () => {
  const generateMockRequest = (overrides: Partial<Request> = {}): Request =>
    ({
      cookies: {},
      ...overrides,
    } as Request);
  const generateMockResponse = (overrides: Partial<Response> = {}): Response =>
    ({
      ...overrides,
    } as Response);

  const next = () => {
    return;
  };

  describe('login', () => {
    describe('handling of invalid inputs', () => {
      it('returns a 422 when no email is passed', () => {
        const mockRequest = generateMockRequest({
          body: { password: '123456' },
        });
        const mockJson = jest.fn();
        const mockStatus = jest.fn(() => ({ json: mockJson }));
        const mockResponse = generateMockResponse({
          status: mockStatus as unknown as Response['status'],
        });

        AuthenticationController.login(mockRequest, mockResponse, next);

        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenLastCalledWith(422);
        expect(mockJson).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenLastCalledWith({
          error:
            'Malformed request received. Please contact us to help resolve this error.',
        });
      });

      it('returns a 422 when no password is passed', () => {
        const mockRequest = generateMockRequest({
          body: { email: 'test@gmail.com' },
        });
        const mockJson = jest.fn();
        const mockStatus = jest.fn(() => ({ json: mockJson }));
        const mockResponse = generateMockResponse({
          status: mockStatus as unknown as Response['status'],
        });

        AuthenticationController.login(mockRequest, mockResponse, next);

        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenLastCalledWith(422);
        expect(mockJson).toHaveBeenLastCalledWith({
          error:
            'Malformed request received. Please contact us to help resolve this error.',
        });
      });
    });
  });

  describe('logout', () => {
    describe('handling of valid inputs', () => {
      it('returns a 200 on successful logout', () => {
        const mockRequest = generateMockRequest();
        const mockClearCookie = jest.fn();
        const mockJson = jest.fn();
        const mockResponse = generateMockResponse({
          json: mockJson,
          clearCookie: mockClearCookie,
        });

        AuthenticationController.logout(mockRequest, mockResponse, next);

        expect(mockJson).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenLastCalledWith({ message: 'OK' });
        expect(mockClearCookie).toHaveBeenCalledTimes(1);
        expect(mockClearCookie).toHaveBeenLastCalledWith('sessionToken');
      });
    });
  });
});
