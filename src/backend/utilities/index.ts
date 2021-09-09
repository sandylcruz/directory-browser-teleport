import fs from 'fs';
import path from 'path';
import readline from 'readline';

export const appendToTable = (
  fileName: string,
  data: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tablePath = path.join(__dirname, '../db', `${fileName}.csv`);
    fs.appendFile(tablePath, data, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const ensureDbFilesExist = (): void => {
  fileEntries.forEach((entry) => {
    if (!fs.existsSync(entry.file)) {
      console.log(
        `Unable to find database file for ${entry.file}. Writing file now...`
      );

      const data = entry.lines.join('\n');

      fs.writeFileSync(entry.file, data);
    }
  });
};

export const findInFile = <T>(
  fileName: string,
  headers: string,
  callback: (entity: T) => boolean,
  lineParser: (line: string) => T
): Promise<T | null> =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(
      path.join(__dirname, '../db', `${fileName}.csv`)
    );

    const lineReader = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    lineReader.on('line', (line) => {
      if (lineNumber === 0) {
        if (line !== headers) {
          fileStream.destroy();
          throw new Error(
            'Expected table to have appropriate columns, but it did not.'
          );
        }
      } else {
        const entity = lineParser(line);
        const isDesiredEntity = callback(entity);

        if (isDesiredEntity) {
          fileStream.destroy();
          resolve(entity);
        }
      }

      lineNumber++;
    });

    lineReader.on('close', () => {
      resolve(null);
    });
  });

export const filterFileRows = <T>(
  fileName: string,
  headers: string,
  callback: (entity: T) => boolean,
  lineParser: (line: string) => T
): Promise<void> => {
  const filePath = path.join(__dirname, '../db', `${fileName}.csv`);

  return new Promise<string[]>((resolve) => {
    const fileStream = fs.createReadStream(filePath);

    const lineReader = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    const lines: string[] = [];

    lineReader.on('line', (line) => {
      if (lines.length === 0) {
        if (line !== headers) {
          fileStream.destroy();
          throw new Error(
            'Expected table to have appropriate columns, but it did not.'
          );
        }
        lines.push(line);
      } else {
        const entity = lineParser(line);
        const isDesiredEntity = callback(entity);
        if (isDesiredEntity) {
          lines.push(line);
        }
      }
    });

    lineReader.on('close', () => {
      resolve(lines);
    });
  }).then(
    (lines) =>
      new Promise((resolve) => {
        fs.writeFile(filePath, lines.join('\n'), (err) => {
          if (err) {
            throw new Error('Unexpected error writing file.');
          }

          resolve();
        });
      })
  );
};

export const getNextId = (fileName: string): Promise<number> => {
  return new Promise((resolve) => {
    // validate first line is id not something else
    const fileStream = fs.createReadStream(
      path.join(__dirname, '../db', `${fileName}.csv`)
    );

    const lineReader = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lastLineSeen: string | null = null;

    let lineNumber = 0;

    // get the last line, then parse it for the id
    lineReader.on('line', (line) => {
      if (lineNumber === 0) {
        if (!line.startsWith('id')) {
          throw new Error('Expected line to start with `id`, but it did not.');
        }
      } else {
        lastLineSeen = line;
      }

      lineNumber++;
    });

    lineReader.on('close', () => {
      if (lastLineSeen === null) {
        resolve(1);
      } else {
        const id = lastLineSeen.split(',')[0];
        const idAsNumber = Number(id);
        resolve(idAsNumber + 1);
      }
    });
  });
};

const sessionTokensPath = path.join(__dirname, '../db/sessionTokens.csv');
const usersDbPath = path.join(__dirname, '../db/users.csv');

interface DbFileEntry {
  file: string;
  lines: Array<string>;
}

const fileEntries: Array<DbFileEntry> = [
  {
    file: sessionTokensPath,
    lines: ['id,userId,expirationDate,token'],
  },
  {
    file: usersDbPath,
    lines: [
      'id,email,passwordDigest',
      // User mock seed: (email is test@gmail.com, password is 123456)
      '1,test@gmail.com,d97bfaea9d6a9f567bd0fc1dbed08b29:a281dce81ff31a79e352cef6f646167915b2451da6160619832e20805941eec7819ae5065927cb4c66fb5f9ed59122bbfc19fab17c3d4814606d688d5041afb3',
    ],
  },
];
