import { getDirectoryByPath } from '../clients/fs';

import type File from './file';

interface DirectoryProperties {
  items: Array<Directory | File>;
  name: string;
}

interface AllDirectoryProperties extends DirectoryProperties {
  sizeKb: 0;
  type: 'dir';
}

class Directory {
  items: Array<Directory | File>;
  name: string;
  sizeKb: 0;
  type: 'dir';

  static getByPath(path: string): Promise<Directory | null> {
    return getDirectoryByPath(path);
  }

  constructor({ items, name }: DirectoryProperties) {
    this.items = items;
    this.name = name;
    this.sizeKb = 0;
    this.type = 'dir';
  }

  toShallowJSON(): Omit<AllDirectoryProperties, 'items'> {
    return {
      name: this.name,
      sizeKb: this.sizeKb,
      type: this.type,
    };
  }

  toJSON(): AllDirectoryProperties {
    return {
      ...this.toShallowJSON(),
      items: this.items,
    };
  }
}

export default Directory;
