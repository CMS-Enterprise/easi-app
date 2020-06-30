import React from 'react';
import classnames from 'classnames';

type TextAreaFieldProps = {
  id: string;
  className?: string;
  error?: boolean;
  label?: string;
  name: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  value: string;
};

const TextAreaField = ({
  id,
  className,
  error,
  label,
  name,
  maxLength,
  onChange,
  onBlur,
  value
}: TextAreaFieldProps) => {
  const textAreaClasses = classnames(className, 'usa-textarea', {
    'usa-input--error': error
  });
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        className={textAreaClasses}
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
