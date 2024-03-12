/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useMutation } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  IconBookmark,
  Table as UswdsTable
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
// import SystemHealthIcon from 'components/SystemHealthIcon';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices'; // May be temporary if we want to hard code all the CMS acronyms.  For now it creates an acronym for all capitalized words
import CreateCedarSystemBookmarkQuery from 'queries/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'queries/DeleteCedarSystemBookmarkQuery';
// import { mapCedarStatusToIcon } from 'types/iconStatus';
import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';
import { GetCedarSystemsAndBookmarks_cedarSystemBookmarks as CedarSystemBookmark } from 'queries/types/GetCedarSystemsAndBookmarks';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import './index.scss';

type SystemTableType = 'allSystems' | 'mySystems' | 'bookmarkedSystems';

type TableProps = {
  systems: CedarSystem[];
  savedBookmarks: CedarSystemBookmark[];
  refetchBookmarks: () => any;
  defaultPageSize?: number;
};

export const Table = ({
  systems,
  savedBookmarks,
  refetchBookmarks,
  defaultPageSize = 10
}: TableProps) => {
  const { t } = useTranslation('systemProfile');

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const tableType = params.get('table-type') as SystemTableType;

  const [systemTableType, setSystemTableType] = useState<SystemTableType>(
    tableType || 'allSystems'
  );

  const [createMutate] = useMutation(CreateCedarSystemBookmarkQuery);
  const [deleteMutate] = useMutation(DeleteCedarSystemBookmarkQuery);

  const filteredSystems = useMemo(() => {
    switch (systemTableType) {
      case 'allSystems':
        return systems;
      case 'mySystems':
        return systems; // TODO: return myCedarSystems
      case 'bookmarkedSystems':
        return systems.filter(system =>
          savedBookmarks.find(bookmark => bookmark.cedarSystemId === system.id)
        );
      default:
        return systems;
    }
  }, [systemTableType, systems, savedBookmarks]);

  const columns = useMemo<Column<CedarSystem>[]>(() => {
    const handleCreateBookmark = (cedarSystemId: string) => {
      createMutate({
        variables: {
          input: {
            cedarSystemId
          }
        }
      }).then(refetchBookmarks);
    };

    const handleDeleteBookmark = (cedarSystemId: string) => {
      deleteMutate({
        variables: {
          input: {
            cedarSystemId
          }
        }
      }).then(refetchBookmarks);
    };

    const bookmarkIdSet: Set<string> = new Set(
      savedBookmarks.map(bm => bm.cedarSystemId)
    );

    return [
      {
        Header: <IconBookmark />,
        accessor: 'id',
        id: 'systemId',
        disableGlobalFilter: true,
        sortType: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          return bookmarkIdSet.has(rowOneElem) ? 1 : -1;
        },
        Cell: ({ row }: { row: Row<CedarSystem> }) =>
          bookmarkIdSet.has(row.original.id) ? (
            <Button
              onClick={() => handleDeleteBookmark(row.original.id)}
              type="button"
              unstyled
            >
              <IconBookmark />
            </Button>
          ) : (
            <Button
              onClick={() => handleCreateBookmark(row.original.id)}
              type="button"
              unstyled
            >
              <IconBookmark className="bookmarkIcon--lightgrey" />
            </Button>
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
          <UswdsReactLink to={`/systems/${row.original.id}/home/top`}>
            {row.original.name}
          </UswdsReactLink>
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
      }
      /*
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
      */
    ];
  }, [t, savedBookmarks, createMutate, deleteMutate, refetchBookmarks]);

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
          return sortColumnValues(
            rowOne.values[columnName],
            rowTwo.values[columnName]
          );
        }
      },
      columns,
      data: filteredSystems as CedarSystem[],
      globalFilter: useMemo(() => globalFilterCellText, []),
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'systemName', desc: false }], []),
        pageIndex: 0,
        pageSize: defaultPageSize
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  return (
    <>
      <p className="text-bold margin-0 margin-top-3">{t('systemTable.view')}</p>

      <ButtonGroup type="segmented" className="margin-y-2">
        <Button
          type="button"
          outline={systemTableType !== 'allSystems'}
          onClick={() => setSystemTableType('allSystems')}
        >
          {t('systemTable.buttonGroup.allSystems')}
        </Button>
        <Button
          type="button"
          outline={systemTableType !== 'mySystems'}
          onClick={() => setSystemTableType('mySystems')}
        >
          {t('systemTable.buttonGroup.mySystems')}
        </Button>
        <Button
          type="button"
          outline={systemTableType !== 'bookmarkedSystems'}
          onClick={() => setSystemTableType('bookmarkedSystems')}
        >
          {t('systemTable.buttonGroup.bookmarkedSystems')}
        </Button>
      </ButtonGroup>

      {systems.length > state.pageSize && (
        <>
          <GlobalClientFilter
            setGlobalFilter={setGlobalFilter}
            tableID={t('systemTable.id')}
            tableName={t('systemTable.title')}
            className="margin-bottom-4 width-mobile-lg maxw-none"
          />

          <TableResults
            globalFilter={state.globalFilter}
            pageIndex={pageIndex}
            pageSize={pageSize}
            filteredRowLength={rows.length}
            rowLength={systems.length}
            className="margin-bottom-4"
          />
        </>
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
                    paddingLeft: index === 0 ? '.5em' : 'auto',
                    position: 'relative'
                  }}
                >
                  <button
                    className="usa-button usa-button--unstyled"
                    type="button"
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column)}
                  </button>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map(row => {
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

      <div className="grid-row grid-gap grid-gap-lg">
        {systems.length > state.pageSize && (
          <TablePagination
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
            pageIndex={state.pageIndex}
            pageOptions={pageOptions}
            canPreviousPage={canPreviousPage}
            pageCount={pageCount}
            pageSize={state.pageSize}
            setPageSize={setPageSize}
            page={[]}
            className="desktop:grid-col-fill"
          />
        )}
        <TablePageSize
          className="desktop:grid-col-auto"
          pageSize={state.pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </>
  );
};

export default Table;
