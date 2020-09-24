import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTable } from 'react-table';
import { Table } from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';

const AllRequests = () => {
  const { t } = useTranslation('governanceReviewTeam');
  const columns: any = useMemo(
    () => [
      {
        Header: t('intake:fields.submissionDate'),
        accessor: 'submittedAt',
        Cell: ({ value }: any) => {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATE_FULL);
        }
      },
      {
        Header: t('intake:fields.requestName'),
        accessor: 'requestName',
        Cell: ({ row, value }: any) => {
          return (
            <Link to={`/governance-review-team/${row.original.id}`}>
              {value}
            </Link>
          );
        }
      },
      {
        Header: t('intake:fields.component'),
        accessor: 'requester.component'
      },
      { Header: t('allRequests.table.requestType'), accessor: 'type' }
    ],
    [t]
  );

  // Mock Data
  // EASI-789 will create an endpoint for getting all intake requests for GRT
  const data = useMemo(
    () => [
      {
        id: 'addaa218-34d3-4dd8-a12f-38f6ff33b22d',
        submittedAt: new Date().toISOString(),
        requestName: 'Easy Access to System Information',
        requester: {
          name: 'Christopher Hui',
          component: 'Division of Pop Corners'
        },
        status: 'Submitted',
        type: 'Decomission a system'
      },
      {
        id: '229f9b64-18fc-4ee1-95c4-9d4b143d215c',
        submittedAt: new Date().toISOString(),
        requestName: 'Hard Access to System Information',
        requester: {
          name: 'George Baukerton',
          component: 'Office of Information Technology'
        },
        status: 'Submitted',
        type: 'Re-compete'
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container">
        <Table bordered={false} {...getTableProps()} fullWidth>
          <caption className="usa-sr-only">
            {t('allRequests.aria.openRequestsTable')}
          </caption>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
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
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default AllRequests;
