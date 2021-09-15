import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Button from '../sharedComponents/Button';
import { fetchJson } from '../utilities';
import { useCurrentUser } from '../providers/CurrentUserProvider';
import { useErrors } from '../providers/ErrorProvider';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #17494d;
  font-size: 40px;
  margin-top: 15px;
  margin-left: 10px;
`;

const StyledNavbar = styled.nav`
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[300]};
  background: white;
  height: 75px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.06);
  width: 100%;
`;

const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { addError } = useErrors();
  const history = useHistory();

  const handleLogoutClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    fetchJson('/api/v1/session', { method: 'DELETE' })
      .then(() => {
        setCurrentUser(null);
        history.replace('/login');
      })
      .catch((error) => {
        addError(error.message);
      });
  };

  return (
    <StyledNavbar>
      <StyledLink to="/" aria-label="Directory Browser Go To Folder">
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
};

export default Navbar;
