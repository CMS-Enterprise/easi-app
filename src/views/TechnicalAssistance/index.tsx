/**
 * @file "Technical Assistance" (TRB) homepage.
 * Created with reference to `src/views/MakingARequest`, `src/views/MyRequests/Table`.
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import {
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Button, Link, Table } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

interface TrbDataTodo {
  name: string;
  createdDts: string;
  status: string;
}

type TechnicalAssistanceProps = {};

// eslint-disable-next-line no-empty-pattern
function TechnicalAssistance({}: TechnicalAssistanceProps) {
  const { t } = useTranslation('technicalAssistance');
  const { url } = useRouteMatch();

  const columns = useMemo<Column<TrbDataTodo>[]>(() => {
    return [
      {
        Header: t<string>('table.header.requestName'),
        accessor: 'name'
      },
      {
        Header: t<string>('table.header.submissionDate'),
        accessor: 'createdDts'
      },
      {
        Header: t<string>('table.header.status'),
        accessor: 'status'
      }
    ];
  }, [t]);

  const data = useMemo<TrbDataTodo[]>(() => {
    return [
      {
        name: 'foo',
        createdDts: '2011-10-05T14:48:00.000Z',
        status: 'OPEN'
      },
      {
        name: 'bar',
        createdDts: '2012-10-05T14:48:00.000Z',
        status: 'OPEN'
      },
      {
        name: 'baz',
        createdDts: '2013-10-05T14:48:00.000Z',
        status: 'CLOSED'
      }
    ];
  }, []);

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    rows,
    setGlobalFilter,
    setPageSize,
    state
  } = useTable(
    {
      columns,
      data,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'name', desc: false }], []),
        pageIndex: 0,
        pageSize: 10
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <MainContent className="technical-assistance grid-container">
      <PageHeading>{t('heading')}</PageHeading>

      <Link
        href={`${url}/request-type`}
        className="usa-button"
        variant="unstyled"
      >
        {t('nextStep')}
      </Link>

      <div>
        <GlobalClientFilter
          setGlobalFilter={setGlobalFilter}
          tableID={t('systemTable.id')}
          tableName={t('systemTable.title')}
          className="margin-bottom-4"
        />
        <TableResults
          globalFilter={state.globalFilter}
          pageIndex={state.pageIndex}
          pageSize={state.pageSize}
          filteredRowLength={rows.length}
          rowLength={data.length}
          className="margin-bottom-4"
        />

        <Table bordered={false} fullWidth scrollable {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    aria-sort={getColumnSortStatus(column)}
                    scope="col"
                    className="border-bottom-2px"
                  >
                    <Button
                      type="button"
                      unstyled
                      className="width-full display-flex"
                      {...column.getSortByToggleProps()}
                    >
                      <div className="flex-fill text-no-wrap">
                        {column.render('Header')}
                      </div>
                      <div className="position-relative width-205 margin-left-05">
                        {getHeaderSortIcon(column)}
                      </div>
                    </Button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div className="grid-row grid-gap grid-gap-lg">
          <TablePagination
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
            pageIndex={state.pageIndex}
            pageOptions={pageOptions}
            canPreviousPage={canPreviousPage}
            pageCount={pageCount}
            pageSize={state.pageSize}
            setPageSize={setPageSize}
            page={[]}
            className="desktop:grid-col-fill"
          />
          <TablePageSize
            className="desktop:grid-col-auto"
            pageSize={state.pageSize}
            setPageSize={setPageSize}
          />
        </div>

        <div
          className="usa-sr-only usa-table__announcement-region"
          aria-live="polite"
        >
          {currentTableSortDescription(headerGroups[0])}
        </div>
      </div>
    </MainContent>
  );
}

export default TechnicalAssistance;
