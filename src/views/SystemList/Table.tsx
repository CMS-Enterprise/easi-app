/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';

import BookmarkCardIcon from 'components/BookmarkCard/BookmarkCardIcon';
import UswdsReactLink from 'components/LinkWrapper';
import SystemHealthIcon from 'components/SystemHealthIcon';
import GlobalClientFilter from 'components/TableFilter';
import TablePagination from 'components/TablePagination';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices'; // May be temporary if we want to hard code all the CMS acronyms.  For now it creates an acronym for all capitalized words
import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';
import { mapCedarStatusToIcon } from 'types/iconStatus';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';
import { CedarSystemBookMark } from 'views/Sandbox/mockSystemData'; // TODO - replace mockSystemInfo/mockBookmarkInfo with dynamic data fetched from backend and CEDAR

import { findBookmark } from './util';

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
        disableGlobalFilter: true,
        sortType: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          const rowTwoElem = rowTwo.values[columnName];

          return findBookmark(rowOneElem, savedBookmarks) >
            findBookmark(rowTwoElem, savedBookmarks)
            ? 1
            : -1;
        },
        Cell: ({ row }: { row: Row<CedarSystem> }) =>
          findBookmark(row.original.id, savedBookmarks) ? (
            <BookmarkCardIcon size="sm" />
          ) : (
            <BookmarkCardIcon color="lightgrey" size="sm" />
          )
      },
      {
        Header: t<string>('systemTable.header.systemAcronym'),
        accessor: 'acronym',
        disableGlobalFilter: true
      },
      {
        Header: t<string>('systemTable.header.systemName'),
        accessor: 'name',
        id: 'systemName',
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <UswdsReactLink to={`/sandbox/${row.original.id}`}>
            {row.original.name}
          </UswdsReactLink>
        )
      },
      {
        Header: t<string>('systemTable.header.systemOwner'),
        accessor: 'businessOwnerOrg',
        id: 'systemOwner',
        disableGlobalFilter: true,
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
        disableGlobalFilter: true,
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
    setGlobalFilter,
    state,
    rows,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      sortTypes: {
        alphanumeric: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName] || '';
          const rowTwoElem = rowTwo.values[columnName] || '';

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
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <GlobalClientFilter
        setGlobalFilter={setGlobalFilter}
        tableID={t('systemTable.id')}
        tableName={t('systemTable.title')}
        className="margin-bottom-5"
      />

      {/* TODO:  Break out page info into own component */}
      {state.globalFilter ? (
        <span>
          {rows.length === 0
            ? 'No results found.'
            : `Showing ${pageIndex * pageSize + 1}-${
                (pageIndex + 1) * pageSize
              } of
              ${rows.length} results`}
        </span>
      ) : (
        <span>
          {systems.length === 0
            ? 'No results found.'
            : `Showing ${pageIndex * pageSize + 1}-${
                (pageIndex + 1) * pageSize
              } of
              ${systems.length} results`}
        </span>
      )}

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
