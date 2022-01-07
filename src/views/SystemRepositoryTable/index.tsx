/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Column,
  HeaderGroup,
  Row,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useQuery } from '@apollo/client';
import { CardGroup, Link as UswdsLink, Table } from '@trussworks/react-uswds';
import classnames from 'classnames';

import BookmarkCard from 'components/BookmarkCard';
import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import Spinner from 'components/Spinner';
import SystemHealthIcon from 'components/SystemHealthIcon';
import TablePagination from 'components/TablePagination';
import GetCedarSystemsQuery from 'queries/GetCedarSystemsQuery';
import {
  GetCedarSystems,
  GetCedarSystems_cedarSystems as CedarSystem
} from 'queries/types/GetCedarSystems';
import { mapCedarStatusToIcon } from 'types/iconStatus';
import {
  CedarSystemBookMark,
  mockBookmarkInfo
} from 'views/Sandbox/mockSystemData'; // TODO - replace mockSystemInfo/mockBookmarkInfo with dynamic data fetched from backend and CEDAR

const filterBookmarks = (
  systems: CedarSystem[],
  savedBookMarks: CedarSystemBookMark[]
) =>
  systems
    .filter(system =>
      savedBookMarks.some(bookmark => bookmark.cedarSystemId === system.id)
    )
    .map(system => (
      <BookmarkCard
        type="systemList"
        key={system.id}
        statusIcon={mapCedarStatusToIcon(system.status)}
        {...system}
      />
    ));

export const SystemRepositoryTable = () => {
  const { t } = useTranslation('systemProfile');

  const { loading, error, data } = useQuery<GetCedarSystems>(
    GetCedarSystemsQuery
  );

  const systemsTableData = data?.cedarSystems
    ? (data.cedarSystems as CedarSystem[])
    : ([] as CedarSystem[]);

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
      },
      {
        Header: t<string>('systemTable.header.systemStatus'),
        accessor: 'status',
        id: 'systemStatus',
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <div>
            <SystemHealthIcon
              status={mapCedarStatusToIcon(row.original.status)}
              size="medium"
              className="margin-right-1"
            />
            <span>{row.original.status}</span>
          </div>
        )
      }
    ];
  }, [t]); // TODO when system data is dynamically fetched, this dependency list may need to be changed

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
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
      data: systemsTableData as CedarSystem[],
      initialState: {
        sortBy: useMemo(() => [{ id: 'systemName', desc: false }], []),
        pageIndex: 0
      }
    },
    useSortBy,
    usePagination
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

  if (systemsTableData.length === 0) {
    return <p>{t('requestsTable.empty')}</p>;
  }

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
          {mockBookmarkInfo.length === 0 ? (
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
            <CardGroup>
              {filterBookmarks(systemsTableData, mockBookmarkInfo)}
            </CardGroup>
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
              {page.map(row => {
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
          {/* TEMPORARY PAGINATION START */}
          <TablePagination
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            canPreviousPage={canPreviousPage}
            pageCount={pageCount}
            pageSize={pageSize}
            setPageSize={setPageSize}
            page={[]}
          />
          {/* TEMPORARY PAGINATION END */}
        </>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemRepositoryTable;
