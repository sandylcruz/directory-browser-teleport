import { generateId } from '../utilities';

import { getAllBookmarks } from '../clients/inMemoryDB/bookmarks';

export interface BookmarkAttributes {
  directoryId: string;
  id: string;
  userId: string;
}

class Bookmark {
  directoryId: string;
  id: string;
  userId: string;

  static generate({
    directoryId,
    userId,
  }: Omit<BookmarkAttributes, 'id'>): Bookmark {
    const id = generateId();
    return new Bookmark({ directoryId, id, userId });
  }

  static getAll(userId: string): Promise<Bookmark[]> {
    return getAllBookmarks(userId);
  }

  constructor({ directoryId, id, userId }: BookmarkAttributes) {
    this.directoryId = directoryId;
    this.id = id;
    this.userId = userId;
  }

  toJSON(): BookmarkAttributes {
    return {
      directoryId: this.directoryId,
      id: this.id,
      userId: this.userId,
    };
  }
}

export default Bookmark;
