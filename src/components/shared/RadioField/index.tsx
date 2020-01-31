import React from 'react';

type RadioFieldProps = {
  id: string;
  label: string;
  name: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const RadioField = ({
  id,
  label,
  name,
  onBlur,
  onChange,
  value
}: RadioFieldProps) => (
  <div className="usa-radio">
    <input
      className="usa-radio__input"
      id={id}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      type="radio"
      value={value}
    />
    <label className="usa-radio__label" htmlFor={id}>
      {label}
    </label>
  </div>
);

export default RadioField;
