/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Column, HeaderGroup, Row, useSortBy, useTable } from 'react-table';
import { useQuery } from '@apollo/client';
import { Link as UswdsLink, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import {
  GetCedarSystems,
  GetCedarSystems_cedarSystems as CedarSystem
} from 'queries/types/GetCedarSystems';

// TODO - if we want to keep this text past the prototype state, it needs to use translation
// const mapStatusToDescription = (status: IconStatus): string => {
//   switch (status) {
//     case 'success':
//       return 'Fully operational';
//     case 'warning':
//       return 'Degraded functionality';
//     case 'fail':
//     default:
//       return 'Inoperative';
//   }
// };

export const SystemRepositoryTable = () => {
  const { t } = useTranslation('systemProfile');

  const { data: result } = useQuery<GetCedarSystems>(GetCedarSystemsQuery);

  let data;
  if (!result) {
    data = {
      cedarSystems: []
    } as GetCedarSystems;
  } else {
    data = result;
  }

  const columns = useMemo<Column<CedarSystem>[]>(() => {
    return [
      {
        Header: t<string>('systemTable.header.systemAcronym'),
        accessor: 'acronym'
      },
      {
        Header: t<string>('systemTable.header.systemName'),
        accessor: 'name',
        id: 'systemName',
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <UswdsLink asCustom={Link} to={`/sandbox/${row.original.id}`}>
            {row.original.name}
          </UswdsLink>
        )
      },
      {
        Header: t<string>('systemTable.header.systemOwner'),
        accessor: 'businessOwnerOrg',
        id: 'systemOwner'
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
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          const rowTwoElem = rowTwo.values[columnName];

          return rowOneElem.toUpperCase() > rowTwoElem.toUpperCase() ? 1 : -1;
        }
      },
      columns,
      data: data?.cedarSystems as CedarSystem[],
      initialState: {
        sortBy: useMemo(() => [{ id: 'systemName', desc: false }], [])
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
                        )}
                        aria-sort={getColumnSortStatus(column)}
                        scope="col"
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
