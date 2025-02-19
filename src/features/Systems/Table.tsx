/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  CellProps,
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
  Icon,
  Link,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import CreateCedarSystemBookmarkQuery from 'gql/legacyGQL/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'gql/legacyGQL/DeleteCedarSystemBookmarkQuery';
import GetCedarSystemIsBookmarkedQuery from 'gql/legacyGQL/GetCedarSystemIsBookmarkedQuery';
import GetMyCedarSystemsQuery from 'gql/legacyGQL/GetMyCedarSystemsQuery';
import { GetCedarSystems_cedarSystems as CedarSystem } from 'gql/legacyGQL/types/GetCedarSystems';
import { GetMyCedarSystems as GetMyCedarSystemsType } from 'gql/legacyGQL/types/GetMyCedarSystems';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import { AtoStatusIconText } from 'components/AtoStatus';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices'; // May be temporary if we want to hard code all the CMS acronyms.  For now it creates an acronym for all capitalized words
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import './index.scss';

export type SystemTableType =
  | 'all-systems'
  | 'my-systems'
  | 'bookmarked-systems';

type TableProps = {
  systems?: CedarSystem[];
  defaultPageSize?: number;
  isHomePage?: boolean;
};

export const Table = ({
  systems = [],
  defaultPageSize = 10,
  isHomePage
}: TableProps) => {
  const flags = useFlags();
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
    if (!tableType && !isHomePage) {
      history.replace({
        search: 'table-type=all-systems'
      });
    }

    setSystemTableType(isHomePage ? 'my-systems' : tableType);
  }, [tableType, isHomePage, history]);

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
        return systems.filter(system => system.isBookmarked);
      default:
        return systems;
    }
  }, [systemTableType, systems, mySystems]);

  const columns: Column<CedarSystem>[] = useMemo(() => {
    const isBookmarked = (cedarSystemId: string): boolean =>
      !!systems.find(system => system.id === cedarSystemId)?.isBookmarked;

    /** Create or delete bookmark */
    const toggleBookmark = (cedarSystemId: string) => {
      const mutate = isBookmarked(cedarSystemId) ? deleteMutate : createMutate;

      mutate({
        variables: {
          input: {
            cedarSystemId
          }
        },
        refetchQueries: [
          {
            query: GetCedarSystemIsBookmarkedQuery,
            variables: { id: cedarSystemId }
          }
        ]
      });
    };

    const cols: Column<CedarSystem>[] = [];

    if (!isHomePage) {
      cols.push({
        Header: <Icon.Bookmark />,
        accessor: 'id',
        id: 'systemId',
        disableGlobalFilter: true,
        sortType: (rowOne, rowTwo, columnName) => {
          const rowOneElem = rowOne.values[columnName];
          return isBookmarked(rowOneElem) ? 1 : -1;
        },
        Cell: ({ row }: { row: Row<CedarSystem> }) => (
          <Button
            onClick={() => toggleBookmark(row.original.id)}
            type="button"
            unstyled
          >
            <Icon.Bookmark
              className={classNames({
                'text-base-lighter': !isBookmarked(row.original.id)
              })}
            />
          </Button>
        )
      });
    }

    cols.push({
      Header: t<string>('systemTable.header.systemAcronym'),
      accessor: 'acronym'
    });

    cols.push({
      Header: t<string>('systemTable.header.systemName'),
      accessor: 'name',
      id: 'systemName',
      Cell: ({ row }: { row: Row<CedarSystem> }) => {
        const url = `/systems/${row.original.id}/${
          systemTableType === 'my-systems' ? 'workspace' : 'home/top'
        }`;
        return <UswdsReactLink to={url}>{row.original.name}</UswdsReactLink>;
      }
    });

    if (!isHomePage) {
      cols.push({
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
      });
    }

    if (flags.showAtoColumn) {
      cols.push({
        Header: t<string>('systemTable.header.systemStatus'),
        accessor: 'atoExpirationDate',
        Cell: ({
          value
        }: CellProps<CedarSystem, CedarSystem['atoExpirationDate']>) => (
          <AtoStatusIconText dt={value} />
        ),
        sortType: (a, b) =>
          (a.values.atoExpirationDate ?? '') >
          (b.values.atoExpirationDate ?? '')
            ? 1
            : -1
      });
    }

    if (isHomePage) {
      cols.push({
        Header: t<string>('systemTable.header.openRequests'),
        accessor: (system: CedarSystem) => {
          return (
            system.linkedTrbRequests.length + system.linkedSystemIntakes.length
          );
        },
        id: 'openRequests'
      });
    }

    return cols;
  }, [
    t,
    systems,
    systemTableType,
    createMutate,
    deleteMutate,
    isHomePage,
    flags.showAtoColumn
  ]);

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
      globalFilter: (filterRows, ids, filterValue) =>
        globalFilterCellText(filterRows, ids, filterValue),
      autoResetSortBy: false,
      autoResetPage: true,
      autoResetGlobalFilter: false,
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
    (isHomePage || tableType === 'my-systems') &&
    loading &&
    !mySystems?.myCedarSystems
  ) {
    return <PageLoading />;
  }

  return (
    <div className="margin-bottom-6">
      {!isHomePage && (
        <>
          <p className="text-bold margin-0 margin-top-3">
            {t('systemTable.view')}
          </p>

          <ButtonGroup
            type="segmented"
            className="margin-bottom-2 margin-top-1"
          >
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
        (tableType === 'my-systems' || isHomePage) && (
          <Alert
            type="info"
            heading={t('systemTable.noMySystem.header')}
            className="margin-top-5"
          >
            {isHomePage ? (
              <Trans
                i18nKey="systemProfile:systemTable.noMySystem.description"
                components={{
                  link1: (
                    <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
                  ),
                  link2: <UswdsReactLink to="/systems"> </UswdsReactLink>,
                  iconForward: (
                    <Icon.ArrowForward className="icon-top margin-left-05" />
                  )
                }}
              />
            ) : (
              <Trans
                i18nKey="systemProfile:systemTable.noMySystem.descriptionAlt"
                components={{
                  link1: (
                    <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
                  )
                }}
              />
            )}
          </Alert>
        )}

      {/* Alert to show to direct to Systems tab when viewing My sytems */}
      {filteredSystems.length > 0 && isHomePage && (
        <Alert
          type="info"
          heading={t('systemProfile:systemTable:dontSeeSystem.header')}
        >
          <Trans
            i18nKey="systemProfile:systemTable:dontSeeSystem.description"
            components={{
              link1: <UswdsReactLink to="/systems"> </UswdsReactLink>,
              iconForward: (
                <Icon.ArrowForward className="icon-top margin-left-05" />
              )
            }}
          />
        </Alert>
      )}
    </div>
  );
};

export default Table;
