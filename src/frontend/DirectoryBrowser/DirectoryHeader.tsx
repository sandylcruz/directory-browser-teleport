import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Breadcrumb } from '../../types';

const BreadcrumbLi = styled.li`
  &:not(:last-child):after {
    margin-right: 8px;
    content: ' >';
  }
`;

const BreadcrumbsOl = styled.ol`
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
  breadcrumbs: Array<Breadcrumb>;
}

const Breadcrumbs = React.memo<BreadcrumbsProps>(({ breadcrumbs }) => (
  <BreadcrumbsOl>
    {breadcrumbs.map((breadcrumb, index) => (
      <BreadcrumbLi key={breadcrumb.id}>
        {index === breadcrumbs.length - 1 ? (
          breadcrumb.name
        ) : (
          <Link to={`/folders/${breadcrumb.id}`}>{breadcrumb.name}</Link>
        )}
      </BreadcrumbLi>
    ))}
  </BreadcrumbsOl>
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
  breadcrumbs: Array<Breadcrumb>;
  onFilterChange: (value: string) => void;
  filterValue: string;
}

const DirectoryHeader = React.memo<DirectoryHeaderProps>(
  ({ breadcrumbs, onFilterChange, filterValue }) => {
    return (
      <HeaderContainer>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <RightSide>
          <FilterInput onChange={onFilterChange} value={filterValue} />
        </RightSide>
      </HeaderContainer>
    );
  }
);

export default DirectoryHeader;
