import * as React from 'react';

import styled from 'styled-components';

const FolderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 10px;

  box-sizing: border-box;
  border: 1px solid grey;
  padding-bottom: 100px;
  padding-left: 300px;
  padding-right: 300px;
`;

const Folder = React.memo(() => {
  return (
    <FolderContainer>
      <h1>Folder Placeholder</h1>
    </FolderContainer>
  );
});

export default Folder;
