import React, { ReactNode } from 'react';
import HelpText from '../HelpText';

type TextAreaFieldProps = {
  id: string;
  name: string;
  label?: string;
  helpText?: ReactNode;
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
  value,
  helpText
}: TextAreaFieldProps) => {
  return (
    <>
      {label && (
        <label className="usa-label" htmlFor={id}>
          {label}
        </label>
      )}
      {helpText && <HelpText>{helpText}</HelpText>}
      <textarea
        className="usa-textarea"
        id={id}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        maxLength={maxLength}
      />
      <HelpText>{`${2000 - value.length} characters left`}</HelpText>
    </>
  );
};

export default TextAreaField;
