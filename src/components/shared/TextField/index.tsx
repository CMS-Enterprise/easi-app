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
  numbersOnly?: boolean;
};

const TextField = ({
  disabled,
  error,
  id,
  name,
  maxLength,
  onChange,
  onBlur,
  value,
  numbersOnly = false
}: TextFieldProps) => {
  const inputClasses = classnames(
    'usa-input',
    { 'easi-textfield--disabled': disabled },
    { 'usa-input--error': error }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (numbersOnly) {
      const regex = /^[0-9\b]+$/;
      if (e.target.value === '' || regex.test(e.target.value)) {
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
    />
  );
};

export default TextField;
