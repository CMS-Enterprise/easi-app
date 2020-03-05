import React from 'react';
import classnames from 'classnames';

type ButtonProps = {
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
  secondary?: boolean;
  base?: boolean;
  accent?: boolean;
  outline?: boolean;
  inverse?: boolean;
  big?: boolean;
  unstyled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button = (props: ButtonProps): React.ReactElement => {
  const {
    type,
    disabled,
    children,
    secondary,
    base,
    accent,
    outline,
    inverse,
    big,
    unstyled,
    onClick
  } = props;

  const classes = classnames('usa-button', {
    'usa-button--accent-cool': accent,
    'usa-button--base': base,
    'usa-button--big': big,
    'usa-button--inverse': inverse,
    'usa-button--outline': outline,
    'usa-button--secondary': secondary,
    'usa-button--unstyled': unstyled
  });

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
