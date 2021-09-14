import * as FoldersController from '../foldersController';
import * as DirectoriesInMemoryDB from '../../clients/inMemoryDB/directories';
import Directory from '../../models/directory';
import File from '../../models/file';

import type { Request, Response } from 'express';
import type { User } from '../../../types';
import type { GetFolderByIdResponse } from '../../clients/inMemoryDB/directories';

jest.mock('../../clients/inMemoryDB/directories', () => ({
  getAllDirectories: jest.fn(() => Promise.resolve([])),
  getDirectoryByIdWithPath: jest.fn(() => Promise.resolve(null)),
}));

const getAllDirectories =
  DirectoriesInMemoryDB.getAllDirectories as jest.MockedFunction<
    typeof DirectoriesInMemoryDB['getAllDirectories']
  >;
const getDirectoryByIdWithPath =
  DirectoriesInMemoryDB.getDirectoryByIdWithPath as jest.MockedFunction<
    typeof DirectoriesInMemoryDB['getDirectoryByIdWithPath']
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

  describe('getFolders', () => {
    beforeEach(() => {
      getAllDirectories.mockClear();
      getAllDirectories.mockImplementation(() => Promise.resolve([]));
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

      FoldersController.getFolders(mockRequest, mockResponse, next);

      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenLastCalledWith(401);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenLastCalledWith({
        error: 'You must be logged in to make this request.',
      });
    });

    it('returns the expected data if you are logged in', () => {
      getAllDirectories.mockImplementation(() =>
        Promise.resolve([
          Directory.generate({ name: 'A', items: [] }),
          Directory.generate({ name: 'B', items: [] }),
        ])
      );

      const mockRequest = generateMockRequest({});
      const mockJson = jest.fn();
      const mockResponse = generateMockResponse({
        json: mockJson,
      });

      FoldersController.getFolders(mockRequest, mockResponse, next);

      expect(getAllDirectories).toHaveBeenCalledTimes(1);

      const lastPromise = getAllDirectories.mock.results[0].value;

      return lastPromise.then(() => {
        expect(mockJson).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenLastCalledWith([
          expect.objectContaining({
            name: 'A',
          }),
          expect.objectContaining({
            name: 'B',
          }),
        ]);
      });
    });
  });

  describe('getFolderById', () => {
    beforeEach(() => {
      getDirectoryByIdWithPath.mockClear();
      getDirectoryByIdWithPath.mockImplementation(() => Promise.resolve(null));
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

      FoldersController.getFolderById(mockRequest, mockResponse, next);

      expect(mockStatus).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenLastCalledWith(401);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenLastCalledWith({
        error: 'You must be logged in to make this request.',
      });
    });

    it('returns a 404 with the correct error message if a directory is not found', () => {
      const mockRequest = generateMockRequest({
        params: {
          folderId: '123',
        },
      });
      const mockJson = jest.fn();
      const mockStatus = jest.fn(() => ({ json: mockJson }));
      const mockResponse = generateMockResponse({
        status: mockStatus as unknown as Response['status'],
      });

      FoldersController.getFolderById(mockRequest, mockResponse, next);

      expect(getDirectoryByIdWithPath).toHaveBeenCalledTimes(1);

      const lastPromise = getAllDirectories.mock.results[0].value;

      return lastPromise.then(() => {
        expect(mockStatus).toHaveBeenCalledTimes(1);
        expect(mockStatus).toHaveBeenLastCalledWith(404);
        expect(mockJson).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenLastCalledWith({
          error: 'Unable to find a directory with an id of: 123',
        });
      });
    });

    it('returns the correct data when a folder is found', () => {
      const mockId = '123';
      const mockFolderResponse: GetFolderByIdResponse = {
        path: [
          {
            id: 'a',
            name: 'A',
          },
          {
            id: 'b',
            name: 'B',
          },
        ],
        directory: Directory.generate({
          name: 'B',
          items: [
            File.generate({
              name: 'C.go',
              sizeKb: 100,
            }),
          ],
        }),
      };

      getDirectoryByIdWithPath.mockImplementation((id) => {
        if (id === mockId) {
          return Promise.resolve(mockFolderResponse);
        } else {
          return Promise.resolve(null);
        }
      });
      const mockRequest = generateMockRequest({
        params: {
          folderId: mockId,
        },
      });
      const mockJson = jest.fn();
      const mockResponse = generateMockResponse({
        json: mockJson,
      });

      FoldersController.getFolderById(mockRequest, mockResponse, next);

      expect(getDirectoryByIdWithPath).toHaveBeenCalledTimes(1);

      const lastPromise = getAllDirectories.mock.results[0].value;

      return lastPromise.then(() => {
        expect(mockJson).toHaveBeenCalledTimes(1);
        expect(mockJson).toHaveBeenLastCalledWith(mockFolderResponse);
      });
    });
  });
});
