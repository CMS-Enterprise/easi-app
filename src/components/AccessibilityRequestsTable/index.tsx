/* eslint-disable react/prop-types */

import React, { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import { Link as UswdsLink, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { DateTime } from 'luxon';

// import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';

type AccessibilityRequestsTableRow = {
  id: string;
  name: string;
  submittedAt?: DateTime;
  businessOwner?: {
    name?: string;
    component?: string;
  };
  testDate?: DateTime;
  status?: string;
  lastUpdatedAt?: DateTime;
};

type AccessibilityRequestsTableProps = {
  requests: AccessibilityRequestsTableRow[];
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
            <UswdsLink
              asCustom={Link}
              to={`/some-508-request/${row.original.id}`}
            >
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
            return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
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
        accessor: 'testedAt',
        Cell: ({ value }: any) => {
          if (value) {
            return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
          }
          return '';
        }
      },
      {
        Header: t('requestTable.header.status'),
        accessor: 'status',
        Cell: ({ row, value }: any) => {
          const date = DateTime.fromISO(row.original.updatedAt).toLocaleString(
            DateTime.DATE_FULL
          );
          return (
            <>
              <strong>{value}</strong>
              <br />
              <span>{`${t('requestTable.lastUpdated')} ${date}`}</span>
            </>
          );
        }
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const data = useMemo(() => {
  //   // TODO: Request status text needs to be mapped from backend enum
  //   const mockData = [
  //     {
  //       id: '1',
  //       requestName: '(USDS) Dashboard for USDS 1.7',
  //       submittedAt: '2021-01-11T00:00:00.000-07:00',
  //       updatedAt: '2021-01-11T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Ada Sanchez',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '',
  //       status: 'Request Received'
  //     },
  //     {
  //       id: '2',
  //       requestName: 'OSORA FOIA Portal Project 3.0',
  //       submittedAt: '2021-01-09T00:00:00.000-07:00',
  //       updatedAt: '2021-01-09T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Amanda Johnson',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '',
  //       status: 'Request Received'
  //     },
  //     {
  //       id: '3',
  //       requestName: 'TACO 1.3',
  //       submittedAt: '2021-01-05T00:00:00.000-07:00',
  //       updatedAt: '2021-01-05T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Shane Clark',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '',
  //       status: 'Documents Received'
  //     },
  //     {
  //       id: '4',
  //       requestName: 'Impact Analysis Network',
  //       submittedAt: '2020-12-28T00:00:00.000-07:00',
  //       updatedAt: '2020-12-28T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Marny Land',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '',
  //       status: 'Reuqest Received'
  //     },
  //     {
  //       id: '5',
  //       requestName: 'Clinical Standards and Quality Migration 1.3',
  //       submittedAt: '2020-12-27T00:00:00.000-07:00',
  //       updatedAt: '2020-12-27T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Paul Shatto',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '',
  //       status: 'Documents Received'
  //     },
  //     {
  //       id: '6',
  //       requestName: 'Medicare Payments Processing 2.0',
  //       submittedAt: '2020-12-20T00:00:00.000-07:00',
  //       updatedAt: '2020-12-20T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Wanda McIver',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '2021-01-19T00:00:00.000-07:00',
  //       status: 'Test Scheduled'
  //     },
  //     {
  //       id: '7',
  //       requestName: 'Medical Redesign',
  //       submittedAt: '2020-12-19T00:00:00.000-07:00',
  //       updatedAt: '2020-12-19T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Aaron Heffler',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '2021-01-19T00:00:00.000-07:00',
  //       status: 'Test Scheduled'
  //     },
  //     {
  //       id: '8',
  //       requestName: 'Migration Pipeline 2.0',
  //       submittedAt: '2020-12-15T00:00:00.000-07:00',
  //       updatedAt: '2020-12-15T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Connie Leonard',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '2021-01-07T00:00:00.000-07:00',
  //       status: 'Test Scheduled'
  //     },
  //     {
  //       id: '9',
  //       requestName:
  //         'Consumer Information and Insurance Oversight Pilot Program 1.0',
  //       submittedAt: '2020-11-29T00:00:00.000-07:00',
  //       updatedAt: '2020-11-29T00:00:00.000-07:00',
  //       businessOwner: {
  //         name: 'Blake Limmer',
  //         component: 'Office of Information Technology'
  //       },
  //       testedAt: '2020-11-19T00:00:00.000-07:00',
  //       status: 'Test Scheduled'
  //     }
  //   ];

  //   return mockData.map(request => {
  //     const { businessOwner } = request;

  //     const component = cmsDivisionsAndOffices.find(
  //       c => c.name === businessOwner.component
  //     );

  //     const businessOwnerWithComponent = component
  //       ? `${businessOwner.name}, ${component.acronym}`
  //       : businessOwner.name;

  //     // TODO Translate Status from backend enum to human readable
  //     return {
  //       ...request,
  //       businessOwner: businessOwnerWithComponent
  //     };
  //   });
  // }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
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
      'fa fa-caret-down': isDesc,
      'fa fa-caret-up': !isDesc
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

  return (
    <Table bordered={false} {...getTableProps()} fullWidth>
      <caption className="usa-sr-only">{t('requestTable.caption')}</caption>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                aria-sort={getColumnSortStatus(column)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {column.render('Header')}
                {column.isSorted && (
                  <span className={getHeaderSortIcon(column.isSortedDesc)} />
                )}
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
    </Table>
  );
};

export default AccessibilityRequestsTable;
