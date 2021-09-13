import type BookmarkModel from './backend/models/bookmark';
import type DirectoryModel from './backend/models/directory';
import type FileModel from './backend/models/file';
import type UserModel from './backend/models/user';

export type Bookmark = ReturnType<BookmarkModel['toJSON']>;

export type Directory = ReturnType<DirectoryModel['toJSON']>;

export type File = ReturnType<FileModel['toJSON']>;

export interface Breadcrumb {
  id: string;
  name: string;
}

export interface GetFolderByIdResponse {
  breadcrumbs: Array<Breadcrumb>;
  directory: Directory;
}

export type User = ReturnType<UserModel['toJSON']>;
