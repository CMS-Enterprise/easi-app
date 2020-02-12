import React from 'react';
import classnames from 'classnames';
import './index.scss';

type TextFieldProps = {
  disabled?: boolean;
  id: string;
  name: string;
  label?: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
};

const TextField = ({
  disabled,
  id,
  name,
  label,
  maxLength,
  onChange,
  onBlur,
  value
}: TextFieldProps) => {
  const textFieldClassNames = classnames('usa-input', {
    'easi-textfield--disabled': disabled
  });
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        className={textFieldClassNames}
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
