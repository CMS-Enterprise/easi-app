import React from 'react';

type DropdownFieldProps = {
  id: string;
  label?: string;
  children: React.ReactNodeArray;
};
export const DropdownField = ({ id, label, children }: DropdownFieldProps) => (
  <>
    {label && (
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
    )}
    <select className="usa-select" name={id} id={id}>
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
