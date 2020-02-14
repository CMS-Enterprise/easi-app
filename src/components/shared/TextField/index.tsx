import React from 'react';

type TextFieldProps = {
  id: string;
  name: string;
  label?: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
};

const TextField = ({
  id,
  name,
  label,
  maxLength,
  onChange,
  onBlur,
  value
}: TextFieldProps) => {
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className="usa-input"
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        type="text"
        value={value}
        maxLength={maxLength}
      />
    </>
  );
};

export default TextField;
