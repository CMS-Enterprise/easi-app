import React from 'react';
import { CSVLink } from 'react-csv';
import { Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import cleanCSVData from 'utils/csv';

type SafeCSVLinkProps = Omit<React.ComponentProps<typeof CSVLink>, 'ref'>;

/**
 * Safe wrapper around `CSVLink` that neutralizes spreadsheet formulas
 * before delegating to the third-party CSV component.
 */
export default function SafeCSVLink({
  children,
  className,
  data,
  ...props
}: SafeCSVLinkProps) {
  return (
    <CSVLink
      className={classnames('usa-link', className)}
      role="link"
      data={cleanCSVData(data)}
      {...props}
    >
      <Icon.FileDownload aria-hidden className="text-middle margin-right-1" />
      {children}
    </CSVLink>
  );
}
