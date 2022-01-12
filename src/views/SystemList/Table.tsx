/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Column, Row, usePagination, useSortBy, useTable } from 'react-table';
import {
  Link as UswdsLink,
  Table as UswdsTable
} from '@trussworks/react-uswds';

import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import SystemHealthIcon from 'components/SystemHealthIcon';
import TablePagination from 'components/TablePagination';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices'; // May be temporary if we want to hard code all the CMS acronyms.  For now it creates an acronym for all capitalized words
import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';
import { mapCedarStatusToIcon } from 'types/iconStatus';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';
import { CedarSystemBookMark } from 'views/Sandbox/mockSystemData'; // TODO - replace mockSystemInfo/mockBookmarkInfo with dynamic data fetched from backend and CEDAR

import { findBookmark } from './bookmarkUtil';

import './index.scss';

type TableProps = {
  systems: CedarSystem[];
  savedBookmarks: CedarSystemBookMark[];
};

export const Table = ({ systems, savedBookmarks }: TableProps) => {
  const { t } = useTranslation('systemProfile');

  const columns = useMemo<Column<CedarSystem>[]>(() => {
    return [
      {
        Header: <BookmarkCardIcon size="sm" />,
        accessor: 'id',
        id: 'systemId',
        sortType: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          const rowTwoElem = rowTwo.values[columnName];

          return findBookmark(rowOneElem, savedBookmarks) >
            findBookmark(rowTwoElem, savedBookmarks)
            ? 1
            : -1;
        },
        Cell: ({ row }: { row: Row<CedarSystem> }) =>
          savedBookmarks.some(
            bookmark => bookmark.cedarSystemId === row.original.id
          ) ? (
            <BookmarkCardIcon size="sm" />
          ) : (
            <BookmarkCardIcon lightgrey size="sm" />
          )
      },
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
        id: 'systemOwner',
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <p>
            {cmsDivisionsAndOffices.find(
              item => item.name === row.original.businessOwnerOrg
            )?.acronym || row.original.businessOwnerOrg}
          </p>
        )
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
  }, [t, savedBookmarks]);

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
      data: systems as CedarSystem[],
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: {
        sortBy: useMemo(() => [{ id: 'systemName', desc: false }], []),
        pageIndex: 0
      }
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <span>
        Showing {pageIndex * pageSize + 1}-{(pageIndex + 1) * pageSize} of{' '}
        {systems.length} results
      </span>

      <UswdsTable bordered={false} fullWidth scrollable {...getTableProps()}>
        <caption className="usa-sr-only">{t('systemTable.caption')}</caption>

        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  style={{
                    minWidth: index === 0 ? '50px' : '150px',
                    padding: index === 0 ? '0' : 'auto',
                    paddingLeft: index === 0 ? '.5em' : 'auto'
                  }}
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {column.isSorted && (
                      <span
                        className={getHeaderSortIcon(
                          column.isSorted,
                          column.isSortedDesc
                        )}
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
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <th
                    style={{
                      paddingLeft: index === 0 ? '.5em' : 'auto'
                    }}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </th>
                ))}
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>

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
    </>
  );
};

export default Table;
