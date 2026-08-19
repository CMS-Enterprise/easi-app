import React from 'react';
import { LoginCallback } from '@okta/okta-react';

import Spinner from 'components/Spinner';

import LoginCallbackError from './LoginCallbackError';

const LoginCallbackWrapper = () => {
  return (
    <LoginCallback
      loadingElement={
        <div className="display-flex flex-justify-center margin-top-4">
          <Spinner size="large" data-testid="login-callback-loading" />
        </div>
      }
      errorComponent={LoginCallbackError}
    />
  );
};

export default LoginCallbackWrapper;
