import { generateId } from '../utilities';

interface FileProperties {
  id: string;
  name: string;
  sizeKb: number;
}

interface AllFileProperties extends FileProperties {
  type: 'file';
}

class File {
  id: string;
  name: string;
  sizeKb: number;
  type: 'file';

  static generate({ name, sizeKb }: Omit<FileProperties, 'id'>): File {
    const id = generateId();
    return new File({ id, name, sizeKb });
  }

  constructor({ id, name, sizeKb }: FileProperties) {
    this.id = id;
    this.name = name;
    this.sizeKb = sizeKb;
    this.type = 'file';
  }

  toJSON(): AllFileProperties {
    return {
      id: this.id,
      name: this.name,
      sizeKb: this.sizeKb,
      type: this.type,
    };
  }
}

export default File;
