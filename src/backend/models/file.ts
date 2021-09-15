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

export const generate = ({ name, sizeKb }: Omit<FileProperties, 'id'>): File =>
  new File({ name, sizeKb });

export default File;
