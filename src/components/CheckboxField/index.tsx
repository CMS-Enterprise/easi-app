import React from 'react';
import classnames from 'classnames';

type CheckboxFieldProps = {
  checked?: boolean;
  disabled?: boolean;
  id: string;
  label: React.ReactNode;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
  inputProps?: JSX.IntrinsicElements['input'];
  'data-testid'?: string;
};

const CheckboxField = ({
  checked,
  disabled,
  id,
  label,
  name,
  onChange,
  onBlur,
  value,
  inputProps,
  'data-testid': datatestid
}: CheckboxFieldProps) => {
  const checkboxClassNames = classnames('easi-checkbox', 'usa-checkbox', {
    'easy-checkbox--disabled': disabled
  });
  return (
    <div className={checkboxClassNames}>
      <input
        checked={checked}
        className="usa-checkbox__input"
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        type="checkbox"
        value={value}
        {...inputProps}
        data-testid={datatestid}
      />
      <label className="usa-checkbox__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default CheckboxField;
