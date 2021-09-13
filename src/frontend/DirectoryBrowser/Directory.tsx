import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import DirectoryHeader from './DirectoryHeader';
import type { DirectoryItemWithBookmark } from './types';
import { fetchJson } from '../utilities';
import type { GetFolderByIdResponse } from '../../types';
import Table from './Table';
import { useBookmarks } from '../providers/BookmarkProvider';

const Directory = React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const [directoryData, setDirectoryData] =
    useState<GetFolderByIdResponse | null>(null);
  const [filterText, setFilterText] = useState('');
  const { bookmarks } = useBookmarks();

  useEffect(() => {
    fetchJson<GetFolderByIdResponse>(`/api/v1/folders/${id}`).then(
      (directoryData) => {
        setDirectoryData(directoryData);
      }
    );
  }, [id]);

  useEffect(() => {
    setFilterText('');
  }, [id]);

  const { directory } = directoryData || {};
  const { items: directoryItems } = directory || {};

  const filteredDirectoryItems = useMemo<DirectoryItemWithBookmark[]>(() => {
    const bookmarkedDirectoriesSet = new Set(
      bookmarks.map((bookmark) => bookmark.directoryId)
    );

    return directoryItems
      ? directoryItems
          .filter(
            (item) =>
              item.name.toLowerCase().includes(filterText.toLowerCase()) ||
              item.type.toLowerCase().includes(filterText.toLowerCase())
          )
          .map((directoryItem) => {
            if (directoryItem.type === 'dir') {
              return {
                ...directoryItem,
                isBookmarked: bookmarkedDirectoriesSet.has(directoryItem.id),
              };
            }

            return directoryItem;
          })
      : [];
  }, [bookmarks, directoryItems, filterText]);

  if (directoryData === null) {
    return <div>loading...</div>;
  }

  const { breadcrumbs } = directoryData;

  return (
    <>
      <DirectoryHeader
        breadcrumbs={breadcrumbs}
        filterValue={filterText}
        onFilterChange={setFilterText}
      />
      <Table folderId={id} rows={filteredDirectoryItems} />
    </>
  );
});

export default Directory;
