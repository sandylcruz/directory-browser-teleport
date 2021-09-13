import inMemoryDB from '../storage';

import type Directory from '../../../models/directory';

export const getAllDirectories = (): Promise<Array<Directory>> =>
  new Promise((resolve) => {
    const { directories } = inMemoryDB;

    resolve(directories);
  });

export type Breadcrumb = Pick<Directory, 'id' | 'name'>;

export interface GetFolderByIdResponse {
  breadcrumbs: Breadcrumb[];
  directory: Directory;
}

// NOTE: This is a depth-first, pre-order search/traversal. Depth-first is
// preferred over breadth-first since it'll probably consume less memory on
// average. Pre-order was chosen because it seems like most look-ups will
// probably be higher in the hierarchy. Maybe after getting statistics on actual
// usage, we could optimize given actual user behavior.
export const getDirectoryByIdWithBreadcrumbs = (
  id: string
): Promise<GetFolderByIdResponse | null> =>
  new Promise((resolve) => {
    const { directories } = inMemoryDB;
    const findDirectoryById = (
      id: string,
      node: Directory,
      breadcrumbs: Breadcrumb[]
    ): GetFolderByIdResponse | null => {
      if (node.type === 'dir' && node.id === id) {
        breadcrumbs.push({
          id: node.id,
          name: node.name,
        });
        return {
          breadcrumbs,
          directory: node,
        };
      }

      if (node.type === 'dir') {
        breadcrumbs.push({ id: node.id, name: node.name });
      }

      for (let i = 0; i < node.items.length; i++) {
        const child = node.items[i];

        if (child.type === 'dir') {
          const response = findDirectoryById(id, child, breadcrumbs);

          if (response) {
            return response;
          }
        }
      }

      breadcrumbs.pop();

      return null;
    };

    for (let i = 0; i < directories.length; i++) {
      const directory = directories[i];
      const breadcrumbs: Array<Breadcrumb> = [];

      const response = findDirectoryById(id, directory, breadcrumbs);

      if (response) {
        resolve(response);
        return;
      }
    }

    resolve(null);
  });

export const addDirectory = (directory: Directory): Promise<void> =>
  new Promise((resolve) => {
    const { directories } = inMemoryDB;

    inMemoryDB.directories = [...directories, directory];

    resolve();
  });
