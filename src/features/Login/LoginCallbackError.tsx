import React from 'react';
import { Link } from 'react-router-dom';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

type LoginCallbackErrorProps = {
  error: Error;
};

const LoginCallbackError = ({ error }: LoginCallbackErrorProps) => {
  return (
    <MainContent className="grid-container margin-top-4">
      <PageHeading>Sign in failed</PageHeading>
      <p>{error.message}</p>
      <p>
        <Link to="/signin">Try again</Link>
        {' | '}
        <Link to="/">Go home</Link>
      </p>
    </MainContent>
  );
};

export default LoginCallbackError;
