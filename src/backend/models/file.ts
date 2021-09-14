interface FileProperties {
  name: string;
  sizeKb: number;
}

interface AllFileProperties extends FileProperties {
  type: 'file';
}

class File {
  name: string;
  sizeKb: number;
  type: 'file';

  static generate({ name, sizeKb }: Omit<FileProperties, 'id'>): File {
    return new File({ name, sizeKb });
  }

  constructor({ name, sizeKb }: FileProperties) {
    this.name = name;
    this.sizeKb = sizeKb;
    this.type = 'file';
  }

  toJSON(): AllFileProperties {
    return {
      name: this.name,
      sizeKb: this.sizeKb,
      type: this.type,
    };
  }
}

export default File;
