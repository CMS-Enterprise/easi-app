import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, HeaderGroup, useSortBy, useTable } from 'react-table';
import { Table } from '@trussworks/react-uswds';
import classnames from 'classnames';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
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
  const { t } = useTranslation('systemProfile');

  const columns: Array<Column<SystemSummary>> = useMemo(() => {
    return [
      {
        Header: t<string>('systemTable.header.systemName'),
        accessor: summary => `System ${summary.name}`,
        id: 'systemName'
      },
      {
        Header: t<string>('systemTable.header.systemOwner'),
        accessor: summary => `${summary.ownerName}, ${summary.ownerOffice}`,
        id: 'systemOwner'
      },
      {
        Header: t<string>('systemTable.header.productionStatus'),
        accessor: 'productionStatus'
      }
    ];
  }, [t]); // TODO when system data is dynamically fetched, this dependency list may need to be changed

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: useMemo(() => dummySystems, []),
      initialState: {
        sortBy: [{ id: 'systemName', desc: false }]
      }
    },
    useSortBy
  );

  // TODO - copied from src/components/RequestRepository/index.tsx. is this something we should generalize & reuse?
  const getColumnSortStatus = <T extends {}>(
    column: HeaderGroup<T>
  ): 'descending' | 'ascending' | 'none' => {
    if (column.isSorted) {
      if (column.isSortedDesc) {
        return 'descending';
      }
      return 'ascending';
    }

    return 'none';
  };

  // TODO - should we use this across the board for sortable tables, i.e. GRT requests, 508 requests?
  const getHeaderSortIcon = (
    isSorted: boolean,
    isSortedDesc: boolean | undefined
  ) => {
    const marginClassName = 'margin-left-1';
    if (!isSorted) {
      return classnames(marginClassName, 'fa fa-sort caret');
    }

    if (isSortedDesc) {
      return classnames(marginClassName, 'fa fa-caret-down');
    }

    return classnames(marginClassName, 'fa fa-caret-up');
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <>
          <SecondaryNav>
            <NavLink to="/system-profile">{t('tabs.systemProfile')}</NavLink>
          </SecondaryNav>
          <div className="grid-container">
            <Table bordered={false} fullWidth {...getTableProps()}>
              <caption className="usa-sr-only">
                {t('systemTable.caption')}
              </caption>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )} /* TODO scope */
                        aria-sort={getColumnSortStatus(column)}
                      >
                        {column.render('Header')}
                        <span
                          className={getHeaderSortIcon(
                            column.isSorted,
                            column.isSortedDesc
                          )}
                        />
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
          </div>
        </>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemRepositoryTable;
