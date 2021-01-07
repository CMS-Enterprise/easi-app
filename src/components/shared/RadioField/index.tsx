import React from 'react';
import classnames from 'classnames';

import './index.scss';

type RadioFieldProps = {
  id: string;
  className?: string;
  inline?: boolean;
  checked?: boolean;
  label: string;
  name: string;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
} & JSX.IntrinsicElements['input'];

// eslint-disable-next-line import/prefer-default-export
export const RadioField = ({
  checked,
  id,
  className,
  inline,
  label,
  name,
  onBlur,
  onChange,
  value,
  ...props
}: RadioFieldProps) => {
  const radioClasses = classnames(
    'usa-radio',
    {
      'easi-radio--inline': inline
    },
    className
  );

  const radioLabelClasses = classnames('usa-radio__label', {
    'easi-radio__label--inline': inline
  });
  return (
    <div className={radioClasses}>
      <input
        checked={checked}
        className="usa-radio__input"
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        type="radio"
        value={value}
        {...props}
      />
      <label className={radioLabelClasses} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

type RadioGroupProps = {
  children: React.ReactNode | React.ReactNodeArray;
  inline?: boolean;
} & JSX.IntrinsicElements['div'];

export const RadioGroup = ({ children, inline, ...props }: RadioGroupProps) => {
  const classes = classnames('easi-radio__group', {
    'easi-radio__group--inline': inline
  });
  return (
    <div className={classes} role="radiogroup" {...props}>
      {children}
    </div>
  );
};

/**
 * TODO: I want to continue to iterate on this even though it isn't ready yet.
 * The thought is to create a compound component so that the "checked" state
 * is managed by a "parent" rather than each radio button.
 *
 * I ran into some issues with having custom onChange so I dropped it for now.
 */

// export const RadioGroup = ({ children, onChange, onBlur, value }: any) => {
//   return React.Children.map(children, child => {
//     if (child && child.type === RadioField) {
//       return React.cloneElement(child, {
//         checked: value === child.props.value,
//         onChange,
//         onBlur
//       });
//     }
//     return child;
//   });
// };
