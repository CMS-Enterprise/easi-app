import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import classnames from 'classnames';

type UswdsReactLinkProps = {
  variant?: 'external' | 'unstyled' | 'nav';
  className?: string;
  to: string;
  target?: '_blank';
  rel?: 'noopener noreferrer';
  'data-testid'?: string;
  children: React.ReactNode | string;
};

const UswdsReactLink = ({
  variant,
  className,
  to,
  target,
  rel,
  'data-testid': datatestid,
  children
}: UswdsReactLinkProps) => {
  return (
    <UswdsLink
      to={to}
      data-testid={datatestid}
      target={target}
      rel={rel}
      variant={variant}
      asCustom={RouterLink}
      className={classnames(className)}
    >
      {children}
    </UswdsLink>
  );
};

export default UswdsReactLink;
