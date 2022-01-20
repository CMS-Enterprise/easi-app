import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FilterValue } from 'react-table';
import classnames from 'classnames';

type TableResultsProps = {
  className?: string;
  globalFilter: FilterValue;
  pageIndex: number;
  pageSize: number;
  filteredRowLength: number;
  rowLength: number;
};

const TableResults = ({
  className,
  globalFilter,
  pageIndex,
  pageSize,
  filteredRowLength,
  rowLength
}: TableResultsProps) => {
  const { t } = useTranslation('tableAndPagination');

  // Sets the max results to either the filtered dataset or default (depending on if filtering)
  const rows: number = globalFilter ? filteredRowLength : rowLength;

  const currentPage = pageIndex * pageSize + 1;

  // If data or filter results are less than 10 (page size) - then default to the number of returned rows
  const pageRange: number = rows < 10 ? rows : (pageIndex + 1) * pageSize;

  return (
    <div className={classnames(className)} data-testid="page-results">
      <span>
        {rows === 0 ? (
          <div>
            {t('tableAndPagination:results.noResults')}{' '}
            {globalFilter && t('tableAndPagination:results.searchInput')}{' '}
            <strong>{globalFilter}</strong>
          </div>
        ) : (
          <div>
            <Trans i18nKey="tableAndPagination:results.results">
              indexZero {{ currentPage }} indexOne {{ pageRange }} indexTwo{' '}
              {{ rows }}
            </Trans>
            {globalFilter && t('tableAndPagination:results.searchInput')}{' '}
            <strong>{globalFilter}</strong>
          </div>
        )}
      </span>
    </div>
  );
};

export default TableResults;
