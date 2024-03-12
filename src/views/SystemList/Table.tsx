/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  ButtonGroup,
  IconArrowForward,
  IconBookmark,
  Table as UswdsTable
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
// import SystemHealthIcon from 'components/SystemHealthIcon';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices'; // May be temporary if we want to hard code all the CMS acronyms.  For now it creates an acronym for all capitalized words
import CreateCedarSystemBookmarkQuery from 'queries/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'queries/DeleteCedarSystemBookmarkQuery';
import GetMyCedarSystemsQuery from 'queries/GetMyCedarSystemsQuery';
// import { mapCedarStatusToIcon } from 'types/iconStatus';
import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';
import { GetCedarSystemsAndBookmarks_cedarSystemBookmarks as CedarSystemBookmark } from 'queries/types/GetCedarSystemsAndBookmarks';
import { GetMyCedarSystems as GetMyCedarSystemsType } from 'queries/types/GetMyCedarSystems';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import './index.scss';

type SystemTableType = 'all-systems' | 'my-systems' | 'bookmarked-systems';

type TableProps = {
  systems?: CedarSystem[];
  savedBookmarks?: CedarSystemBookmark[];
  refetchBookmarks?: () => any;
  defaultPageSize?: number;
  isMySystems?: boolean;
};

export const Table = ({
  systems = [],
  savedBookmarks = [],
  refetchBookmarks = () => null,
  defaultPageSize = 10,
  isMySystems
}: TableProps) => {
  const { t } = useTranslation('systemProfile');

  const location = useLocation();
  const history = useHistory();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  const tableType = params.get('table-type') as SystemTableType;

  const [systemTableType, setSystemTableType] = useState<SystemTableType>(
    tableType || 'all-systems'
  );

  const { loading, data: mySystems } = useQuery<GetMyCedarSystemsType>(
    GetMyCedarSystemsQuery
  );

  const [createMutate] = useMutation(CreateCedarSystemBookmarkQuery);
  const [deleteMutate] = useMutation(DeleteCedarSystemBookmarkQuery);

  // Sets the systemTableType state to the query param, defaults to all-systems if no param present
  // If the query param changes, update the component state
  useEffect(() => {
    if (!tableType && !isMySystems) {
      history.replace({
        search: 'table-type=all-systems'
      });
    }

    if (isMySystems) {
      setSystemTableType('my-systems');
    } else {
      setSystemTableType(tableType);
    }
  }, [tableType, isMySystems, history]);

  // On button group toggle, change query param
  const switchTableType = (type: SystemTableType) => {
    params.delete('table-type');
    history.replace({
      search: `table-type=${type}`
    });
  };

  const filteredSystems = useMemo(() => {
    switch (systemTableType) {
      case 'all-systems':
        return systems;
      case 'my-systems':
        return mySystems?.myCedarSystems || [];
      case 'bookmarked-systems':
        return systems.filter(system =>
          savedBookmarks.find(bookmark => bookmark.cedarSystemId === system.id)
        );
      default:
        return systems;
    }
  }, [systemTableType, systems, savedBookmarks, mySystems]);

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

  // Remove bookmark column if showing My systems table
  if (isMySystems) {
    columns.splice(0, 1);
  }

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

  if (
    (isMySystems || tableType === 'my-systems') &&
    loading &&
    filteredSystems.length === 0
  ) {
    return <PageLoading />;
  }

  return (
    <div className="margin-bottom-6">
      {!isMySystems && (
        <>
          <p className="text-bold margin-0 margin-top-3">
            {t('systemTable.view')}
          </p>

          <ButtonGroup type="segmented" className="margin-y-2">
            <Button
              type="button"
              outline={systemTableType !== 'all-systems'}
              onClick={() => switchTableType('all-systems')}
            >
              {t('systemTable.buttonGroup.allSystems')}
            </Button>
            <Button
              type="button"
              outline={systemTableType !== 'my-systems'}
              onClick={() => switchTableType('my-systems')}
            >
              {t('systemTable.buttonGroup.mySystems')}
            </Button>
            <Button
              type="button"
              outline={systemTableType !== 'bookmarked-systems'}
              onClick={() => switchTableType('bookmarked-systems')}
            >
              {t('systemTable.buttonGroup.bookmarkedSystems')}
            </Button>
          </ButtonGroup>
        </>
      )}

      {filteredSystems.length > state.pageSize && (
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

      {filteredSystems.length > 0 && (
        <div className="grid-row grid-gap grid-gap-lg">
          {filteredSystems.length > state.pageSize && (
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
          {filteredSystems.length > 5 && (
            <TablePageSize
              className="desktop:grid-col-auto"
              pageSize={state.pageSize}
              setPageSize={setPageSize}
            />
          )}
        </div>
      )}

      {/* Alerts to show if there is no system/data */}
      {filteredSystems.length === 0 &&
        (tableType === 'my-systems' || isMySystems) && (
          <Alert
            type="info"
            heading={t('systemTable.noMySystem.header')}
            className="margin-top-5"
          >
            {isMySystems ? (
              <Trans
                i18nKey="systemProfile:systemTable.noMySystem.description"
                components={{
                  link1: (
                    // @ts-ignore
                    <Link href="EnterpriseArchitecture@cms.hhs.gov" />
                  ),
                  link2: (
                    // @ts-ignore
                    <UswdsReactLink to="/systems" />
                  ),
                  iconForward: (
                    <IconArrowForward className="icon-top margin-left-05" />
                  )
                }}
              />
            ) : (
              <Trans
                i18nKey="systemProfile:systemTable.noMySystem.descriptionAlt"
                components={{
                  link1: (
                    // @ts-ignore
                    <Link href="EnterpriseArchitecture@cms.hhs.gov" />
                  )
                }}
              />
            )}
          </Alert>
        )}

      {/* Alery to show to direct to Systems tab when viewing My sytems */}
      {filteredSystems.length > 0 && isMySystems && (
        <Alert
          type="info"
          heading={t('systemProfile:systemTable:dontSeeSystem.header')}
        >
          <Trans
            i18nKey="systemProfile:systemTable:dontSeeSystem.description"
            components={{
              link1: (
                // @ts-ignore
                <UswdsReactLink to="/systems" />
              ),
              iconForward: (
                <IconArrowForward className="icon-top margin-left-05" />
              )
            }}
          />
        </Alert>
      )}
    </div>
  );
};

export default Table;
