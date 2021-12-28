import React from 'react';
import { UsePaginationInstanceProps, UsePaginationState } from 'react-table';
import classnames from 'classnames';

import './index.scss';

type ReactTablePaginationProps = {
  className?: string;
} & UsePaginationInstanceProps<{}> &
  UsePaginationState<{}>;

const TablePagination = ({
  className,
  gotoPage,
  previousPage,
  nextPage,
  canNextPage,
  pageIndex,
  pageOptions,
  canPreviousPage,
  pageCount,
  pageSize,
  setPageSize
}: ReactTablePaginationProps) => {
  const classNames = classnames('pagination', className);
  return (
    <div className={classNames}>
      <button
        type="button"
        className="usa-button"
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
      >
        {'<<'}
      </button>{' '}
      <button
        type="button"
        className="usa-button"
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
      >
        {'<'}
      </button>{' '}
      <button
        type="button"
        className="usa-button"
        onClick={() => nextPage()}
        disabled={!canNextPage}
      >
        {'>'}
      </button>{' '}
      <button
        type="button"
        className="usa-button"
        onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
      >
        {'>>'}
      </button>{' '}
      <span className="margin-left-1">
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
      </span>
      <span className="margin-left-1">
        | Go to page:{' '}
        <input
          className="usa-input display-inline width-10 margin-left-1"
          type="number"
          defaultValue={pageIndex + 1}
          onChange={e => {
            const page: number = e.target.value
              ? Number(e.target.value) - 1
              : 0;
            gotoPage(page);
          }}
        />
      </span>{' '}
      <select
        className="usa-input display-inline width-15"
        onBlur={e => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map(customPageSize => (
          <option key={customPageSize} value={customPageSize}>
            Show {customPageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TablePagination;
