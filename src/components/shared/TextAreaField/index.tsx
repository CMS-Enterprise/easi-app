import React from 'react';

type TextAreaFieldProps = {
  id: string;
  name: string;
  label?: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  value: string;
};

const TextAreaField = ({
  id,
  name,
  label,
  maxLength,
  onChange,
  onBlur,
  value
}: TextAreaFieldProps) => {
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        className="usa-textarea"
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        maxLength={maxLength}
      />
    </>
  );
};

export default TextAreaField;
