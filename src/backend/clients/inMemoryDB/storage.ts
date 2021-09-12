import type Session from '../../models/session';
import type User from '../../models/user';

interface InMemoryDB {
  sessions: Session[];
  users: User[];
}

const inMemoryDB: InMemoryDB = {
  sessions: [],
  users: [],
};

export default inMemoryDB;
