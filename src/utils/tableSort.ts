import { HeaderGroup } from 'react-table';
import classnames from 'classnames';

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
