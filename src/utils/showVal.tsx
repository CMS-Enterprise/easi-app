import React from 'react';
import i18next from 'i18next';

/**
 * Show the value if it's not `null`, `undefined`, or `''`,
 * otherwise render `defaultVal`.
 * Use a `format` function on the value if provided.
 */
export default function showVal(
  val: string | number | null | undefined,
  {
    defaultVal = i18next.t<string>('general:noInfoToDisplay'),
    format
  }: {
    defaultVal?: string;
    format?: (v: any) => string;
  } = {}
): React.ReactNode {
  if (val === null || val === undefined || val === '') {
    return <span className="text-italic">{defaultVal}</span>;
  }

  if (format) return format(val);

  return val;
}
