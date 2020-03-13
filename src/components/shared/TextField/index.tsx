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
};

const TextField = ({
  disabled,
  error,
  id,
  name,
  maxLength,
  onChange,
  onBlur,
  value
}: TextFieldProps) => {
  const inputClasses = classnames(
    'usa-input',
    { 'easi-textfield--disabled': disabled },
    { 'usa-input--error': error }
  );
  return (
    <input
      className={inputClasses}
      disabled={disabled}
      id={id}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      type="text"
      value={value}
      maxLength={maxLength}
    />
  );
};

export default TextField;
