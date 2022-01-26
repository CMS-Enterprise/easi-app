import { HeaderGroup } from 'react-table';
import classnames from 'classnames';
import { DateTime } from 'luxon';

type sortColumnProps = null | string | number | Date;

export const getColumnSortStatus = <T extends {}>(
  column: HeaderGroup<T>
): 'descending' | 'ascending' | 'none' => {
  if (column.isSorted) {
    if (column.isSortedDesc) {
      return 'descending';
    }
    return 'ascending';
  }

  return 'none';
};

export const getHeaderSortIcon = (
  isSorted: boolean,
  isSortedDesc: boolean | undefined
) => {
  const marginClassName = 'margin-left-1';
  if (!isSorted) {
    return classnames(marginClassName, 'fa fa-sort caret');
  }

  if (isSortedDesc) {
    return classnames(marginClassName, 'fa fa-caret-down');
  }

  return classnames(marginClassName, 'fa fa-caret-up');
};

export const currentTableSortDescription = (headerGroup: any) => {
  const sortedHeader = headerGroup.headers.find(
    (header: HeaderGroup) => header.isSorted
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
  // Null checks for columns with data potentially empty (LCID Expiration, Admin Notes, etc.)
  if (rowOneElem === null) {
    return 1;
  }

  if (rowTwoElem === null) {
    return -1;
  }

  // If both items are strings, enforce capitalization (temporarily) and then compare
  if (typeof rowOneElem === 'string' && typeof rowTwoElem === 'string') {
    return rowOneElem.toUpperCase() > rowTwoElem.toUpperCase() ? 1 : -1;
  }

  // If string and datetime, sort datetimes together
  if (rowOneElem instanceof DateTime && typeof rowTwoElem === 'string') {
    return 1;
  }

  // If both items are DateTimes, convert to Number and compare
  if (rowOneElem instanceof DateTime && rowTwoElem instanceof DateTime) {
    return Number(rowOneElem) > Number(rowTwoElem) ? 1 : -1;
  }

  // If items are different types and/or neither string nor DateTime, return bare comparison
  return rowOneElem > rowTwoElem ? 1 : -1;
};
