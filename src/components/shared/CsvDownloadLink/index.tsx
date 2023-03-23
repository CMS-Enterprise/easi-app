import React from 'react';
import { CSVLink } from 'react-csv';
import { IconFileDownload } from '@trussworks/react-uswds';
import classnames from 'classnames';

/**
 * Uswds link wrapper of `CSVLink` with `IconFileDownload`.
 */
export default function CsvDownloadLink({
  children,
  data,
  filename,
  className
}: {
  children?: React.ReactNode;
  data: any;
  filename?: string;
  className?: string;
}) {
  return (
    <CSVLink
      className={classnames('usa-link', className)}
      data={data}
      filename={filename}
    >
      <IconFileDownload className="text-middle margin-right-1" />
      {children}
    </CSVLink>
  );
}
