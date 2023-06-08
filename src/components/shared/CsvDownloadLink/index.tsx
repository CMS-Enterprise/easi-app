import React from 'react';
import { CSVLink } from 'react-csv';
import { IconFileDownload } from '@trussworks/react-uswds';
import classnames from 'classnames';

interface CsvLinkProps {
  data: string | object[];
  headers?:
    | {
        label: string;
        key: string;
      }[]
    | string[];
  enclosingCharacter?: string;
  separator?: string;
  filename?: string;
  uFEFF?: boolean;
  asyncOnClick?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Uswds link wrapper of `CSVLink` with `IconFileDownload`.
 */
export default function CsvDownloadLink({
  children,
  className,
  ...props
}: CsvLinkProps) {
  return (
    <CSVLink className={classnames('usa-link', className)} {...props}>
      <IconFileDownload className="text-middle margin-right-1" />
      {children}
    </CSVLink>
  );
}
