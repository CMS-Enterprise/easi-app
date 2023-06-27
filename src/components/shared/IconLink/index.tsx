import React, { ReactElement } from 'react';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

export type IconProps = {
  focusable?: boolean;
  role?: string;
  size?: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  className?: string;
} & JSX.IntrinsicElements['svg'];

type IconLinkProps = {
  icon: ReactElement<IconProps>;
  iconPosition?: 'before' | 'after';
  to: string | object;
  variant?: 'external' | 'unstyled' | 'nav';
  className?: string;
  target?: '_blank';
  rel?: 'noopener noreferrer';
  'data-testid'?: string;
  children: React.ReactNode | string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

/**
 * Link with icon
 */
const IconLink = ({
  icon,
  iconPosition = 'before',
  className,
  children,
  ...defaultProps
}: IconLinkProps) => {
  const linkIcon = React.cloneElement(icon, {
    className: classNames(
      icon.props.className,
      `margin-${iconPosition === 'before' ? 'right' : 'left'}-1`
    )
  });

  return (
    <UswdsReactLink
      className={classNames('display-flex flex-align-center', className)}
      {...defaultProps}
    >
      {iconPosition === 'before' && linkIcon}
      {children}
      {iconPosition === 'after' && linkIcon}
    </UswdsReactLink>
  );
};

export default IconLink;
