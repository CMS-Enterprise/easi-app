/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Column, HeaderGroup, Row, useSortBy, useTable } from 'react-table';
import { Link as UswdsLink, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';

import BookmarkCard from 'components/BookmarkCard';
import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import BookmarkCardWrapper from 'components/BookmarkCard/BookmarkCardWrapper';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import SystemHealthIcon from 'components/SystemHealthIcon';
import { sortByStatus } from 'types/iconStatus';
import {
  mockBookmarkInfo,
  mockSystemInfo,
  SystemInfo
} from 'views/Sandbox/mockSystemData'; // TODO - replace mockSystemInfo/mockBookmarkInfo with dynamic data fetched from backend and CEDAR

export const SystemRepositoryTable = () => {
  const { t } = useTranslation('systemProfile');

  const sortRowsByStatus = useMemo(
    () => (rowA: Row<SystemInfo>, rowB: Row<SystemInfo>) =>
      sortByStatus(
        rowA.original.productionStatus,
        rowB.original.productionStatus
      ),
    []
  );

  const columns = useMemo<Column<SystemInfo>[]>(() => {
    return [
      {
        Header: t<string>('systemTable.header.systemName'),
        accessor: (systemInfo: SystemInfo) => `System ${systemInfo.name}`,
        id: 'systemName',
        Cell: ({ row }: { row: Row<SystemInfo> }) => (
          <UswdsLink asCustom={Link} to={`/sandbox/${row.original.id}`}>
            {row.original.name}
          </UswdsLink>
        )
      },
      {
        Header: t<string>('systemTable.header.systemOwner'),
        accessor: (systemInfo: SystemInfo) =>
          `${systemInfo.ownerName}, ${systemInfo.ownerOffice}`,
        id: 'systemOwner'
      },
      {
        Header: t<string>('systemTable.header.productionStatus'),
        accessor: 'productionStatus',
        Cell: ({ row }: { row: Row<SystemInfo> }) => (
          <SystemHealthIcon
            status={row.original.productionStatus}
            size="medium"
            label={t(`systemList:status.${row.original.productionStatus}`)}
          />
        ),
        sortType: sortRowsByStatus
      }
    ];
  }, [t, sortRowsByStatus]); // TODO when system data is dynamically fetched, this dependency list may need to be changed

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data: useMemo(() => mockSystemInfo, []),
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
      <MainContent className="grid-container margin-bottom-5">
        <>
          <PageHeading>{t('systemList:heading')}</PageHeading>
          <Divider />
          <PageHeading className="margin-bottom-0">
            {t('systemList:bookmark.heading')}
          </PageHeading>
          <p className="margin-bottom-3">{t('systemList:bookmark.subtitle')}</p>

          {/* TEMPORARY mockSystemInfo/mockBookmarkInfo data until we get live data from CEDAR as well as backend storage per EASi-1470 */}
          {!mockBookmarkInfo ||
          mockBookmarkInfo.length === 0 ||
          !mockSystemInfo ||
          mockSystemInfo.length === 0 ? (
            <div className="tablet:grid-col-12">
              <Alert type="info" className="padding-1">
                <h3 className="margin-0">
                  {t('systemList:noBookmark.heading')}
                </h3>
                <div>
                  <span className="margin-0">
                    {t('systemList:noBookmark.text1')}
                  </span>
                  <BookmarkCardIcon size="sm" black />
                  <span className="margin-0">
                    {t('systemList:noBookmark.text2')}
                  </span>
                </div>
              </Alert>
            </div>
          ) : (
            <BookmarkCardWrapper>
              {mockSystemInfo.map(
                mock =>
                  mockBookmarkInfo.some(
                    bookmark => bookmark.cedarSystemId === mock.id
                  ) && <BookmarkCard type="systemList" {...mock} />
              )}
            </BookmarkCardWrapper>
          )}
          {/* TEMPORARY */}

          <Table bordered={false} fullWidth {...getTableProps()}>
            <caption className="usa-sr-only">
              {t('systemTable.caption')}
            </caption>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
        </>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemRepositoryTable;
