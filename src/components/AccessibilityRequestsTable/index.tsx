/* eslint-disable react/prop-types */

import React, { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Table } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import { GetAccessibilityRequests_accessibilityRequests_edges_node as AccessibilityRequests } from 'queries/types/GetAccessibilityRequests';
import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';
import { formatDateLocal, formatDateUtc } from 'utils/date';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import './index.scss';

type AccessibilityRequestsTableProps = {
  requests: AccessibilityRequests[];
};

const AccessibilityRequestsTable: FunctionComponent<AccessibilityRequestsTableProps> = ({
  requests
}) => {
  const { t } = useTranslation('accessibility');
  const columns: any = useMemo(() => {
    return [
      {
        Header: t('requestTable.header.requestName'),
        accessor: 'requestName',
        Cell: ({ row, value }: any) => {
          return (
            <UswdsReactLink to={`/508/requests/${row.original.id}`}>
              {value}
            </UswdsReactLink>
          );
        },
        minWidth: 300,
        maxWidth: 350
      },
      {
        Header: t('requestTable.header.submissionDate'),
        accessor: 'submittedAt',
        Cell: ({ value }: any) => {
          if (value) {
            return formatDateLocal(value, 'MM/dd/yyyy');
          }
          return '';
        },
        minWidth: 180
      },
      {
        Header: t('requestTable.header.businessOwner'),
        accessor: 'businessOwner'
      },
      {
        Header: t('requestTable.header.testDate'),
        accessor: 'relevantTestDate',
        Cell: ({ value }: any): any => {
          if (value) {
            return formatDateUtc(value, 'MM/dd/yyyy');
          }
          return t('requestTable.emptyTestDate');
        },
        minWidth: 180
      },
      {
        Header: t('requestTable.header.status'),
        accessor: (value: AccessibilityRequests) => {
          return value?.statusRecord?.status;
        },
        Cell: ({ row, value }: any) => {
          // Status hasn't changed if the status record created at is the same
          // as the 508 request's submitted at
          if (
            row.original?.submittedAt === row.original?.statusRecord?.createdAt
          ) {
            return <span>{value}</span>;
          }

          return (
            <span>
              {value}{' '}
              <span className="text-base-dark font-body-3xs">{`changed on ${formatDateLocal(
                row.original?.statusRecord?.createdAt,
                'MM/dd/yyyy'
              )}`}</span>
            </span>
          );
        },
        minWidth: 240
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Here is where the data can be modified and used appropriately for sorting.
  // Modifed data can then be configured with JSX components in column cell configuration
  const data = useMemo(() => {
    const tableData = requests.map(request => {
      const businessOwner = '';
      const testDate = request.relevantTestDate?.date
        ? request.relevantTestDate?.date
        : null;
      const statusRecord = {
        status: accessibilityRequestStatusMap[`${request.statusRecord.status}`],
        createdAt: request.statusRecord.createdAt
          ? request.statusRecord.createdAt
          : null
      };

      return {
        id: request.id,
        requestName: request.name,
        submittedAt: request.submittedAt,
        businessOwner,
        relevantTestDate: testDate,
        statusRecord
      };
    });

    return tableData;
  }, [requests]);

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
      requests,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], []),
        pageIndex: 0
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  return (
    <div className="accessibility-requests-table">
      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('requestTable.id')}
        tableName={t('requestTable.title')}
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

      <Table bordered={false} scrollable {...getTableProps()} fullWidth>
        <caption className="usa-sr-only">{t('requestTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps({
                    style: {
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      position: 'relative'
                    }
                  })}
                  aria-sort={getColumnSortStatus(column)}
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
          {page.map(row => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th
                        {...cell.getCellProps({
                          style: {
                            width: cell.column.width,
                            minWidth: cell.column.minWidth,
                            maxWidth: cell.column.maxWidth
                          }
                        })}
                        scope="row"
                      >
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td
                      {...cell.getCellProps({
                        style: {
                          width: cell.column.width,
                          maxWidth: '16em'
                        }
                      })}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
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
      />
      <div
        className="usa-sr-only usa-table__announcement-region"
        aria-live="polite"
      >
        {currentTableSortDescription(headerGroups[0])}
      </div>
    </div>
  );
};

export default AccessibilityRequestsTable;
