import * as React from 'react';
import { useEffect, useState } from 'react';

import type { Directory } from '../../types';
import { fetchJson } from '../utilities';
import Table from './Table';

const AllDirectories = React.memo(() => {
  const [directories, setDirectories] = useState<Directory[] | null>(null);

  useEffect(() => {
    fetchJson<Directory[]>('/api/v1/folders').then((directories) => {
      setDirectories(directories);
    });
  }, []);
  if (!directories) {
    return <div>loading...</div>;
  }

  return <Table folderId="" rows={directories} />;
});

export default AllDirectories;
