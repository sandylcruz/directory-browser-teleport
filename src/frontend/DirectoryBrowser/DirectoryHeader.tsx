import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

interface BreadcrumbsProps {
  directoryPath: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ directoryPath }) => {
  const pathArray = directoryPath.split('/');

  return (
    <PathOl>
      <PathLi key="/">
        <Link to="/folders">/</Link>
      </PathLi>

      {pathArray.map((pathEntry, index) => (
        <PathLi key={index}>
          {index === pathArray.length - 1 ? (
            pathEntry
          ) : (
            <Link to={`/folders/${pathEntry}`}>{`${pathEntry}/`}</Link>
          )}
        </PathLi>
      ))}
    </PathOl>
  );
};

interface FilterInputProps {
  onChange: (value: string) => void;
  value: string;
}

const FilterInput: React.FC<FilterInputProps> = ({ onChange, value }) => {
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
};

interface DirectoryHeaderProps {
  directoryPath: string;
  onFilterChange: (value: string) => void;
  filterValue: string;
}

const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({
  directoryPath,
  onFilterChange,
  filterValue,
}) => (
  <HeaderContainer>
    <Breadcrumbs directoryPath={directoryPath} />
    <RightSide>
      <FilterInput onChange={onFilterChange} value={filterValue} />
    </RightSide>
  </HeaderContainer>
);

export default DirectoryHeader;
