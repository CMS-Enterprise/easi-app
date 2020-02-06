import React from 'react';

type DropdownFieldProps = {
  id: string;
  label?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  children: React.ReactNodeArray;
};
export const DropdownField = ({
  id,
  label,
  name,
  onBlur,
  onChange,
  children
}: DropdownFieldProps) => (
  <>
    {label && (
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
    )}
    <select
      className="usa-select"
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      id={id}
    >
      {children}
    </select>
  </>
);

type DropdownItemProps = {
  name: string;
  value: string;
};

export const DropdownItem = ({ name, value }: DropdownItemProps) => (
  <option value={value}>{name}</option>
);
