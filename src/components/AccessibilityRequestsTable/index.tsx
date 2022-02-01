/* eslint-disable react/prop-types */

import React, { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortBy, useTable } from 'react-table';
import { Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
import { GetAccessibilityRequests_accessibilityRequests_edges_node as AccessibilityRequests } from 'queries/types/GetAccessibilityRequests';
import { accessibilityRequestStatusMap } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

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
            return formatDate(value);
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
        Cell: ({ value }: any) => {
          if (value) {
            return formatDate(value);
          }
          return t('requestTable.emptyTestDate');
        },
        minWidth: 180
      },
      {
        Header: t('requestTable.header.status'),
        accessor: 'statusRecord',
        Cell: ({ row, value }: any) => {
          // Status hasn't changed if the status record created at is the same
          // as the 508 request's submitted at
          if (row.original.submittedAt.toISO() === value.createdAt.toISO()) {
            return <span>{value.status}</span>;
          }

          return (
            <span>
              {value.status}{' '}
              <span className="text-base-dark font-body-3xs">{`changed on ${formatDate(
                value.createdAt
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
      const submittedAt = request.submittedAt
        ? DateTime.fromISO(request.submittedAt)
        : null;
      const businessOwner = `${request.system.businessOwner.name}, ${request.system.businessOwner.component}`;
      const testDate = request.relevantTestDate?.date
        ? DateTime.fromISO(request.relevantTestDate?.date)
        : null;
      const statusRecord = {
        status: accessibilityRequestStatusMap[`${request.statusRecord.status}`],
        createdAt: request.statusRecord.createdAt
          ? DateTime.fromISO(request.statusRecord.createdAt)
          : null
      };

      return {
        id: request.id,
        requestName: request.name,
        submittedAt,
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
    rows,
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
      requests,
      initialState: {
        sortBy: useMemo(() => [{ id: 'submittedAt', desc: true }], [])
      }
    },
    useSortBy
  );

  return (
    <div className="accessibility-requests-table">
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
                    <span className={getHeaderSortIcon(column)} />
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
                        style: { width: cell.column.width, maxWidth: '16em' }
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
