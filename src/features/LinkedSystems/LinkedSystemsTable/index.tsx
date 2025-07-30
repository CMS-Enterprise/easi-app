/**
 * TODO: This component is not complete. It was prototyped as part of
 * https://jiraent.cms.gov/browse/EASI-1367, but has not undergone any 508 testing,
 * UX review, etc.
 */

import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Column,
  Row,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import {
  Button,
  Icon,
  Link,
  Table as UswdsTable
} from '@trussworks/react-uswds';
import {
  GetCedarSystemsQuery,
  SystemIntakeSystem,
  useCreateCedarSystemBookmarkMutation,
  useDeleteCedarSystemBookmarkMutation,
  useGetCedarSystemsQuery,
  useGetMyCedarSystemsQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import TableResults from 'components/TableResults';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnValues
} from 'utils/tableSort';

import './index.scss';

// type SystemLink {
// otherSystemRelationship: null;
// systemID: "{11AB1A00-1234-5678-ABC1-1A001B00CC1B}";
// systemIntakeID: "feeb8bf9-236b-4061-b506-53641ab14c9c";
// systemRelationshipType: ["IMPACTS_SELECTED_SYSTEM"];
// __typename: "SystemIntakeSystem";
// }

export type LinkedSystemTableType = 'system-links';

type TableProps = {
  systems?: SystemIntakeSystem[];
  defaultPageSize?: number;
  isHomePage?: boolean;
};

const organizeCedarSystems = (data: GetCedarSystemsQuery | undefined) => {
  if (!data || !data.cedarSystems) return {};
  return data.cedarSystems.reduce((acc: any, item: any) => {
    acc[item.id] = item;
    return acc;
  }, {});
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

  const {
    loading: loadingSystems,
    error: error1,
    data: data1
  } = useGetCedarSystemsQuery();

  console.log(loadingSystems, error1, systems, data1?.cedarSystems);

  const organizedCedarSystems = organizeCedarSystems(data1);

  console.log('organizedCedarSystems', organizedCedarSystems);

  const columns: Column<SystemIntakeSystem>[] = useMemo(() => {
    const cols: Column<SystemIntakeSystem>[] = [];

    cols.push({
      Header: t<string>('linkedSystemsTable.header.systemName'),
      accessor: 'systemID',
      id: 'systemID',
      Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => {
        // const url = `/systems/${row.id}/home/top`;
        // return <UswdsReactLink to={url}>{row.id}</UswdsReactLink>;
        return <p>{t(`${organizedCedarSystems[row.cells[0].value].name}`)}</p>;
      }
    });

    cols.push({
      Header: t<string>('linkedSystemsTable.header.relationships'),
      accessor: 'systemRelationshipType',
      id: 'systemRelationshipType',
      Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => {
        return <p>{t(`${row.cells[1].value}`)}</p>;
      }
    });

    if (flags.showAtoColumn) {
      cols.push({
        Header: t<string>('linkedSystemsTable.header.actions'),
        Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => (
          <div>
            <Button type="button" unstyled>
              Edit
            </Button>
            <span style={{ margin: '0 0.5rem' }} />
            <Button type="button" unstyled>
              Remove
            </Button>
            <span style={{ margin: '0 0.5rem' }} />
          </div>
        ),
        sortType: (a, b) =>
          (a.values.atoExpirationDate ?? '') >
          (b.values.atoExpirationDate ?? '')
            ? 1
            : -1
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
      data: systems as SystemIntakeSystem[],
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
        <Alert type="info" className="margin-top-5">
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
            <Trans i18nKey="linkedSystems:linkedSystemsTable.noSystemsListed" />
          )}
        </Alert>
      )}
    </div>
  );
};

export default LinkedSystemsTable;
