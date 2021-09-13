import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import type { Bookmark } from '../../types';
import { fetchJson } from '../utilities';
import { useCurrentUser } from './CurrentUserProvider';

interface BookmarkContextValue {
  addBookmark: (directoryId: string) => void;
  bookmarks: Bookmark[];
  removeBookmark: (directoryId: string) => void;
}

const BookmarkContext = React.createContext<BookmarkContextValue>({
  addBookmark: () => {
    return;
  },
  bookmarks: [],
  removeBookmark: () => {
    return;
  },
});

const BookmarkProvider: React.FC = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetchJson<Bookmark[]>('/api/v1/bookmarks', {
        method: 'GET',
      }).then((bookmarks) => {
        setBookmarks(bookmarks);
      });
    }
  }, [currentUser]);

  const addBookmark = (directoryId: string) => {
    fetchJson<Bookmark>(`/api/v1/folders/${directoryId}/bookmark`, {
      method: 'POST',
    }).then((bookmark) => {
      setBookmarks((previousBookmarks) => [...previousBookmarks, bookmark]);
    });
  };

  const removeBookmark = (directoryId: string) => {
    fetchJson<Bookmark>(`/api/v1/folders/${directoryId}/bookmark`, {
      method: 'DELETE',
    }).then(() => {
      setBookmarks((previousBookmarks) =>
        previousBookmarks.filter(
          (bookmark) => bookmark.directoryId !== directoryId
        )
      );
    });
  };

  const value = {
    addBookmark,
    bookmarks,
    removeBookmark,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = (): BookmarkContextValue =>
  useContext(BookmarkContext);

export default BookmarkProvider;
