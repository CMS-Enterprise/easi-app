import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Table as UswdsTable } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import GetSystemIntakeRelatedRequests from 'queries/GetSystemIntakeRelatedRequests';
import { GetSystemIntake } from 'queries/types/GetSystemIntake';
import { GetSystemIntakeRelatedRequestsVariables } from 'queries/types/GetSystemIntakeRelatedRequests';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';
import { NotFoundPartial } from 'views/NotFound';

import { LinkedRequestForTable } from './tableMap';

const RelatedRequestsTable = ({
  requestID,
  pageSize = 10
}: {
  requestID: string;
  pageSize?: number;
}) => {
  const { t } = useTranslation('admin');
  // make api call
  const { loading, error, data } = useQuery<
    GetSystemIntake,
    GetSystemIntakeRelatedRequestsVariables
  >(GetSystemIntakeRelatedRequests, {
    variables: { systemIntakeID: requestID },
    fetchPolicy: 'cache-and-network'
  });

  const tableData: LinkedRequestForTable[] = useMemo(() => {
    if (error !== undefined) {
      return [];
    }

    if (loading) {
      return [];
    }

    if (data === undefined || data.systemIntake === null) {
      return [];
    }

    const {
      systemIntake: { relatedIntakes, relatedTRBRequests }
    } = data;

    const requests: LinkedRequestForTable[] = [];

    // handle related intakes
    relatedIntakes.forEach(relatedIntake => {
      requests.push({
        id: relatedIntake.id,
        contractNumber: relatedIntake.contractNumbers
          .map(cn => cn.contractNumber)
          .join(', '),
        process: 'IT Governance',
        projectTitle: relatedIntake.requestName || '',
        status: relatedIntake.decisionState,
        submissionDate: relatedIntake.submittedAt || ''
      });
    });

    // handle trb requests
    relatedTRBRequests.forEach(relatedTRBRequest => {
      requests.push({
        id: relatedTRBRequest.id,
        contractNumber: relatedTRBRequest.contractNumbers
          .map(cn => cn.contractNumber)
          .join(', '),
        process: 'TRB',
        projectTitle: relatedTRBRequest.name || '',
        status: relatedTRBRequest.status,
        submissionDate: relatedTRBRequest.createdAt
      });
    });
    return requests;
  }, [data, error, loading]);

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
          let link: string;
          if (row.original.process === 'TRB') {
            link = `/trb/task-list/${row.original.id}`;
          } else {
            link = `/governance-task-list/${row.original.id}`;
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
        accessor: 'status'
      },
      {
        Header: t<string>('tableColumns.submissionDate'),
        accessor: 'submissionDate'
      }
    ];
  }, [t]);

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
      {tableData.length > state.pageSize && (
        <>
          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            tableID={t('relatedRequestsTable.id')}
            tableName={t('relatedRequestsTable.title')}
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
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  aria-sort={getColumnSortStatus(column)}
                  className="table-header"
                  scope="col"
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
          {page.map((row: Row<LinkedRequestForTable>) => {
            // without this destructure (i.e., calling `{...row.getRowProps()}` down below
            // or even using `= row;` instead of `= { ...row }; on the next line
            // leads to a handful of `[field] is missing in props validation(react/prop-types)`
            // TODO: why do other tables not trigger eslint issue but this one does?
            const { getRowProps, cells } = { ...row };
            return (
              <tr {...getRowProps()}>
                {cells.map((cell: Cell<LinkedRequestForTable, any>) => {
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
        <em className="text-bold">{t('relatedRequestsTable.empty')}</em>
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
