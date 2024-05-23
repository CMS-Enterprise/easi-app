import React from 'react';
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
    defaultClassName = 'text-italic',
    format
  }: {
    defaultVal?: string;
    defaultClassName?: string;
    format?: (v: any) => string;
  } = {}
): React.ReactNode {
  if (val === null || val === undefined || val === '') {
    return <span className={defaultClassName}>{defaultVal}</span>;
  }

  if (format) return format(val);

  return val;
}

export function showSystemVal(
  val: any,
  {
    defaultVal = i18next.t<string>('general:noDataAvailable'),
    defaultClassName = 'text-italic text-base',
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
