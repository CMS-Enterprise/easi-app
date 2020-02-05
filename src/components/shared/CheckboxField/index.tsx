import React from 'react';

type CheckboxFieldProps = {
  id: string;
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
};

const CheckboxField = ({
  id,
  label,
  name,
  onChange,
  onBlur,
  value
}: CheckboxFieldProps) => (
  <div className="usa-checkbox">
    <input
      className="usa-checkbox__input"
      id={id}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      type="checkbox"
      value={value}
    />
    <label className="usa-checkbox__label" htmlFor={id}>
      {label}
    </label>
  </div>
);

export default CheckboxField;
