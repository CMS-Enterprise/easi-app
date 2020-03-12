import React from 'react';
import classnames from 'classnames';
import './index.scss';

type DropdownFieldProps = {
  id: string;
  disabled?: boolean;
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
  label,
  name,
  onBlur,
  onChange,
  children,
  value
}: DropdownFieldProps) => {
  const dropdownClassNames = classnames('usa-select', {
    'easi-dropdown--disabled': disabled
  });
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id}>
          {label}
        </label>
      )}
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
    </>
  );
};

type DropdownItemProps = {
  name: string;
  value: string;
};

export const DropdownItem = ({ name, value }: DropdownItemProps) => (
  <option value={value}>{name}</option>
);
