import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import classnames from 'classnames';

type UswdsReactLinkProps = {
  variant?: 'external' | 'unstyled' | 'nav';
  className?: string;
  link: string;
  target?: '_blank';
  rel?: 'noopener noreferrer';
  heading: React.ReactNode | string;
};

const UswdsReactLink = ({
  variant,
  className,
  link,
  target,
  rel,
  heading
}: UswdsReactLinkProps) => {
  return (
    <UswdsLink
      to={link}
      target={target}
      rel={rel}
      variant={variant}
      asCustom={RouterLink}
      className={classnames(className)}
    >
      {heading}
    </UswdsLink>
  );
};

export default UswdsReactLink;
