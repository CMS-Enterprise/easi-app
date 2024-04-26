import React from 'react';
import classNames from 'classnames';
import i18next from 'i18next';

/**
 * Show the value if it's not `null`, `undefined`, or `''`,
 * otherwise render `defaultVal`.
 * Use a `format` function on the value if provided.
 */
export default function showVal(
  val: any,
  {
    defaultVal = i18next.t<string>('general:noInfoToDisplay'),
    defaultClassName,
    format
  }: {
    defaultVal?: string;
    defaultClassName?: string;
    format?: (v: any) => string;
  } = {}
): React.ReactNode {
  if (val === null || val === undefined || val === '') {
    return (
      <span className={classNames('text-italic', defaultClassName)}>
        {defaultVal}
      </span>
    );
  }

  if (format) return format(val);

  return val;
}

export function showSystemVal(
  val: any,
  {
    defaultVal = 'No data available',
    defaultClassName = 'text-base',
    format
  }: {
    defaultVal?: string;
    defaultClassName?: string;
    format?: (v: any) => string;
  } = {}
): React.ReactNode {
  return showVal(val, {
    defaultVal,
    defaultClassName,
    format
  });
}
