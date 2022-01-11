import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UsePaginationInstanceProps, UsePaginationState } from 'react-table';
import classnames from 'classnames';

import './index.scss';

type ReactTablePaginationProps = {
  className?: string;
} & UsePaginationInstanceProps<{}> &
  UsePaginationState<{}>;

const filterPages = (visiblePages: number[], totalPages: number) => {
  return visiblePages.filter(page => page <= totalPages);
};

const getVisiblePages = (page: number, total: number) => {
  if (total < 7) {
    return filterPages([1, 2, 3, 4, 5], total);
  }
  if (page % 5 >= 0 && page > 4 && page + 2 < total) {
    return [1, page - 1, page, page + 1, total];
  }
  if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
    return [1, total - 3, total - 2, total - 1, total];
  }
  return [1, 2, 3, 4, total];
};

const TablePagination = ({
  className,
  gotoPage,
  previousPage,
  nextPage,
  canNextPage,
  pageIndex,
  pageOptions,
  canPreviousPage
}: ReactTablePaginationProps) => {
  const { t } = useTranslation('systemProfile');
  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  const classNames = classnames('usa-pagination', className);

  useEffect(() => {
    setVisiblePages(getVisiblePages(pageIndex + 1, pageOptions.length));
  }, [pageIndex, pageOptions.length]);

  return (
    <nav
      aria-label="Pagination"
      className={classNames}
      data-testid="table-pagination"
    >
      <ul className="usa-pagination__list">
        {canPreviousPage && (
          <li className="usa-pagination__item usa-pagination__arrow">
            <button
              type="button"
              className="usa-pagination__link usa-pagination__previous-page"
              aria-label="Previous page"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <span className="usa-pagination__link-text">
                {'< '}
                {t('tableAndPagination:pagination.previous')}{' '}
              </span>
            </button>
          </li>
        )}
        <li className="usa-pagination__item usa-pagination__page-no">
          {visiblePages.map((page, index, array) => {
            return (
              <>
                {array[index - 1] + 2 < page ? (
                  <>
                    <li
                      className="usa-pagination__item usa-pagination__overflow"
                      role="presentation"
                    >
                      <span> … </span>
                    </li>
                    <li className="usa-pagination__item">
                      <button
                        type="button"
                        aria-label={`Page ${page}`}
                        key={page}
                        className={
                          pageIndex + 1 === page
                            ? 'usa-pagination__button usa-current'
                            : 'usa-pagination__button'
                        }
                        onClick={() => gotoPage(page - 1)}
                      >
                        {page}
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="usa-pagination__item">
                    <button
                      type="button"
                      aria-label={`Page ${page}`}
                      key={page}
                      className={
                        pageIndex + 1 === page
                          ? 'usa-pagination__button usa-current'
                          : 'usa-pagination__button'
                      }
                      onClick={() => gotoPage(page - 1)}
                    >
                      {page}
                    </button>
                  </li>
                )}
              </>
            );
          })}
        </li>
        {canNextPage && (
          <li className="usa-pagination__item usa-pagination__arrow">
            <button
              type="button"
              className="usa-pagination__link usa-pagination__previous-page"
              aria-label="Next page"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <span className="usa-pagination__link-text">
                {t('tableAndPagination:pagination.next')}
                {' >'}
              </span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default TablePagination;
