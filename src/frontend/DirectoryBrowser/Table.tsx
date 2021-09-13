import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { DirectoryItemWithBookmark, DirectoryWithBookmark } from './types';
import { useBookmarks } from '../providers/BookmarkProvider';

const ColumnButton = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid white;
  &:hover {
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  }
`;

const ColumnTd = styled.td`
  padding: 10px;
`;

const FolderTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[300]};
`;

const Input = styled.input`
  margin: 0;
  padding: 0;
`;

const RowTd = styled.td`
  border-top: 1px solid ${({ theme }) => theme.colors.grey[300]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[300]};
  padding: 10px;
`;

const StyledTable = styled.table`
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  width: 100%;
  border-spacing: 0;
`;

const StyledTBody = styled.tbody`
  border: 1px solid black;
`;

interface TableColumnProps {
  arrowStatus: 'up' | 'down' | 'none';
  children: string;
  onSortClick: (column: SortProperty) => void;
  property: SortProperty;
}

const TableColumn: React.FC<TableColumnProps> = ({
  arrowStatus,
  children,
  onSortClick,
  property,
}) => {
  const handleClick = () => {
    onSortClick(property);
  };

  return (
    <ColumnTd>
      <ColumnButton onClick={handleClick}>
        {arrowStatus === 'up' ? '↑' : null}
        {arrowStatus === 'down' ? '↓' : null}
        {children}
      </ColumnButton>
    </ColumnTd>
  );
};

interface TableProps {
  folderId: string;
  rows: DirectoryItemWithBookmark[];
}

type SortProperty = 'name' | 'sizeKb' | 'type';

interface SortState {
  property: SortProperty;
  direction: 'asc' | 'desc';
}

const COLUMNS = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Size',
    key: 'sizeKb',
  },
  {
    title: 'Type',
    key: 'type',
  },
] as const;

const DEFAULT_SORT_STATE = {
  property: 'name',
  direction: 'asc',
} as const;

interface RowProps {
  onBookmarkChange: (value: DirectoryWithBookmark) => void;
  row: DirectoryItemWithBookmark;
}

const Row = React.memo<RowProps>(({ onBookmarkChange, row }) => {
  const handleBookmarkChange = () => {
    if (row.type === 'dir') {
      onBookmarkChange(row);
    }
  };

  return (
    <tr key={row.id}>
      <RowTd>
        {row.type === 'dir' ? (
          <Link to={`/folders/${row.id}`}>{row.name}</Link>
        ) : (
          row.name
        )}
      </RowTd>
      <RowTd>{row.sizeKb} kb</RowTd>
      <RowTd>{row.type}</RowTd>
      <RowTd>
        {row.type === 'dir' ? (
          <Input
            checked={row.isBookmarked}
            onChange={handleBookmarkChange}
            type="checkbox"
          />
        ) : null}
      </RowTd>
    </tr>
  );
});

const Table = React.memo<TableProps>(({ folderId, rows }) => {
  const [sortState, setSortState] = useState<SortState>(DEFAULT_SORT_STATE);
  const { property, direction } = sortState;
  const { addBookmark, removeBookmark } = useBookmarks();

  const sortedRows = useMemo(() => {
    const rowsCopy = [...rows];

    rowsCopy.sort((a, b) => {
      if (direction === 'asc') {
        return a[property] < b[property] ? -1 : 1;
      } else {
        return a[property] < b[property] ? 1 : -1;
      }
    });

    return rowsCopy;
  }, [property, direction, rows]);

  useEffect(() => {
    setSortState(DEFAULT_SORT_STATE);
  }, [folderId]);

  const handleSortClick = (property: SortProperty) => {
    setSortState((previousState) => {
      const newDirection =
        property === previousState.property
          ? previousState.direction === 'desc'
            ? 'asc'
            : 'desc'
          : 'asc';

      return {
        property,
        direction: newDirection,
      };
    });
  };

  const handleBookmarkChange = (directory: DirectoryWithBookmark) => {
    if (directory.isBookmarked) {
      removeBookmark(directory.id);
    } else {
      addBookmark(directory.id);
    }
  };

  return (
    <StyledTable>
      <thead>
        <FolderTr>
          {COLUMNS.map(({ title, key }) => (
            <TableColumn
              arrowStatus={
                property === key
                  ? direction === 'asc'
                    ? 'up'
                    : 'down'
                  : 'none'
              }
              key={key}
              onSortClick={handleSortClick}
              property={key}
            >
              {title}
            </TableColumn>
          ))}
          <td>📖</td>
        </FolderTr>
      </thead>
      <StyledTBody>
        {sortedRows.map((row) => (
          <Row key={row.id} onBookmarkChange={handleBookmarkChange} row={row} />
        ))}
      </StyledTBody>
    </StyledTable>
  );
});

export default Table;
