import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Cell,
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { Button, Table as UswdsTable } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  GetSystemIntakeRelatedRequestsDocument,
  GetSystemIntakeRelatedRequestsQuery,
  GetSystemIntakeRelatedRequestsQueryVariables,
  GetTRBRequestRelatedRequestsDocument,
  GetTRBRequestRelatedRequestsQuery,
  GetTRBRequestRelatedRequestsQueryVariables
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { RequestType } from 'types/requestType';
import { formatDateLocal } from 'utils/date';
import formatContractNumbers from 'utils/formatContractNumbers';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import user from 'utils/user';

import { LinkedRequestForTable } from './linkedRequestForTable';

const RelatedRequestsTable = ({
  requestID,
  type,
  pageSize = 10
}: {
  requestID: string;
  type: RequestType;
  pageSize?: number;
}) => {
  const { t } = useTranslation('admin');

  const { loading, error, data } = useQuery<
    GetSystemIntakeRelatedRequestsQuery | GetTRBRequestRelatedRequestsQuery,
    | GetSystemIntakeRelatedRequestsQueryVariables
    | GetTRBRequestRelatedRequestsQueryVariables
  >(
    type === 'trb'
      ? GetTRBRequestRelatedRequestsDocument
      : GetSystemIntakeRelatedRequestsDocument,
    {
      fetchPolicy: 'cache-and-network',
      variables:
        type === 'trb'
          ? { trbRequestID: requestID }
          : { systemIntakeID: requestID }
    }
  );

  const { groups } = useSelector((state: AppState) => state.auth);

  const flags = useFlags();

  const isTRBAdmin = useMemo(
    () => user.isTrbAdmin(groups, flags),
    [flags, groups]
  );

  const isITGovAdmin = useMemo(
    () => user.isITGovAdmin(groups, flags),
    [flags, groups]
  );

  const tableData: LinkedRequestForTable[] = useMemo(() => {
    if (error !== undefined) {
      return [];
    }

    if (loading) {
      return [];
    }

    if (data === undefined || data === null) {
      return [];
    }

    const { relatedIntakes, relatedTRBRequests } =
      type === 'trb'
        ? (data && 'trbRequest' in data && data.trbRequest) || {}
        : (data && 'systemIntake' in data && data.systemIntake) || {};

    const requests: LinkedRequestForTable[] = [];

    // handle related intakes
    (relatedIntakes || []).forEach(relatedIntake => {
      requests.push({
        id: relatedIntake.id,
        contractNumber: formatContractNumbers(relatedIntake.contractNumbers),
        process: 'IT Governance',
        projectTitle: relatedIntake.requestName || '',
        status:
          isTRBAdmin || isITGovAdmin
            ? relatedIntake.statusAdmin
            : relatedIntake.statusRequester,
        submissionDate: relatedIntake.submittedAt || '',
        lcid: relatedIntake.lcid || null
      });
    });

    // handle trb requests
    (relatedTRBRequests || []).forEach(relatedTRBRequest => {
      requests.push({
        id: relatedTRBRequest.id,
        contractNumber: formatContractNumbers(
          relatedTRBRequest.contractNumbers
        ),
        process: 'TRB',
        projectTitle: relatedTRBRequest.name || '',
        status: relatedTRBRequest.status,
        submissionDate: relatedTRBRequest.createdAt,
        lcid: null
      });
    });
    return requests;
  }, [data, error, isITGovAdmin, isTRBAdmin, loading, type]);

  const columns: Column<LinkedRequestForTable>[] = useMemo<
    Column<LinkedRequestForTable>[]
  >(() => {
    return [
      {
        Header: t<string>('tableColumns.projectTitle'),
        accessor: 'projectTitle',
        Cell: ({
          row,
          value
        }: {
          row: Row<LinkedRequestForTable>;
          value: LinkedRequestForTable['projectTitle'];
        }): JSX.Element => {
          // non-admins cannot click through the request titles
          if (!isTRBAdmin && !isITGovAdmin) {
            return <>{value}</>;
          }

          // a non-TRB-admin cannot click through a TRB
          if (row.original.process === 'TRB' && !isTRBAdmin) {
            return <>{value}</>;
          }

          // a non-ITGov-admin cannot click through an ITGov
          if (row.original.process === 'IT Governance' && !isITGovAdmin) {
            return <>{value}</>;
          }

          let link: string;
          if (row.original.process === 'TRB') {
            link = `/trb/${row.original.id}/request`;
          } else {
            link = `/it-governance/${row.original.id}/intake-request`;
          }

          return <UswdsReactLink to={link}>{value}</UswdsReactLink>;
        }
      },
      {
        Header: t<string>('tableColumns.process'),
        accessor: 'process'
      },
      {
        Header: t<string>('tableColumns.contractNumber'),
        accessor: 'contractNumber'
      },
      {
        Header: t<string>('tableColumns.status'),
        accessor: (request: LinkedRequestForTable) => {
          if (request.process === 'TRB') {
            return t<string>(
              `tableAndPagination:status.requestStatus.${request.status}`
            );
          }

          if (isTRBAdmin || isITGovAdmin) {
            return t<string>(
              `governanceReviewTeam:systemIntakeStatusAdmin.${request.status}`,
              { lcid: request.lcid }
            );
          }

          return t<string>(
            `governanceReviewTeam:systemIntakeStatusRequester.${request.status}`,
            { lcid: request.lcid }
          );
        }
      },
      {
        Header: t<string>('tableColumns.submissionDate'),
        accessor: 'submissionDate',
        Cell: ({
          value
        }: {
          value: LinkedRequestForTable['submissionDate'];
        }): JSX.Element => <>{formatDateLocal(value, 'MM/dd/yyyy')}</>
      }
    ];
  }, [isITGovAdmin, isTRBAdmin, t]);

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
      data: tableData as LinkedRequestForTable[],
      sortTypes: {
        alphanumeric: (
          rowOne: Row<LinkedRequestForTable>,
          rowTwo: Row<LinkedRequestForTable>,
          columnName: string
        ) => {
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
        pageSize
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (error) {
    return <NotFoundPartial />;
  }

  if (loading) {
    return <PageLoading />;
  }

  rows.map((row: Row<LinkedRequestForTable>) => prepareRow(row));
  return (
    <div>
      <h2 className="margin-bottom-3">{t('relatedRequests')}</h2>

      {tableData.length > state.pageSize && (
        <>
          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            tableID={t<string>('relatedRequestsTable.id')}
            tableName={t<string>('relatedRequestsTable.title')}
            className="margin-bottom-4"
          />
          <TableResults
            globalFilter={state.globalFilter}
            pageIndex={state.pageIndex}
            pageSize={state.pageSize}
            filteredRowLength={rows.length}
            rowLength={tableData.length}
            className="margin-bottom-4"
          />
        </>
      )}
      <UswdsTable bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={{ ...headerGroup.getHeaderGroupProps() }.key}
            >
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px"
                  style={{ paddingLeft: '0', position: 'relative' }}
                >
                  <Button
                    type="button"
                    unstyled
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column)}
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: Row<LinkedRequestForTable>) => {
            // without this destructure (i.e., calling `{...row.getRowProps()}` down below
            // or even using `= row;` instead of `= { ...row }; on the next line
            // leads to a handful of `[field] is missing in props validation(react/prop-types)`
            // TODO: why do other tables not trigger eslint issue but this one does?
            const { getRowProps, cells } = { ...row };
            return (
              <tr {...getRowProps()} key={{ ...getRowProps() }.key}>
                {cells.map((cell: Cell<LinkedRequestForTable, any>) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={{ ...cell.getCellProps() }.key}
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
        {tableData.length > state.pageSize && (
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

        {tableData.length > 10 && (
          <TablePageSize
            className="desktop:grid-col-auto"
            pageSize={state.pageSize}
            setPageSize={setPageSize}
          />
        )}
      </div>
      {tableData.length === 0 && (
        <em className="text-bold">{t<string>('relatedRequestsTable.empty')}</em>
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

export default RelatedRequestsTable;
