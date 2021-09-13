import Directory from '../../../models/directory';
import File from '../../../models/file';

export const generateMockTeleportDirectory = (): Directory =>
  Directory.generate({
    name: 'teleport',
    items: [
      Directory.generate({
        name: 'lib',
        items: [
          File.generate({
            name: 'teleport.go',
            sizeKb: 320,
          }),
          File.generate({
            name: 'test.go',
            sizeKb: 3320,
          }),
        ],
      }),
      File.generate({
        name: 'README.md',
        sizeKb: 4340,
      }),
    ],
  });

export const generateMockMyCatsDirectory = (): Directory =>
  Directory.generate({
    name: 'cats',
    items: [
      Directory.generate({
        name: 'favorites',
        items: [
          File.generate({
            name: 'linus.jpeg',
            sizeKb: 4000,
          }),
          File.generate({
            name: 'callie.png',
            sizeKb: 2500,
          }),
          Directory.generate({
            name: 'neighborhood cats',
            items: [
              File.generate({
                name: 'bongo.jpeg',
                sizeKb: 6000,
              }),
            ],
          }),
        ],
      }),
      Directory.generate({
        name: 'trouble-makers',
        items: [
          File.generate({
            name: 'phoenix.svg',
            sizeKb: 49500,
          }),
        ],
      }),
    ],
  });
