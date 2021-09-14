import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import DirectoryHeader from './DirectoryHeader';
import type { DirectoryItem } from '../../types';
import { fetchJson } from '../utilities';
import type { GetFolderByIdResponse } from '../../types';
import Table from './Table';

const Directory = React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const [directoryData, setDirectoryData] =
    useState<GetFolderByIdResponse | null>(null);
  const [filterText, setFilterText] = useState('');

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

  if (directoryData === null) {
    return <div>loading...</div>;
  }

  const { path } = directoryData;

  return (
    <>
      <DirectoryHeader
        path={path}
        filterValue={filterText}
        onFilterChange={setFilterText}
      />
      <Table folderId={id} rows={filteredDirectoryItems} />
    </>
  );
});

export default Directory;
