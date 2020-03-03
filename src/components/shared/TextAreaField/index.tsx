import React from 'react';

type TextAreaFieldProps = {
  id: string;
  label?: string;
  name: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  value: string;
};

const TextAreaField = ({
  id,
  label,
  name,
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
