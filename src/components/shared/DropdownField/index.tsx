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
  children: React.ReactNode;
  value: string;
};

export const DropdownItem = ({ children, value }: DropdownItemProps) => (
  <option value={value}>{children}</option>
);
