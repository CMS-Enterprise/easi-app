import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseGlobalFiltersState } from 'react-table';
import classnames from 'classnames';

type TableResultsProps = {
  className?: string;
  globalFilter: UseGlobalFiltersState<{}>;
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

  // If data or filter results are less than 10 (page size) - then default to the number of returned rows
  const pageLength: number = rows < 10 ? rows : (pageIndex + 1) * pageSize;

  return (
    <div className={classnames(className)}>
      <span>
        {rows === 0 ? (
          t('tableAndPagination:results.noResults')
        ) : (
          <span>
            {t('tableAndPagination:results.showing')} {pageIndex * pageSize + 1}
            -{pageLength} {t('tableAndPagination:results.of')} {rows}{' '}
            {t('tableAndPagination:results.results')}
          </span>
        )}
      </span>
    </div>
  );
};

export default TableResults;
