import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests, GetRequestsVariables } from 'queries/types/GetRequests';
import { RequestType } from 'types/graphql-global-types';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import tableMap, { isTRBRequestType } from './tableMap';

import '../index.scss';

type myRequestsTableProps = {
  type?: RequestType;
  hiddenColumns?: string[];
  defaultPageSize?: number;
};

const Table = ({
  type,
  hiddenColumns,
  defaultPageSize = 10
}: myRequestsTableProps) => {
  const { t } = useTranslation([
    'home',
    'intake',
    'accessibility',
    'technicalAssistance',
    'governanceReviewTeam'
  ]);

  const { loading, error, data: tableData } = useQuery<
    GetRequests,
    GetRequestsVariables
  >(GetRequestsQuery, {
    variables: { first: 20 },
    fetchPolicy: 'cache-and-network'
  });

  const flags = useFlags();

  const columns: any = useMemo(() => {
    return [
      {
        Header: t('requestsTable.headers.name'),
        accessor: 'name',
        Cell: ({ row, value }: any) => {
          let link: string;

          if (isTRBRequestType(row.original)) {
            link = `/trb/task-list/${row.original.id}`;
          } else {
            switch (row.original.type) {
              case t('requestsTable.types.ACCESSIBILITY_REQUEST'):
                link = `/508/requests/${row.original.id}`;
                break;
              case t('requestsTable.types.GOVERNANCE_REQUEST'):
                link = `/governance-task-list/${row.original.id}`;
                break;
              default:
                link = '/';
            }
          }

          return <UswdsReactLink to={link}>{value}</UswdsReactLink>;
        },
        width: '220px',
        maxWidth: 350
      },
      {
        Header: t('requestsTable.headers.type'),
        accessor: 'type'
      },
      {
        Header: t('requestsTable.headers.submittedAt'),
        accessor: 'submittedAt',
        Cell: ({ value }: any) => {
          if (value) {
            return formatDateUtc(value, 'MM/dd/yyyy');
          }
          return 'Not submitted';
        }
      },
      {
        Header: t('requestsTable.headers.status'),
        accessor: 'status',
        Cell: ({ row, value }: any) => {
          switch (row.original.type) {
            case t(`requestsTable.types.ACCESSIBILITY_REQUEST`):
              // Status hasn't changed if the status record created at is the same
              // as the 508 request's submitted at
              if (row.original.submittedAt === row.original.createdAt) {
                return <span>{value}</span>;
              }
              return (
                <span>
                  {value}
                  <span className="text-base-dark font-body-3xs">{` - Changed on ${formatDateLocal(
                    row.original.statusCreatedAt,
                    'MM/dd/yyyy'
                  )}`}</span>
                </span>
              );
            case t(`requestsTable.types.GOVERNANCE_REQUEST`):
              if (flags.itGovV2Fields) {
                return t(
                  `governanceReviewTeam:systemIntakeStatusRequester.${row.original.statusRequester}`,
                  { lcid: row.original.lcid }
                );
              }
              if (row.original.lcid) {
                return `${value}: ${row.original.lcid}`;
              }
              return value;
            case t(`requestsTable.types.TRB`):
              return value;
            default:
              return '';
          }
        },
        width: '200px'
      },
      {
        Header: t('requestsTable.headers.nextMeetingDate'),
        accessor: 'nextMeetingDate',
        Cell: ({ value }: any) => {
          if (value) {
            return formatDateUtc(value, 'MM/dd/yyyy');
          }
          return 'None';
        }
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modifying data for table sorting and prepping for Cell configuration
  const data = useMemo(() => {
    if (tableData) {
      return tableMap(tableData, t, type);
    }
    return [];
  }, [tableData, t, type]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    page,
    rows,
    setGlobalFilter,
    state,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      globalFilter: useMemo(() => globalFilterCellText, []),
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], []),
        pageIndex: 0,
        pageSize: defaultPageSize
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  if (loading) {
    return (
      <div className="text-center" data-testid="table-loading">
        <Spinner size="xl" />;
      </div>
    );
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (data.length === 0) {
    return <p>{t('requestsTable.empty')}</p>;
  }

  return (
    <div className="accessibility-requests-table">
      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('requestsTable.id')}
        tableName={t('requestsTable.title')}
        className="margin-bottom-4"
      />

      <TableResults
        globalFilter={state.globalFilter}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        filteredRowLength={page.length}
        rowLength={data.length}
        className="margin-bottom-4"
      />
      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">{t('requestsTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers
                // @ts-ignore
                .filter(column => !hiddenColumns?.includes(column.Header))
                .map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    aria-sort={getColumnSortStatus(column)}
                    className="table-header"
                    scope="col"
                    style={{
                      minWidth: index === 4 ? '220px' : '140px',
                      width: index === 2 ? '220px' : '140px',
                      paddingLeft: '0',
                      position: 'relative'
                    }}
                  >
                    <button
                      className="usa-button usa-button--unstyled"
                      type="button"
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      {getHeaderSortIcon(column)}
                    </button>
                  </th>
                ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells
                  .filter(cell => {
                    // @ts-ignore
                    return !hiddenColumns?.includes(cell.column.Header);
                  })
                  .map((cell, i) => {
                    if (i === 0) {
                      return (
                        <th
                          {...cell.getCellProps()}
                          scope="row"
                          style={{ paddingLeft: '0' }}
                        >
                          {cell.render('Cell')}
                        </th>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{ width: cell.column.width, paddingLeft: '0' }}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>

      <div className="grid-row grid-gap grid-gap-lg">
        {data.length > 10 && (
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
        )}

        {data.length > 10 && (
          <TablePageSize
            className="desktop:grid-col-auto"
            pageSize={state.pageSize}
            setPageSize={setPageSize}
          />
        )}
      </div>

      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>
    </div>
  );
};

export default Table;
