import type { Directory, File } from '../../types';

export type DirectoryItemWithBookmark = File | DirectoryWithBookmark;

export interface DirectoryWithBookmark extends Directory {
  isBookmarked: boolean;
}
