import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

type LinkButtonProps = {
  children: React.ReactNode;
  secondary?: boolean;
  base?: boolean;
  accent?: boolean;
  outline?: boolean;
  inverse?: boolean;
  big?: boolean;
  unstyled?: boolean;
  to: string;
  className?: string;
};

export const LinkButton = (props: LinkButtonProps): React.ReactElement => {
  const {
    children,
    secondary,
    base,
    accent,
    outline,
    inverse,
    big,
    unstyled,
    to,
    className
  } = props;

  const classes = classnames(
    'usa-button',
    {
      'usa-button--accent-cool': accent,
      'usa-button--base': base,
      'usa-button--big': big,
      'usa-button--inverse': inverse,
      'usa-button--outline': outline,
      'usa-button--secondary': secondary,
      'usa-button--unstyled': unstyled
    },
    className
  );

  return (
    <Link className={classes} to={to}>
      {children}
    </Link>
  );
};

export default LinkButton;
