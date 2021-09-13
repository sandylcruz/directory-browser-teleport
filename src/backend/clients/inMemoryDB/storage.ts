import type Bookmark from '../../models/bookmark';
import type Directory from '../../models/directory';
import type Session from '../../models/session';
import type User from '../../models/user';

interface InMemoryDB {
  bookmarks: Bookmark[];
  directories: Directory[];
  sessions: Session[];
  users: User[];
}

const inMemoryDB: InMemoryDB = {
  bookmarks: [],
  directories: [],
  sessions: [],
  users: [],
};

export default inMemoryDB;
