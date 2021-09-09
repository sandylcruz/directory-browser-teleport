import type { Request, Response } from 'express';
import * as AuthenticationController from '../authenticationController';

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
        const mockSendStatus = jest.fn();
        const mockResponse = generateMockResponse({
          sendStatus: mockSendStatus,
        });

        AuthenticationController.login(mockRequest, mockResponse, next);

        expect(mockSendStatus).toHaveBeenCalledTimes(1);
        expect(mockSendStatus).toHaveBeenLastCalledWith(422);
      });

      it('returns a 422 when no password is passed', () => {
        const mockRequest = generateMockRequest({
          body: { email: 'test@gmail.com' },
        });
        const mockSendStatus = jest.fn();
        const mockResponse = generateMockResponse({
          sendStatus: mockSendStatus,
        });

        AuthenticationController.login(mockRequest, mockResponse, next);

        expect(mockSendStatus).toHaveBeenCalledTimes(1);
        expect(mockSendStatus).toHaveBeenLastCalledWith(422);
      });
    });
  });

  describe('logout', () => {
    describe('handling of valid inputs', () => {
      it('returns a 201 on successful logout', () => {
        const mockRequest = generateMockRequest();
        const mockSendStatus = jest.fn();
        const mockResponse = generateMockResponse({
          sendStatus: mockSendStatus,
        });

        AuthenticationController.logout(mockRequest, mockResponse, next);

        expect(mockSendStatus).toHaveBeenCalledTimes(1);
        expect(mockSendStatus).toHaveBeenLastCalledWith(201);
      });
    });
  });
});
