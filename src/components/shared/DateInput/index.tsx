import React from 'react';
import classnames from 'classnames';

type DateInputProps = {
  id: string;
  name: string;
  onChange: () => void;
  value: string;
  error?: boolean;
  className?: string;
} & JSX.IntrinsicElements['input'];

const DateInputMonth = ({
  id,
  name,
  value,
  onChange,
  error,
  className,
  ...props
}: DateInputProps) => {
  const classes = classnames(
    'usa-input',
    'usa-input--inline',
    { 'usa-input--error': error },
    className
  );

  return (
    <input
      className={classes}
      id={id}
      name={name}
      type="text"
      maxLength={2}
      pattern="[0-9]*"
      inputMode="numeric"
      value={value}
      onChange={onChange}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

const DateInputDay = ({
  id,
  name,
  value,
  onChange,
  error,
  className,
  ...props
}: DateInputProps) => {
  const classes = classnames(
    'usa-input',
    'usa-input--inline',
    { 'usa-input--error': error },
    className
  );

  return (
    <input
      className={classes}
      id={id}
      name={name}
      type="text"
      maxLength={2}
      pattern="[0-9]*"
      inputMode="numeric"
      value={value}
      onChange={onChange}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

const DateInputYear = ({
  id,
  name,
  value,
  onChange,
  error,
  className,
  ...props
}: DateInputProps) => {
  const classes = classnames(
    'usa-input',
    'usa-input--inline',
    { 'usa-input--error': error },
    className
  );

  return (
    <input
      className={classes}
      id={id}
      name={name}
      type="text"
      minLength={4}
      maxLength={4}
      pattern="[0-9]*"
      inputMode="numeric"
      value={value}
      onChange={onChange}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export { DateInputMonth, DateInputDay, DateInputYear };
