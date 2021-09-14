import type DirectoryModel from './backend/models/directory';
import type FileModel from './backend/models/file';
import type UserModel from './backend/models/user';

export type Directory = ReturnType<DirectoryModel['toJSON']>;

export type File = ReturnType<FileModel['toJSON']>;

export type DirectoryItem = Directory | File;

export interface Path {
  id: string;
  name: string;
}

export interface GetFolderByIdResponse {
  path: Array<Path>;
  directory: Directory;
}

export type User = ReturnType<UserModel['toJSON']>;
