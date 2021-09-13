import inMemoryDB from '../storage';

import type Bookmark from '../../../models/bookmark';

export const addBookmark = (bookmark: Bookmark): Promise<void> =>
  new Promise((resolve) => {
    const { bookmarks } = inMemoryDB;

    bookmarks.push(bookmark);

    resolve();
  });

export const findBookmarkById = (
  userId: string,
  directoryId: string
): Promise<Bookmark | null> =>
  new Promise((resolve) => {
    const { bookmarks } = inMemoryDB;

    const bookmark = bookmarks.find(
      (bookmark) =>
        bookmark.userId === userId && bookmark.directoryId === directoryId
    );
    if (!bookmark) {
      resolve(null);
    } else {
      resolve(bookmark);
    }
  });

export const removeBookmark = (bookmarkId: string): Promise<void> =>
  new Promise((resolve) => {
    const { bookmarks } = inMemoryDB;

    const bookmarkIndex = bookmarks.findIndex(
      (bookmark) => bookmark.id === bookmarkId
    );

    bookmarks.splice(bookmarkIndex, 1);

    resolve();
  });

export const getAllBookmarks = (userId: string): Promise<Bookmark[]> =>
  new Promise((resolve) => {
    const { bookmarks } = inMemoryDB;

    resolve(bookmarks.filter((bookmark) => bookmark.userId === userId));
  });
