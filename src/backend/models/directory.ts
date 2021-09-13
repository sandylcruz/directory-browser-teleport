import { generateId } from '../utilities';

import {
  getAllDirectories,
  getDirectoryByIdWithBreadcrumbs,
} from '../clients/inMemoryDB/directories';
import type { GetFolderByIdResponse } from '../clients/inMemoryDB/directories';

import type File from './file';

interface DirectoryProperties {
  id: string;
  items: Array<Directory | File>;
  name: string;
}

interface AllDirectoryProperties extends DirectoryProperties {
  sizeKb: 0;
  type: 'dir';
}

class Directory {
  id: string;
  items: Array<Directory | File>;
  name: string;
  sizeKb: 0;
  type: 'dir';

  static generate({ items, name }: Omit<DirectoryProperties, 'id'>): Directory {
    const id = generateId();
    return new Directory({ items, id, name });
  }

  static getAll(): Promise<Directory[]> {
    return getAllDirectories();
  }

  static getByIdWithBreadcrumbs(
    id: string
  ): Promise<GetFolderByIdResponse | null> {
    return getDirectoryByIdWithBreadcrumbs(id);
  }

  constructor({ items, id, name }: DirectoryProperties) {
    this.items = items;
    this.id = id;
    this.name = name;
    this.sizeKb = 0;
    this.type = 'dir';
  }

  toShallowJSON(): Omit<AllDirectoryProperties, 'items'> {
    return {
      id: this.id,
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
