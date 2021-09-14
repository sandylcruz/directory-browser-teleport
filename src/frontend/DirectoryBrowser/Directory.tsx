import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import DirectoryHeader from './DirectoryHeader';
import type { DirectoryItem } from '../../types';
import { fetchJson } from '../utilities';
import type { Directory as DirectoryType } from '../../types';
import Table from './Table';

const Directory = React.memo(() => {
  const location = useLocation();
  const directoryPath = location.pathname.replace(/^\/folders/, '');

  const [directory, setDirectory] = useState<DirectoryType | null>(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchJson<DirectoryType>(`/api/v1/folders/${directoryPath}`).then(
      (directory) => {
        setDirectory(directory);
      }
    );
  }, [directoryPath]);

  useEffect(() => {
    setFilterText('');
  }, [directoryPath]);

  const { items: directoryItems } = directory || {};

  const filteredDirectoryItems = useMemo<DirectoryItem[]>(
    () =>
      directoryItems
        ? directoryItems.filter(
            (item) =>
              item.name.toLowerCase().includes(filterText.toLowerCase()) ||
              item.type.toLowerCase().includes(filterText.toLowerCase())
          )
        : [],
    [directoryItems, filterText]
  );

  if (directory === null) {
    return <div>loading...</div>;
  }

  return (
    <>
      <DirectoryHeader
        directoryPath={directoryPath}
        filterValue={filterText}
        onFilterChange={setFilterText}
      />
      <Table
        directoryPath={directoryPath}
        folderId={directoryPath}
        rows={filteredDirectoryItems}
      />
    </>
  );
});

export default Directory;
