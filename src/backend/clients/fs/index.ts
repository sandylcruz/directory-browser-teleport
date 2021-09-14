import { lstat, readdir } from 'fs/promises';
import path from 'path';

import Directory from '../../models/directory';
import File from '../../models/file';

const ROOT_PATH = path.join(__dirname, './directoryBrowserRoot');

interface PathStats {
  isDirectory: boolean;
  size: number;
}

const getPathStats = (absolutePath: string): Promise<PathStats | null> =>
  new Promise((resolve) => {
    lstat(absolutePath)
      .then((stats) => {
        resolve({
          isDirectory: stats.isDirectory(),
          size: stats.size,
        });
      })
      .catch(() => {
        resolve(null);
      });
  });

export const getDirectoryByPath = (
  inputPath: string
): Promise<Directory | null> => {
  const normalizedPath = path.normalize(inputPath);
  const absolutePath = path.join(ROOT_PATH, normalizedPath);

  return getPathStats(absolutePath).then((pathStats) => {
    if (pathStats && pathStats.isDirectory) {
      return readdir(absolutePath).then((directoryItems) =>
        Promise.all(
          directoryItems.map((directoryItem) => {
            const childAbsolutePath = path.join(absolutePath, directoryItem);
            return getPathStats(childAbsolutePath).then((pathStats) => {
              if (!pathStats) {
                // TODO: Handle this better. This could happen if something else
                // removes the path between the two reads.
                throw new Error(
                  `Expected to be able to read path, but could not: ${directoryItem}`
                );
              }

              const { isDirectory, size } = pathStats;

              return {
                directoryItem,
                isDirectory,
                size,
              };
            });
          })
        ).then((allDirectoryItemDescriptions) => {
          const directory = new Directory({
            items: allDirectoryItemDescriptions.map(
              ({ directoryItem, isDirectory, size }) => {
                if (isDirectory) {
                  return new Directory({
                    items: [],
                    name: directoryItem,
                  });
                } else {
                  return new File({
                    name: directoryItem,
                    sizeKb: size,
                  });
                }
              }
            ),
            name: normalizedPath,
          });
          return directory;
        })
      );
    } else {
      return null;
    }
  });
};
