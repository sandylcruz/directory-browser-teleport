import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Path as PathType } from '../../types';

const PathLi = styled.li`
  &:not(:last-child):after {
    margin-right: 8px;
    content: ' >';
  }
`;

const PathOl = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: row;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.grey[300]};
  border-left: 1px solid ${({ theme }) => theme.colors.grey[300]};
  border-right: 1px solid ${({ theme }) => theme.colors.grey[300]};
`;

const RightSide = styled.div``;

const StyledInput = styled.input`
  height: 100%;
  margin-right: 10px;
`;

interface PathProps {
  path: Array<PathType>;
}

const Path = React.memo<PathProps>(({ path }) => (
  <PathOl>
    {path.map((pathEntry, index) => (
      <PathLi key={pathEntry.id}>
        {index === path.length - 1 ? (
          pathEntry.name
        ) : (
          <Link to={`/folders/${pathEntry.id}`}>{pathEntry.name}</Link>
        )}
      </PathLi>
    ))}
  </PathOl>
));

interface FilterInputProps {
  onChange: (value: string) => void;
  value: string;
}

const FilterInput = React.memo<FilterInputProps>(({ onChange, value }) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { value },
    } = event;

    onChange(value);
  };

  return (
    <label>
      🔍{' '}
      <StyledInput
        type="text"
        onChange={handleChange}
        value={value}
        placeholder="Search"
      />
    </label>
  );
});

interface DirectoryHeaderProps {
  path: Array<PathType>;
  onFilterChange: (value: string) => void;
  filterValue: string;
}

const DirectoryHeader = React.memo<DirectoryHeaderProps>(
  ({ path, onFilterChange, filterValue }) => {
    return (
      <HeaderContainer>
        <Path path={path} />
        <RightSide>
          <FilterInput onChange={onFilterChange} value={filterValue} />
        </RightSide>
      </HeaderContainer>
    );
  }
);

export default DirectoryHeader;
