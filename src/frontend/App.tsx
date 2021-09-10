import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import AuthRoute from './components/AuthRoute';
import CurrentUserProvider, {
  useCurrentUser,
} from './providers/CurrentUserProvider';
import Folder from './components/Folder';
import LoginForm from './components/LoginForm';
import { postLogout } from './util/sessionApiUtil';
import theme from './theme';
import Button from './components/Button';

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

const StyledNavbar = styled.nav`
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  background: white;
  height: 75px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.06);
  width: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #17494d;
  font-size: 40px;
  margin-top: 15px;
`;

const Navbar = React.memo(() => {
  const { currentUser, setCurrentUser } = useCurrentUser();

  const handleLogoutClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    postLogout()
      .then(() => {
        setCurrentUser(null);
      })
      .catch(() => {
        setCurrentUser(null);
      });
  };

  return (
    <StyledNavbar>
      <StyledLink to="/folder" aria-label="Directory Browser Go To Folder">
        Directory Browser
      </StyledLink>
      {currentUser ? (
        <Button
          hue="secondaryHue"
          onClick={handleLogoutClick}
          aria-label="Log out"
        >
          Log Out
        </Button>
      ) : null}
    </StyledNavbar>
  );
});

const App = React.memo(() => (
  <ThemeProvider theme={theme}>
    <CurrentUserProvider>
      <>
        <GlobalStyles />
        <Navbar />
        <Content>
          <InnerContent>
            <Switch>
              <Route path="/login" component={LoginForm} />
              <AuthRoute path="/folder" component={Folder} />
            </Switch>
          </InnerContent>
        </Content>
      </>
    </CurrentUserProvider>
  </ThemeProvider>
));

export default App;
