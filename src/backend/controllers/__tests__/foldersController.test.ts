import * as FoldersController from '../foldersController';
import * as FsClient from '../../clients/fs';
import Directory from '../../models/directory';
import * as File from '../../models/file';

import type { Request, Response } from 'express';
import type { User } from '../../../types';

jest.mock('../../clients/fs', () => ({
  getDirectoryByPath: jest.fn(() => Promise.resolve([])),
}));

const getDirectoryByPath = FsClient.getDirectoryByPath as jest.MockedFunction<
  typeof FsClient['getDirectoryByPath']
>;

describe('folders controller', () => {
  const mockCurrentUser: User = {
    id: '123',
    email: 'test@gmail.com',
  };
  const generateMockRequest = (overrides: Partial<Request> = {}): Request =>
    ({
      currentUser: mockCurrentUser,
      ...overrides,
    } as Request);
  const generateMockResponse = (overrides: Partial<Response> = {}): Response =>
    ({
      ...overrides,
    } as Response);

  const next = () => {
    return;
  };

  describe('getFolderByPath', () => {
    beforeEach(() => {
      getDirectoryByPath.mockClear();
      getDirectoryByPath.mockImplementation(() => Promise.resolve(null));
    });

    it('returns a 401 with the correct error message if not logged in', () => {
      const mockRequest = generateMockRequest({
        currentUser: undefined,
      });
      const mockJson = jest.fn();
      const mockStatus = jest.fn(() => ({ json: mockJson }));
      const mockResponse = generateMockResponse({
        status: mockStatus as unknown as Response['status'],
      });

      FoldersController.getFolderByPath(mockRequest, mockResponse, next);

      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenLastCalledWith(401);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenLastCalledWith({
        error: 'You must be logged in to make this request.',
      });
    });

    it('returns a 404 with the correct error message if a directory is not found', () => {
      const mockRequest = generateMockRequest({
        path: '/123',
      });
      const mockJson = jest.fn();
      const mockStatus = jest.fn(() => ({ json: mockJson }));
      const mockResponse = generateMockResponse({
        status: mockStatus as unknown as Response['status'],
      });

      FoldersController.getFolderByPath(mockRequest, mockResponse, next);

      expect(getDirectoryByPath).toHaveBeenCalledTimes(1);

      const lastPromise = getDirectoryByPath.mock.results[0].value;

      return lastPromise.then(() => {
        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenLastCalledWith(404);
        expect(mockJson).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenLastCalledWith({
          error: 'Unable to find a directory with an path of: /123',
        });
      });
    });

    it('returns the correct data when a folder is found', () => {
      const mockId = '123';
      const mockFolderResponse = new Directory({
        name: 'B',
        items: [
          File.generate({
            name: 'C.go',
            sizeKb: 100,
          }),
        ],
      });

      getDirectoryByPath.mockImplementation((id) => {
        if (id === mockId) {
          return Promise.resolve(mockFolderResponse);
        } else {
          return Promise.resolve(null);
        }
      });
      const mockRequest = generateMockRequest({
        path: mockId,
      });
      const mockJson = jest.fn();
      const mockResponse = generateMockResponse({
        json: mockJson,
      });

      FoldersController.getFolderByPath(mockRequest, mockResponse, next);

      expect(getDirectoryByPath).toHaveBeenCalledTimes(1);

      const lastPromise = getDirectoryByPath.mock.results[0].value;

      return lastPromise.then(() => {
        expect(mockJson).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenLastCalledWith(mockFolderResponse);
      });
    });
  });
});
