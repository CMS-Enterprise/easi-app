import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

type ButtonProps = {
  type: 'button';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonType?: 'button' | 'submit' | 'reset';
};

type AProps = {
  type: 'a';
  href?: string;
};

type LinkProps = {
  type: 'link';
  to?: string;
};

type UniversalProps = {
  type: string;
  children: React.ReactNode;
  secondary?: boolean;
  base?: boolean;
  accent?: boolean;
  outline?: boolean;
  inverse?: boolean;
  big?: boolean;
  unstyled?: boolean;
  className?: string;
};

const elementTypes = {
  button: 'button',
  a: 'a',
  link: Link
};

export const Button = (
  props: (ButtonProps | AProps | LinkProps) & UniversalProps
): React.ReactElement => {
  const {
    type,
    children,
    secondary,
    base,
    accent,
    outline,
    inverse,
    big,
    unstyled,
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

  let componentProps;
  if (type === 'a') {
    componentProps = {
      href: (props as AProps).href,
      className: classes
    };
  } else if (type === 'link') {
    componentProps = {
      to: (props as LinkProps).to,
      className: classes
    };
  } else {
    const buttonProps = props as ButtonProps;
    componentProps = {
      type: buttonProps.buttonType,
      disabled: buttonProps.disabled,
      onClick: buttonProps.disabled ? () => {} : buttonProps.onClick
    };
  }

  return React.createElement(elementTypes[type], componentProps, children);
};

export default Button;
