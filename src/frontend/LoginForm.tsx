import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Button from './sharedComponents/Button';
import { fetchJson } from './utilities';
import { useCurrentUser } from './providers/CurrentUserProvider';
import { useErrors } from './providers/ErrorProvider';
import type { User } from '../types';

const ErrorBox = styled.div`
  color: red;
`;

const Form = styled.form`
  font-family: helvetica;
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: center;
  margin-top: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  width: 100%;
  padding: 20px 0;
`;

const H1 = styled.h1`
  font-size: 35px;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 10px;
  margin-top: 10px;

  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 500px;
`;

const Label = styled.label`
  padding: 10px;
  font-size: 12px;
  text-transform: uppercase;
`;

const Span = styled.span`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LoginForm = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const history = useHistory();

  const { setCurrentUser } = useCurrentUser();
  const { addError } = useErrors();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    fetchJson<User>('/api/v1/session', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        setLoginError('');
        setCurrentUser(response);
        history.push('/');
      })
      .catch((error) => {
        addError(error.message);
      });
  };

  const updateEmail: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.currentTarget.value);
  };

  const updatePassword: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setPassword(event.currentTarget.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <H1>Sign In</H1>
      <Span>
        <Label>
          Email
          <Input
            name="email"
            onChange={updateEmail}
            type="text"
            value={email}
          />
        </Label>
      </Span>
      <Span>
        <Label>
          Password
          <Input
            name="password"
            onChange={updatePassword}
            type="password"
            value={password}
          />
        </Label>
      </Span>
      <ErrorBox aria-live="polite">{loginError}</ErrorBox>
      <Button hue="primaryHue" type="submit">
        Submit
      </Button>
    </Form>
  );
});
export default LoginForm;
