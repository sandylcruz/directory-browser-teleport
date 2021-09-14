import type DirectoryModel from './backend/models/directory';
import type FileModel from './backend/models/file';
import type UserModel from './backend/models/user';

export type Directory = ReturnType<DirectoryModel['toJSON']>;

export type File = ReturnType<FileModel['toJSON']>;

export type DirectoryItem = Directory | File;

export type User = ReturnType<UserModel['toJSON']>;
