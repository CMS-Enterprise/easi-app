import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import {
  GetRequestsQuery,
  SystemIntakeStatusRequester,
  useGetRequestsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
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
import user from 'utils/user';

import { MergedRequestsForTable } from './mergedRequestForTable';

import '../index.scss';

type GetSystemIntakesType = GetRequestsQuery['mySystemIntakes'][0];
type GetTRBRequestsType = GetRequestsQuery['myTrbRequests'][0];

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

  const { groups } = useSelector((state: AppState) => state.auth);

  const flags = useFlags();

  const { loading, error, data: tableData } = useGetRequestsQuery();

  const isITGovAdmin: boolean = useMemo(
    () => user.isITGovAdmin(groups, flags),
    [flags, groups]
  );

  const isTRBAdmin: boolean = useMemo(
    () => user.isTrbAdmin(groups, flags),
    [flags, groups]
  );

  const columns: Column<MergedRequestsForTable>[] = useMemo<
    Column<MergedRequestsForTable>[]
  >(() => {
    return [
      {
        Header: t<string>('requestsTable.headers.submittedAt'),
        accessor: 'submissionDate',
        Cell: ({ value }: any) => {
          if (value) {
            return <>{formatDateUtc(value, 'MM/dd/yyyy')}</>;
          }
          return <>Not submitted</>;
        },
        sortType: (
          a: Row<MergedRequestsForTable>,
          b: Row<MergedRequestsForTable>
        ) => {
          return (a.original.submissionDate || 'z') >
            (b.original.submissionDate || 'z')
            ? 1
            : -1;
        }
      },
      {
        Header: t<string>('requestsTable.headers.name'),
        accessor: 'name',
        Cell: ({
          row,
          value
        }: {
          row: Row<MergedRequestsForTable>;
          value: MergedRequestsForTable['name'];
        }) => {
          let link: string;

          switch (row.original.process) {
            case 'TRB':
              link = `/trb/task-list/${row.original.id}`;
              break;
            case 'IT Governance':
              link = `/governance-task-list/${row.original.id}`;
              break;
            default:
              link = '/';
          }

          return <UswdsReactLink to={link}>{value}</UswdsReactLink>;
        },
        width: '220px',
        maxWidth: 350
      },
      {
        Header: t<string>('requestsTable.headers.type'),
        accessor: 'process'
      },
      {
        Header: t<string>('requestsTable.headers.status'),
        // The status property is just a generic property available on all request types
        // See cases below for details on how statuses are determined by type
        id: 'status',
        accessor: (request: MergedRequestsForTable) => {
          switch (request.process) {
            case 'IT Governance':
              // return admin status for admins
              if (isITGovAdmin || isTRBAdmin) {
                return t<string>(
                  `governanceReviewTeam:systemIntakeStatusAdmin.${request.status}`,
                  { lcid: request.lcid }
                );
              }

              // return requester status for non-admins
              return t<string>(
                `governanceReviewTeam:systemIntakeStatusRequester.${request.status}`,
                { lcid: request.lcid }
              );

            case 'TRB':
              return t<string>(`table.requestStatus.${request.status}`, {
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

            const ai =
              SystemIntakeStatusRequesterIndex[
                astatus as SystemIntakeStatusRequester
              ];
            const bi =
              SystemIntakeStatusRequesterIndex[
                bstatus as SystemIntakeStatusRequester
              ];
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
        Header: t<string>('requestsTable.headers.nextMeetingDate'),
        accessor: 'nextMeetingDate',
        Cell: ({ value }: { value: string | null | undefined }) => {
          if (value) {
            return <>{formatDateUtc(value, 'MM/dd/yyyy')}</>;
          }
          return <>None</>;
        }
      },
      {
        Header: t<string>('requestsTable.headers.relatedSystems'),
        accessor: 'systems',
        Cell: cell => {
          const { value } = cell;
          /* eslint react/prop-types: 0 */
          return <>{value.join(', ')}</>;
        },
        width: '250px'
      }
    ];
  }, [isITGovAdmin, isTRBAdmin, t]);

  // Modifying data for table sorting and prepping for Cell configuration
  const data: MergedRequestsForTable[] = useMemo<
    MergedRequestsForTable[]
  >(() => {
    if (!tableData) {
      return [];
    }

    const merged: MergedRequestsForTable[] = [];

    if (!type || type === 'itgov') {
      tableData.mySystemIntakes.forEach(
        (systemIntake: GetSystemIntakesType) => {
          merged.push({
            id: systemIntake.id,
            name: systemIntake.requestName || 'Draft',
            nextMeetingDate: systemIntake.nextMeetingDate,
            process: 'IT Governance',
            status:
              isITGovAdmin || isTRBAdmin
                ? systemIntake.statusAdmin
                : systemIntake.statusRequester,
            submissionDate: systemIntake.submittedAt,
            systems: systemIntake.systems.map(system => system.name),
            lcid: systemIntake.lcid,
            type: 'IT Governance',
            statusRequester: systemIntake.statusRequester
          });
        }
      );
    }

    if (!type || type === 'trb') {
      tableData.myTrbRequests.forEach((trbRequest: GetTRBRequestsType) => {
        merged.push({
          id: trbRequest.id,
          name: trbRequest.name || 'Draft',
          nextMeetingDate: trbRequest.nextMeetingDate,
          process: 'TRB',
          status: trbRequest.status,
          submissionDate: trbRequest.submittedAt,
          systems: trbRequest.systems.map(system => system.name),
          lcid: null,
          type: 'TRB'
        });
      });
    }

    return merged;
  }, [isITGovAdmin, isTRBAdmin, tableData, type]);

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
        sortBy: useMemo(() => [{ id: 'submissionDate', desc: true }], []),
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
            tableID={t<string>('requestsTable.id')}
            tableName={t<string>('requestsTable.title')}
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
        <caption className="usa-sr-only">
          {t<string>('requestsTable.caption')}
        </caption>
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
          {t<string>('requestsTable.empty')}
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
