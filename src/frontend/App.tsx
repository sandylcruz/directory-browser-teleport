import * as React from 'react';

import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  html, body {
    line-height: 1.15;
  }
  html, body, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 18px;
  }
`;

const Container = styled.div`
  color: ${({ theme }) => theme.colors[theme.primaryHue][700]};
`;

const App = React.memo(() => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Container>Directory Browser</Container>
  </ThemeProvider>
));

export default App;
