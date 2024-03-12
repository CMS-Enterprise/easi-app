import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FilterValue } from 'react-table';
import classnames from 'classnames';

import Spinner from 'components/Spinner';

type TableResultsProps = {
  className?: string;
  globalFilter: FilterValue;
  pageIndex: number;
  pageSize: number;
  filteredRowLength: number;
  rowLength: number;
  loading?: boolean;
};

const displayResult = (searchTerm: FilterValue) =>
  searchTerm ? (
    <span className="margin-left-05">
      <Trans i18nKey="tableAndPagination:results.searchInput" />{' '}
      <strong>&quot;{searchTerm}&quot;</strong>{' '}
    </span>
  ) : (
    ''
  );

const TableResults = ({
  className,
  globalFilter,
  pageIndex,
  pageSize,
  filteredRowLength,
  rowLength,
  loading
}: TableResultsProps) => {
  const { t } = useTranslation('tableAndPagination');

  // Sets the max results to either the filtered dataset or default (depending on if filtering)
  const rows: number = globalFilter ? filteredRowLength : rowLength;

  const currentPage: number = pageIndex * pageSize + 1;

  // If data or filter results are less than 10 (page size) - then default to the number of returned rows
  const pageRange: number = rows < 10 ? rows : (pageIndex + 1) * pageSize;

  const Result = () => {
    if (loading) {
      return (
        <>
          <Spinner className="margin-right-1" />
          {t('general:loadingResults')}
        </>
      );
    }

    if (rows === 0) {
      return (
        <>
          {t('tableAndPagination:results.noResults')}{' '}
          {/* Displays the search input even if there are no results */}
          {displayResult(globalFilter)}
        </>
      );
    }

    return (
      <>
        <Trans i18nKey="tableAndPagination:results.results">
          indexZero {{ currentPage }} indexOne {{ pageRange }} indexTwo{' '}
          {{ rows }}
        </Trans>
        {displayResult(globalFilter)}
      </>
    );
  };

  return (
    <div
      className={classnames(className, 'display-flex flex-align-center')}
      data-testid="page-results"
    >
      <Result />
    </div>
  );
};

export default TableResults;
