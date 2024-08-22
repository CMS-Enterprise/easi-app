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

import UswdsReactLink from 'components/LinkWrapper';
import Alert from 'components/shared/Alert';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests } from 'queries/types/GetRequests';
import { SystemIntakeStatusRequester } from 'types/graphql-global-types';
import { RequestType } from 'types/requestType';
import { formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  SystemIntakeStatusRequesterIndex,
  trbRequestStatusSortType
} from 'utils/tableRequestStatusIndex';
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
    'technicalAssistance',
    'governanceReviewTeam'
  ]);

  const { loading, error, data: tableData } = useQuery<GetRequests>(
    GetRequestsQuery,
    {
      fetchPolicy: 'cache-and-network'
    }
  );

  const columns: any = useMemo(() => {
    return [
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
        Header: t('requestsTable.headers.name'),
        accessor: 'name',
        Cell: ({ row, value }: any) => {
          let link: string;

          if (isTRBRequestType(row.original)) {
            link = `/trb/task-list/${row.original.id}`;
          } else {
            switch (row.original.type) {
              case 'IT Governance':
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
        Header: t('requestsTable.headers.status'),
        // The status property is just a generic property available on all request types
        // See cases below for details on how statuses are determined by type
        id: 'status',
        accessor: (obj: any) => {
          switch (obj.type) {
            case 'IT Governance':
              return t(
                `governanceReviewTeam:systemIntakeStatusRequester.${obj.statusRequester}`,
                { lcid: obj.lcid }
              );
            case 'TRB':
              return t(`table.requestStatus.${obj.status}`, {
                ns: 'technicalAssistance'
              });
            default:
              return '';
          }
        },
        sortType: (a: any, b: any) => {
          // Check for the 2 status types: trb requester and itgov requester
          // Put IT Gov requests before TRB
          if (
            a.original.type === 'IT Governance' &&
            b.original.type === 'TRB'
          ) {
            return -1;
          }
          if (
            a.original.type === 'TRB' &&
            b.original.type === 'IT Governance'
          ) {
            return 1;
          }

          // Compare IT Gov Requests
          if (
            a.original.type === 'IT Governance' &&
            b.original.type === 'IT Governance'
          ) {
            const astatus = a.original.statusRequester;
            const bstatus = b.original.statusRequester;

            // Check some matching statuses to further sort by lcid value
            if (
              (astatus === SystemIntakeStatusRequester.LCID_ISSUED &&
                bstatus === SystemIntakeStatusRequester.LCID_ISSUED) ||
              (astatus === SystemIntakeStatusRequester.LCID_EXPIRED &&
                bstatus === SystemIntakeStatusRequester.LCID_EXPIRED) ||
              (astatus === SystemIntakeStatusRequester.LCID_RETIRED &&
                bstatus === SystemIntakeStatusRequester.LCID_RETIRED)
            ) {
              return a.original.lcid > b.original.lcid ? 1 : -1;
            }

            const ai = SystemIntakeStatusRequesterIndex()[astatus];
            const bi = SystemIntakeStatusRequesterIndex()[bstatus];
            return ai > bi ? 1 : -1;
          }

          // Compare TRB Requests
          if (a.original.type === 'TRB' && b.original.type === 'TRB') {
            return trbRequestStatusSortType(a, b);
          }

          return 0;
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
      return tableMap(tableData);
    }
    return [];
  }, [tableData]);

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
      autoResetPage: true,
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

  return (
    <div className="requests-table margin-bottom-6">
      {data.length > state.pageSize && (
        <>
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
            filteredRowLength={rows.length}
            rowLength={data.length}
            className="margin-bottom-4"
          />
        </>
      )}
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
        {data.length > state.pageSize && (
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

      {data.length === 0 && (
        <Alert type="info" slim>
          {t('requestsTable.empty')}
        </Alert>
      )}

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
