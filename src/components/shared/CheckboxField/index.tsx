import React from 'react';

type CheckboxFieldProps = {
  checked?: boolean;
  id: string;
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
};

const CheckboxField = ({
  checked,
  id,
  label,
  name,
  onChange,
  onBlur,
  value
}: CheckboxFieldProps) => (
  <div className="usa-checkbox">
    <input
      checked={checked}
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
