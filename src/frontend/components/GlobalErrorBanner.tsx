import * as React from 'react';
import { useErrors } from '../providers/ErrorProvider';

import styled from 'styled-components';

const ErrorList = styled.ul`
  padding: 0;
`;

const ErrorMessage = styled.li`
  list-style: none;
  color: white;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.red[600]};
  padding: 12px;
  border-radius: 4px;
`;

const GlobalErrorBanner = React.memo(() => {
  const { errors } = useErrors();

  return (
    <ErrorList>
      {errors.map((error, index) => (
        <ErrorMessage key={index}>
          <div aria-live="polite">{error}</div>
        </ErrorMessage>
      ))}
    </ErrorList>
  );
});

export default GlobalErrorBanner;
