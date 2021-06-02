import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { useQuery } from '@apollo/client';
import {
  Link as UswdsLink,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';
import GetRequestsQuery from 'queries/GetRequestsQuery';
import { GetRequests, GetRequestsVariables } from 'queries/types/GetRequests';

import { RequestType } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';

const Table = () => {
  const { t } = useTranslation('home');
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
            case RequestType.ACCESSIBILITY_REQUEST:
              link = `/508/requests/${row.original.id}`;
              break;
            case RequestType.GOVERNANCE_REQUEST:
              link = `/governance-task-list/${row.original.id}`;
              break;
            default:
              link = '/';
          }
          return (
            <UswdsLink asCustom={Link} to={link}>
              {value || t('requestsTable.defaultName')}
            </UswdsLink>
          );
        },
        maxWidth: 350
      },
      {
        Header: t('requestsTable.headers.type'),
        accessor: 'type',
        Cell: ({ value }: any) => {
          return t(`requestsTable.types.${value}`);
        }
      },
      {
        Header: t('requestsTable.headers.submittedAt'),
        accessor: 'submittedAt',
        Cell: ({ value }: any) => {
          if (value) {
            return formatDate(value);
          }
          return t('requestsTable.defaultSubmittedAt');
        }
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => {
    const requests =
      tableData &&
      tableData.requests &&
      tableData.requests.edges.map(edge => {
        return edge.node;
      });

    const mappedData = requests?.map(request => {
      const submittedAt = request.submittedAt
        ? DateTime.fromISO(request.submittedAt)
        : null;
      return { ...request, submittedAt };
    });

    return mappedData || [];
  }, [tableData]);

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

          // If item is a string, enforce capitalization (temporarily) and then compare
          if (typeof rowOneElem === 'string') {
            return rowOneElem.toUpperCase() > rowTwoElem.toUpperCase() ? 1 : -1;
          }

          // If item is a DateTime, convert to Number and compare
          if (rowOneElem instanceof DateTime) {
            return Number(rowOneElem) > Number(rowTwoElem) ? 1 : -1;
          }

          // If neither string nor DateTime, return bare comparison
          return rowOneElem > rowTwoElem ? 1 : -1;
        }
      },
      initialState: {
        sortBy: [{ id: 'submittedAt', desc: true }]
      }
    },
    useSortBy
  );

  const getHeaderSortIcon = (isDesc: boolean | undefined) => {
    return classnames('margin-left-1', {
      'fa fa-caret-down fa-lg caret': isDesc,
      'fa fa-caret-up fa-lg caret': !isDesc
    });
  };

  const getColumnSortStatus = (
    column: any
  ): 'descending' | 'ascending' | 'none' => {
    if (column.isSorted) {
      if (column.isSortedDesc) {
        return 'descending';
      }
      return 'ascending';
    }

    return 'none';
  };

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (data.length === 0) {
    return <p>{t('requestsTable.empty')}</p>;
  }

  return (
    <div className="accessibility-requests-table">
      <UswdsTable bordered={false} {...getTableProps()} fullWidth>
        <caption className="usa-sr-only">{t('requestsTable.caption')}</caption>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  aria-sort={getColumnSortStatus(column)}
                  style={{ whiteSpace: 'nowrap' }}
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
                        className={getHeaderSortIcon(column.isSortedDesc)}
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
                      <th
                        {...cell.getCellProps()}
                        scope="row"
                        style={{ maxWidth: '16rem' }}
                      >
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td {...cell.getCellProps()} style={{ maxWidth: '16rem' }}>
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

const currentTableSortDescription = headerGroup => {
  const sortedHeader = headerGroup.headers.find(header => header.isSorted);

  if (sortedHeader) {
    const direction = sortedHeader.isSortedDesc ? 'descending' : 'ascending';
    return `Requests table sorted by ${sortedHeader.Header} ${direction}`;
  }
  return 'Requests table reset to default sort order';
};

export default Table;
