import React from 'react';
import { useHistory, Route } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

/* eslint-disable react/jsx-props-no-spreading */

const SecureRoute = ({ component, ...props }: any) => {
  const { authService, authState } = useOktaAuth();
  const history = useHistory();

  const PassedComponent = component;
  const renderFunc = () => {
    if (authState.isAuthenticated) {
      return props.render ? (
        props.render({ ...props, component: PassedComponent })
      ) : (
        <PassedComponent {...props} />
      );
    }

    if (!authState.isPending) {
      const fromUri = history.createHref(history.location);
      authService.login(fromUri);
    }
    return null;
  };

  return <Route {...props} render={renderFunc} />;
};

export default SecureRoute;
