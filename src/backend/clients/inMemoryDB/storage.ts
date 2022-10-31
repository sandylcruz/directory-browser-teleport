import type Directory from '../../models/directory';
import type Session from '../../models/session';
import type User from '../../models/user';

interface InMemoryDB {
  directories: Directory[];
  sessions: Session[];
  users: User[];
}

const inMemoryDB: InMemoryDB = {
  directories: [],
  sessions: [],
  users: [],
};

export default inMemoryDB;
