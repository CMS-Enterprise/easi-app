/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
import { Icon, Link, Table as UswdsTable } from '@trussworks/react-uswds';
import {
  GetCedarSystemsQuery,
  useCreateCedarSystemBookmarkMutation,
  useDeleteCedarSystemBookmarkMutation,
  useGetMyCedarSystemsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import { AtoStatusIconText } from 'components/AtoStatus';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
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

type CedarSystem = GetCedarSystemsQuery['cedarSystems'][number];

export type LinkedSystemTableType = 'system-links';

type TableProps = {
  systems?: CedarSystem[];
  defaultPageSize?: number;
  isHomePage?: boolean;
};

const LinkedSystemsTable = ({
  systems = [],
  defaultPageSize = 10,
  isHomePage
}: TableProps) => {
  const flags = useFlags();
  const { t } = useTranslation('linkedSystems');

  const { loading, data: mySystems } = useGetMyCedarSystemsQuery();

  const [createMutate] = useCreateCedarSystemBookmarkMutation();
  const [deleteMutate] = useDeleteCedarSystemBookmarkMutation();

  const columns: Column<CedarSystem>[] = useMemo(() => {
    const cols: Column<CedarSystem>[] = [];

    cols.push({
      Header: t<string>('linkedSystemsTable.header.systemName'),
      accessor: 'name',
      id: 'systemName',
      Cell: ({ row }: { row: Row<CedarSystem> }) => {
        const url = `/systems/${row.original.id}/home/top`;
        return <UswdsReactLink to={url}>{row.original.name}</UswdsReactLink>;
      }
    });

    if (!isHomePage) {
      cols.push({
        Header: t<string>('linkedSystemsTable.header.relationships'),
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
        Header: t<string>('linkedSystemsTable.header.actions'),
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
  }, [t, systems, createMutate, deleteMutate, isHomePage, flags.showAtoColumn]);

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
      data: systems as CedarSystem[],
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

  if (loading && !mySystems?.myCedarSystems) {
    return <PageLoading />;
  }

  return (
    <div className="margin-bottom-6">
      {systems.length > state.pageSize && (
        <>
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
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={{ ...headerGroup.getHeaderGroupProps() }.key}
            >
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
              <tr {...row.getRowProps()} key={{ ...row.getRowProps() }.key}>
                {row.cells.map((cell, index) => (
                  <th
                    style={{
                      paddingLeft: index === 0 ? '.5em' : 'auto'
                    }}
                    {...cell.getCellProps()}
                    key={{ ...cell.getCellProps() }.key}
                  >
                    {cell.render('Cell')}
                  </th>
                ))}
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>

      {systems.length > 0 && (
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
          {systems.length > 5 && (
            <TablePageSize
              className="desktop:grid-col-auto"
              pageSize={state.pageSize}
              setPageSize={setPageSize}
            />
          )}
        </div>
      )}

      {/* Alerts to show if there is no system/data */}
      {systems.length === 0 && (
        <Alert
          type="info"
          heading={t('systemTable.noMySystem.header')}
          className="margin-top-5"
        >
          {isHomePage ? (
            <Trans
              i18nKey="systemProfile:systemTable.noMySystem.description"
              components={{
                link1: <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>,
                link2: <UswdsReactLink to="/systems"> </UswdsReactLink>,
                iconForward: (
                  <Icon.ArrowForward
                    className="icon-top margin-left-05"
                    aria-hidden
                  />
                )
              }}
            />
          ) : (
            <Trans
              i18nKey="systemProfile:systemTable.noMySystem.descriptionAlt"
              components={{
                link1: <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
              }}
            />
          )}
        </Alert>
      )}

      {/* Alert to show to direct to Systems tab when viewing My sytems */}
      {systems.length > 0 && isHomePage && (
        <Alert
          type="info"
          heading={t('systemProfile:systemTable:dontSeeSystem.header')}
        >
          <Trans
            i18nKey="systemProfile:systemTable:dontSeeSystem.description"
            components={{
              link1: <UswdsReactLink to="/systems"> </UswdsReactLink>,
              iconForward: (
                <Icon.ArrowForward
                  className="icon-top margin-left-05"
                  aria-hidden
                />
              )
            }}
          />
        </Alert>
      )}
    </div>
  );
};

export default LinkedSystemsTable;
