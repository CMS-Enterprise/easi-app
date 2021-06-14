/* eslint-disable react/prop-types */

import React, { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Link as UswdsLink, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';
import { GetAccessibilityRequests_accessibilityRequests_edges_node as AccessibilityRequests } from 'queries/types/GetAccessibilityRequests';

import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';

import './index.scss';
// import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';

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
            <UswdsLink asCustom={Link} to={`/508/requests/${row.original.id}`}>
              {value}
            </UswdsLink>
          );
        },
        maxWidth: 350
      },
      {
        Header: t('requestTable.header.submissionDate'),
        accessor: 'submittedAt',
        Cell: ({ value }: any) => {
          if (value) {
            return formatDate(value);
          }
          return '';
        }
      },
      {
        Header: t('requestTable.header.businessOwner'),
        accessor: 'businessOwner'
      },
      {
        Header: t('requestTable.header.testDate'),
        accessor: 'relevantTestDate',
        Cell: ({ value }: any) => {
          if (value) {
            return formatDate(value);
          }
          return t('requestTable.emptyTestDate');
        }
      },
      {
        Header: t('requestTable.header.status'),
        accessor: 'status',
        Cell: ({ value }: any) => {
          return value;
        }
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => {
    const tableData = requests.map(request => {
      const submittedAt = request.submittedAt
        ? DateTime.fromISO(request.submittedAt)
        : null;
      const businessOwner = `${request.system.businessOwner.name}, ${request.system.businessOwner.component}`;
      const testDate = request.relevantTestDate?.date
        ? DateTime.fromISO(request.relevantTestDate?.date)
        : null;
      const status =
        accessibilityRequestStatusMap[`${request.statusRecord.status}`];

      return {
        id: request.id,
        requestName: request.name,
        submittedAt,
        businessOwner,
        relevantTestDate: testDate,
        status
      };
    });

    return tableData;
  }, [requests]);

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
      requests,
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

  const tableColWidths = [350, 150, 260, 150, 260]; // [request name, submission date, business owner, test date, status]

  return (
    <div className="accessibility-requests-table">
      <Table bordered={false} {...getTableProps()} fullWidth>
        <caption className="usa-sr-only">{t('requestTable.caption')}</caption>
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
                        style={{ width: '350px', maxWidth: '16em' }}
                      >
                        {cell.render('Cell')}
                      </th>
                    );
                  }
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        width: `${tableColWidths[i]}px`,
                        maxWidth: '16em'
                      }}
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

export default AccessibilityRequestsTable;
