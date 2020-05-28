import React from 'react';
import classnames from 'classnames';

type ButtonProps = {
  component?: React.ComponentClass<any> | string;
  children: React.ReactNode;
  secondary?: boolean;
  base?: boolean;
  accent?: boolean;
  outline?: boolean;
  inverse?: boolean;
  big?: boolean;
  unstyled?: boolean;
  className?: string;
  [x: string]: any;
};

export const Button = ({
  component,
  children,
  secondary,
  base,
  accent,
  outline,
  inverse,
  big,
  unstyled,
  className,
  ...props
}: ButtonProps): React.ReactElement => {
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

  return React.createElement(
    component || 'button',
    {
      ...props,
      className: classes
    },
    children
  );
};

export default Button;
