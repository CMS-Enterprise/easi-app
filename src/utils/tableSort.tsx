import React from 'react';
import { HeaderGroup } from 'react-table';
import { Icon } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

export type sortColumnProps = null | string | number | DateTime;
export type columnStatusProps = 'descending' | 'ascending' | 'none';

// Populates 'aria-sort' on table elements based on sort status
export const getColumnSortStatus = <T extends {}>(
  column: HeaderGroup<T>
): columnStatusProps => {
  if (column.isSorted) {
    if (column.isSortedDesc) {
      return 'descending';
    }
    return 'ascending';
  }

  return 'none';
};

// Returns header sort icon based on sort status
export const getHeaderSortIcon = <T extends {}>(column: HeaderGroup<T>) => {
  const sharedClassName = 'margin-left-05 position-absolute';

  if (!column.isSorted) {
    return (
      <Icon.UnfoldMore className={sharedClassName} data-testid="caret--sort" />
    );
  }

  if (column.isSortedDesc) {
    return (
      <Icon.ExpandMore className={sharedClassName} data-testid="caret--down" />
    );
  }

  return (
    <Icon.ExpandLess className={sharedClassName} data-testid="caret--up" />
  );
};

// Description beneath tables for sorting status
export const currentTableSortDescription = <T extends {}>(headerGroup: {
  headers: HeaderGroup<T>[];
}) => {
  const sortedHeader = headerGroup.headers.find(
    (header: HeaderGroup<T>) => header.isSorted
  );

  if (sortedHeader) {
    const direction = sortedHeader.isSortedDesc ? 'descending' : 'ascending';
    return `Requests table sorted by ${sortedHeader.Header} ${direction}`;
  }
  return 'Requests table reset to default sort order';
};

export const sortColumnValues = (
  rowOneElem: sortColumnProps,
  rowTwoElem: sortColumnProps
) => {
  // Checking if passed sort value can be formatted as a date
  const rowOneDateCheck: any =
    rowOneElem && typeof rowOneElem === 'string'
      ? DateTime.fromFormat(rowOneElem, 'M/d/yyyy')
      : { invalidReason: 'unparsable' };

  const rowTwoDateCheck: any =
    rowTwoElem && typeof rowTwoElem === 'string'
      ? DateTime.fromFormat(rowTwoElem, 'M/d/yyyy')
      : { invalidReason: 'unparsable' };

  // Assigned sort values after attemping to parse dates
  const rowOne =
    rowOneDateCheck.invalidReason === 'unparsable'
      ? rowOneElem
      : rowOneDateCheck;

  const rowTwo =
    rowTwoDateCheck.invalidReason === 'unparsable'
      ? rowTwoElem
      : rowTwoDateCheck;

  // Null checks for columns with data potentially empty (LCID Expiration, Admin Notes, etc.)
  if (rowOne === null) {
    return 1;
  }

  if (rowTwo === null) {
    return -1;
  }

  // If string and number, sort out number first
  if (typeof rowOne === 'number' && typeof rowTwo === 'string') {
    return 1;
  }

  // If string and number, sort out number first
  if (typeof rowOne === 'string' && typeof rowTwo === 'number') {
    return -1;
  }

  // If string/number and datetime, sort out datetimes
  if (
    rowOne instanceof DateTime &&
    (typeof rowTwo === 'string' || typeof rowTwo === 'number')
  ) {
    return 1;
  }

  // If string/number and datetime, sort out datetimes
  if (
    rowTwo instanceof DateTime &&
    (typeof rowOne === 'string' || typeof rowOne === 'number')
  ) {
    return -1;
  }

  // If both items are strings, enforce capitalization (temporarily) and then compare
  if (typeof rowOne === 'string' && typeof rowTwo === 'string') {
    return rowOne.toUpperCase() > rowTwo.toUpperCase() ? 1 : -1;
  }

  // Default case if both are number/datetime
  return rowOne > rowTwo ? 1 : -1;
};
