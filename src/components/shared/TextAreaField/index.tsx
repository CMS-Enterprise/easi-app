import React from 'react';
import classnames from 'classnames';

import CharacterCounter from 'components/CharacterCounter';

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
} & JSX.IntrinsicElements['textarea'];

const TextAreaField = ({
  id,
  className,
  error,
  label,
  name,
  maxLength,
  onChange,
  onBlur,
  value,
  ...props
}: TextAreaFieldProps) => {
  const textAreaClasses = classnames(
    'usa-textarea',
    {
      'usa-input--error': error
    },
    className
  );
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
        {...props}
      />
      <CharacterCounter
        id={`${id}-counter`}
        characterCount={2000 - (value?.length || 0)}
      />
    </>
  );
};

export default TextAreaField;
