import React, { ReactElement } from 'react';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

type IconProps = {
  focusable?: boolean;
  role?: string;
  size?: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  className?: string;
} & JSX.IntrinsicElements['svg'];

type IconButtonProps = {
  icon: ReactElement<IconProps>;
  iconPosition?: 'before' | 'after';
  type: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  secondary?: boolean;
  base?: boolean;
  accentStyle?: 'cool' | 'warm';
  outline?: boolean;
  inverse?: boolean;
  size?: 'big';
  unstyled?: boolean;
} & JSX.IntrinsicElements['button'];

/**
 * Link with icon
 */
const IconButton = ({
  icon,
  iconPosition = 'before',
  children,
  className,
  ...defaultProps
}: IconButtonProps) => {
  const linkIcon = React.cloneElement(icon, {
    className: classNames(
      icon.props.className,
      `margin-${iconPosition === 'before' ? 'right' : 'left'}-1`
    ),
    'aria-hidden': true
  });

  return (
    <Button
      className={classNames('display-flex flex-align-center', className)}
      {...defaultProps}
    >
      {iconPosition === 'before' && linkIcon}
      {children}
      {iconPosition === 'after' && linkIcon}
    </Button>
  );
};

export default IconButton;
