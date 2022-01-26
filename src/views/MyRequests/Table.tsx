import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortBy, useTable } from 'react-table';
import { useQuery } from '@apollo/client';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Spinner from 'components/Spinner';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests, GetRequestsVariables } from 'queries/types/GetRequests';
import { RequestType } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import mapRequestData from './tableUtil';

import './index.scss';

const Table = () => {
  const { t } = useTranslation(['home', 'intake', 'accessibility']);
  const { loading, error, data: tableData } = useQuery<
    GetRequests,
    GetRequestsVariables
  >(GetRequestsQuery, {
    variables: { first: 20 },
    fetchPolicy: 'cache-and-network'
  });

  const columns: any = useMemo(() => {
    return [
      {
        Header: t('requestsTable.headers.name'),
        accessor: 'name',
        Cell: ({ row, value }: any) => {
          let link: string;
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
          return <UswdsReactLink to={link}>{value}</UswdsReactLink>;
        },
        maxWidth: 350
      },
      {
        Header: t('requestsTable.headers.type'),
        accessor: 'type'
      },
      {
        Header: t('requestsTable.headers.submittedAt'),
        accessor: 'submittedAt'
      },
      {
        Header: t('requestsTable.headers.status'),
        accessor: 'status',
        Cell: ({ row, value }: any) => {
          switch (row.original.type) {
            case RequestType.ACCESSIBILITY_REQUEST:
              // Status hasn't changed if the status record created at is the same
              // as the 508 request's submitted at
              if (
                row.original.submittedAt.toISO() ===
                row.original.statusCreatedAt.toISO()
              ) {
                return <span>{value}</span>;
              }
              return (
                <span>
                  {value}
                  <span className="text-base-dark font-body-3xs">{`changed on ${formatDate(
                    row.original.statusCreatedAt
                  )}`}</span>
                </span>
              );
            case RequestType.GOVERNANCE_REQUEST:
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
        className: 'next-meeting-date',
        width: '180px'
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => {
    if (tableData) {
      return mapRequestData(tableData, t);
    }
    return [];
  }, [tableData, t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          const rowTwoElem = rowTwo.values[columnName];
          return sortColumnValues(rowOneElem, rowTwoElem);
        }
      },
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], []),
        pageIndex: 0
      }
    },
    useSortBy
  );

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
      <UswdsTable bordered={false} {...getTableProps()} fullWidth scrollable>
        <caption className="usa-sr-only">{t('requestsTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  aria-sort={getColumnSortStatus(column)}
                  style={{}}
                  scope="col"
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {column.isSorted && (
                      <span
                        className={getHeaderSortIcon(
                          column.isSorted,
                          column.isSortedDesc
                        )}
                      />
                    )}
                    {!column.isSorted && (
                      <span className="margin-left-1 fa fa-sort caret" />
                    )}
                  </button>
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
                {row.cells.map((cell, i) => {
                  if (i === 0) {
                    return (
                      <th {...cell.getCellProps()} scope="row">
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{ width: cell.column.width }}
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
