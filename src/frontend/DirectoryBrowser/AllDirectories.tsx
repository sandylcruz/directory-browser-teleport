import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

import type { Directory } from '../../types';
import { fetchJson } from '../utilities';
import Table from './Table';
import { useBookmarks } from '../providers/BookmarkProvider';

const AllDirectories = React.memo(() => {
  const [directories, setDirectories] = useState<Directory[] | null>(null);

  const { bookmarks } = useBookmarks();

  useEffect(() => {
    fetchJson<Directory[]>('/api/v1/folders').then((directories) => {
      setDirectories(directories);
    });
  }, []);

  const directoriesWithBookmarks = useMemo(() => {
    const bookmarkedDirectoriesSet = new Set(
      bookmarks.map((bookmark) => bookmark.directoryId)
    );

    return directories
      ? directories.map((directory) => ({
          ...directory,
          isBookmarked: bookmarkedDirectoriesSet.has(directory.id),
        }))
      : [];
  }, [bookmarks, directories]);

  if (!directories) {
    return <div>loading...</div>;
  }

  return <Table folderId="" rows={directoriesWithBookmarks} />;
});

export default AllDirectories;
