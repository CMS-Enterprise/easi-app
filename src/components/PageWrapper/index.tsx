import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import classnames from 'classnames';

import './index.scss';

type PageWrapperProps = {
  className?: string;
  children: React.ReactNode;
} & JSX.IntrinsicElements['div'];

const PageWrapper = ({ className, children, ...props }: PageWrapperProps) => {
  const { authState } = useOktaAuth();
  const { pathname } = useLocation();

  const classes = classnames('easi-page-wrapper', className, {
    'easi-page-wrapper__pre-auth-home':
      pathname === '/' && !authState?.isAuthenticated,
    'display-none': pathname === '/implicit/callback' // Hide the app/page wrapper on the implicit callback route
  });

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default PageWrapper;
