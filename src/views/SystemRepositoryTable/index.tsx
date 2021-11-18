import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { Table } from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { CMSOfficeAcronym } from 'constants/enums/cmsDivisionsAndOffices';

interface SystemSummary {
  name: string;
  ownerName: string;
  ownerOffice: CMSOfficeAcronym;
  productionStatus: 'GOOD' | 'WARNING' | 'ERROR'; // TODO - replace with enum, put in src/types or src/constants/enums
}

// TODO - replace with dynamic data fetched from backend
const dummySystems: SystemSummary[] = [
  {
    name: 'ABC123',
    ownerName: 'Jane Doe',
    ownerOffice: 'CMMI',
    productionStatus: 'GOOD'
  },
  {
    name: 'XYZ789',
    ownerName: 'John Doe',
    ownerOffice: 'OIT',
    productionStatus: 'ERROR'
  },
  {
    name: '8675309',
    ownerName: 'Jennifer Doe',
    ownerOffice: 'CCIIO',
    productionStatus: 'WARNING'
  }
];

export const SystemRepositoryTable = () => {
  const columns: Array<Column<SystemSummary>> = useMemo(() => {
    return [
      {
        Header: 'System Name', // TODO i18n
        accessor: summary => `System ${summary.name}`,
        id: 'systemName'
      },
      {
        Header: 'System Owner', // TODO i18n
        accessor: summary => `${summary.ownerName}, ${summary.ownerOffice}`,
        id: 'systemOwner'
      },
      {
        Header: 'Production Status', // TODO i18n
        accessor: 'productionStatus'
      }
    ];
  }, []); // TODO when system data is dynamically fetched, this dependency list may need to be changed

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data: useMemo(() => dummySystems, [])
  });

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Table bordered={false} fullWidth {...getTableProps()}>
          {/* TODO <caption> */}
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} /* TODO aria-sort, scope */>
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
                  {row.cells.map(cell => (
                    <th {...cell.getCellProps()}>{cell.render('Cell')}</th>
                  ))}
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

export default SystemRepositoryTable;
