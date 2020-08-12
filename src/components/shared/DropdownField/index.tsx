import React from 'react';
import classnames from 'classnames';

import './index.scss';

type DropdownFieldProps = {
  id: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  children: React.ReactNodeArray;
  value: any;
};
export const DropdownField = ({
  id,
  disabled,
  error,
  name,
  onBlur,
  onChange,
  children,
  value
}: DropdownFieldProps) => {
  const dropdownClassNames = classnames(
    'easi-dropdown',
    'usa-select',
    { 'easi-dropdown--error': error },
    { 'easi-dropdown--disabled': disabled }
  );
  return (
    <select
      className={dropdownClassNames}
      disabled={disabled}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      id={id}
      value={value}
    >
      {children}
    </select>
  );
};

type DropdownItemProps = {
  name: string;
  value: string;
  disabled?: boolean;
};

export const DropdownItem = ({ name, value, disabled }: DropdownItemProps) => (
  <option value={value} disabled={disabled}>
    {name}
  </option>
);
