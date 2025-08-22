import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import classnames from 'classnames';

type UswdsReactLinkProps = {
  variant?: 'external' | 'unstyled' | 'nav';
  className?: string;
  to: LinkProps['to'];
  target?: '_blank';
  rel?: 'noopener noreferrer';
  'data-testid'?: string;
  children: React.ReactNode | string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

const UswdsReactLink = ({
  variant,
  className,
  to,
  target,
  rel,
  'data-testid': datatestid,
  children,
  onClick
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
      onClick={onClick}
    >
      {children}
    </UswdsLink>
  );
};

export default UswdsReactLink;
