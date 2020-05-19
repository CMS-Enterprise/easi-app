import React from 'react';
import classnames from 'classnames';
import './index.scss';

type RadioFieldProps = {
  id: string;
  inline: boolean;
  checked?: boolean;
  label: string;
  name: string;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: any;
};

// eslint-disable-next-line import/prefer-default-export
export const RadioField = ({
  checked,
  id,
  inline,
  label,
  name,
  onBlur,
  onChange,
  value
}: RadioFieldProps) => {
  const radioClasses = classnames('usa-radio', {
    'easi-radio--inline': inline
  });

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
      />
      <label className={radioLabelClasses} htmlFor={id}>
        {label}
      </label>
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
