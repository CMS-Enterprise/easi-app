import React from 'react';
import classnames from 'classnames';

import './index.scss';

type TextFieldProps = {
  disabled?: boolean;
  error?: boolean;
  id: string;
  name: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
  match?: RegExp;
  inline?: boolean;
  className?: string;
} & JSX.IntrinsicElements['input'];

const TextField = ({
  disabled,
  error,
  id,
  name,
  maxLength,
  onChange,
  onBlur,
  value,
  match,
  inline,
  className,
  ...props
}: TextFieldProps) => {
  const inputClasses = classnames(
    'usa-input',
    { 'easi-textfield--disabled': disabled },
    { 'usa-input--error': error },
    { 'display-inline-block': inline },
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (match) {
      if (e.target.value === '' || match.test(e.target.value)) {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };

  return (
    <input
      className={inputClasses}
      disabled={disabled}
      id={id}
      name={name}
      onChange={handleChange}
      onBlur={onBlur}
      type="text"
      value={value}
      maxLength={maxLength}
      {...props}
    />
  );
};

export default TextField;
