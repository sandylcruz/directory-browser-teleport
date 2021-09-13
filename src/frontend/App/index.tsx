import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import AuthRoute from '../AuthRoute';
import BookmarkProvider from '../providers/BookmarkProvider';
import CurrentUserProvider from '../providers/CurrentUserProvider';
import DirectoryBrowser from '../DirectoryBrowser';
import ErrorProvider from '../providers/ErrorProvider';
import GlobalErrorBanner from './GlobalErrorBanner';
import LoginForm from '../LoginForm';
import Navbar from './Navbar';
import theme from '../theme';

const GlobalStyles = createGlobalStyle`
  html, body {
    line-height: 1.15;
  }
  html, body, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-size: 18px;
    font-family: arial;
    text-decoration-style: none;
  }
`;

const Content = styled.main`
  display: flex;
  justify-content: center;
`;

const InnerContent = styled.div`
  max-width: 900px;
  width: 100%;
`;

const App = React.memo(() => (
  <ErrorProvider>
    <ThemeProvider theme={theme}>
      <CurrentUserProvider>
        <BookmarkProvider>
          <GlobalStyles />
          <Navbar />
          <Content>
            <InnerContent>
              <GlobalErrorBanner />
              <Switch>
                <Route path="/login" component={LoginForm} />
                <AuthRoute path="/" component={DirectoryBrowser} />
              </Switch>
            </InnerContent>
          </Content>
        </BookmarkProvider>
      </CurrentUserProvider>
    </ThemeProvider>
  </ErrorProvider>
));

export default App;
