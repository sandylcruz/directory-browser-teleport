import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DirectoryHeader from './DirectoryHeader';
import type { DirectoryItem } from '../../types';
import { fetchJson } from '../utilities';
import type { Directory as DirectoryType } from '../../types';
import Table from './Table';

const Directory: React.FC = () => {
  const { directoryPath = '' } = useParams<{ directoryPath: string }>();

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

  const filteredDirectoryItems: DirectoryItem[] = directoryItems
    ? directoryItems.filter(
        (item) =>
          item.name.toLowerCase().includes(filterText.toLowerCase()) ||
          item.type.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

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
      <Table directoryPath={directoryPath} rows={filteredDirectoryItems} />
    </>
  );
};

export default Directory;
