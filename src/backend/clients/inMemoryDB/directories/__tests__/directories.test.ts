import { getDirectoryByIdWithBreadcrumbs } from '../';
import Directory from '../../../../models/directory';
import File from '../../../../models/file';

import inMemoryDB from '../../storage';

describe('getDirectoryByIdWithBreadcrumbs()', () => {
  const originalInMemoryDBValues = inMemoryDB.directories;

  beforeEach(() => {
    inMemoryDB.directories = [];
  });

  afterEach(() => {
    inMemoryDB.directories = originalInMemoryDBValues;
  });

  it('return null when no directory is found', () => {
    return getDirectoryByIdWithBreadcrumbs('123').then((response) => {
      expect(response).toBe(null);
    });
  });

  it('return the correct data in the simplest case', () => {
    const mockTargetDirectory = Directory.generate({
      name: 'A',
      items: [],
    });
    const mockDirectories = [mockTargetDirectory];

    inMemoryDB.directories = mockDirectories;

    return getDirectoryByIdWithBreadcrumbs(mockTargetDirectory.id).then(
      (response) => {
        expect(response).toEqual({
          breadcrumbs: [{ id: mockTargetDirectory.id, name: 'A' }],
          directory: mockTargetDirectory,
        });
      }
    );
  });

  it('return the correct data when finding a top-level directory that has nested data', () => {
    const mockTargetDirectory = Directory.generate({
      name: 'A',
      items: [
        Directory.generate({
          name: 'B',
          items: [
            Directory.generate({
              name: 'C',
              items: [
                File.generate({
                  name: 'c.go',
                  sizeKb: 1000,
                }),
              ],
            }),
          ],
        }),
      ],
    });
    const mockDirectories = [mockTargetDirectory];

    inMemoryDB.directories = mockDirectories;

    return getDirectoryByIdWithBreadcrumbs(mockTargetDirectory.id).then(
      (response) => {
        expect(response).toEqual({
          breadcrumbs: [{ id: mockTargetDirectory.id, name: 'A' }],
          directory: mockTargetDirectory,
        });
      }
    );
  });

  it('return the correct data when finding a more deeply-nested folder', () => {
    const mockTargetDirectory = Directory.generate({
      name: 'B',
      items: [
        Directory.generate({
          name: 'C',
          items: [
            File.generate({
              name: 'c.go',
              sizeKb: 1000,
            }),
          ],
        }),
      ],
    });
    const mockDirectories = [
      Directory.generate({
        name: 'A',
        items: [mockTargetDirectory],
      }),
    ];

    inMemoryDB.directories = mockDirectories;

    return getDirectoryByIdWithBreadcrumbs(mockTargetDirectory.id).then(
      (response) => {
        expect(response).toEqual({
          breadcrumbs: [
            { id: mockDirectories[0].id, name: 'A' },
            { id: mockTargetDirectory.id, name: 'B' },
          ],
          directory: mockTargetDirectory,
        });
      }
    );
  });
});
