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

// const DateInput = (props: DateInputProps) => {
//   const { day, name, omitMonth, omitDay, omitYear } = props;
//   return (
//     <div className="usa-memorable-date">
//       {!omitMonth && (
//         <div className="usa-form-group usa-form-group--month">
//           <label className="usa-label" htmlFor={`${name}_date_of_birth_1`}>
//             Month
//           </label>
//           <input
//             className="usa-input usa-input--inline"
//             aria-describedby="dobHint"
//             id={`${name}_date_of_birth_1`}
//             name={`${name}_date_of_birth_1`}
//             type="text"
//             maxLength={2}
//             pattern="[0-9]*"
//             inputMode="numeric"
//             value=""
//           />
//         </div>
//       )}
//       {!omitDay && (
//         <div className="usa-form-group usa-form-group--day">
//           <label className="usa-label" htmlFor={`${name}_date_of_birth_2`}>
//             Day
//           </label>
//           <input
//             className="usa-input usa-input--inline"
//             aria-describedby="dobHint"
//             id={`${name}_date_of_birth_2`}
//             name={`${name}_date_of_birth_3`}
//             type="text"
//             maxLength={2}
//             pattern="[0-9]*"
//             inputMode="numeric"
//             value=""
//           />
//         </div>
//       )}
//       {!omitYear && (
//         <div className="usa-form-group usa-form-group--year">
//           <label className="usa-label" htmlFor={`${name}_date_of_birth_3`}>
//             Year
//           </label>
//           <input
//             className="usa-input usa-input--inline"
//             aria-describedby="dobHint"
//             id={`${name}_date_of_birth_3`}
//             name={`${name}_date_of_birth_3`}
//             type="text"
//             minLength={4}
//             maxLength={4}
//             pattern="[0-9]*"
//             inputMode="numeric"
//             value=""
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DateInput;
