import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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
  CedarSystem,
  GetCedarSystemsQuery,
  SystemIntakeSystem,
  useGetCedarSystemsQuery
} from 'gql/generated/graphql';

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

export type LinkedSystemTableType = 'system-links';

type TableProps = {
  systems?: SystemIntakeSystem[];
  defaultPageSize?: number;
  isHomePage?: boolean;
  systemIntakeId: string;
  onRemoveLink: (id: string) => void;
};

const organizeCedarSystems = (
  data: GetCedarSystemsQuery | undefined
): Record<string, CedarSystem> => {
  if (!data || !data.cedarSystems) return {};

  return data.cedarSystems.reduce<Record<string, CedarSystem>>((acc, item) => {
    acc[item.id] = item as CedarSystem;
    return acc;
  }, {});
};

const LinkedSystemsTable = ({
  systems = [],
  defaultPageSize = 10,
  isHomePage,
  systemIntakeId,
  onRemoveLink
}: TableProps) => {
  const { t } = useTranslation('linkedSystems');

  const history = useHistory();

  const {
    loading: loadingSystems,
    error: cedarSystemsError,
    data
  } = useGetCedarSystemsQuery();

  const organizedCedarSystems = useMemo(
    () => organizeCedarSystems(data),
    [data]
  );

  const translateSystemRelationships = useCallback(
    (systemRelationships: string[]) =>
      systemRelationships
        .filter(Boolean)
        .map(relationship => t(`relationshipTypes.${relationship}`))
        .join(', '),
    [t]
  );

  const columns: Column<SystemIntakeSystem>[] = useMemo(() => {
    const cols: Column<SystemIntakeSystem>[] = [];

    cols.push({
      Header: t<string>('linkedSystemsTable.header.systemName'),
      accessor: 'systemID',
      id: 'systemID',
      Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => {
        return (
          <p>
            {t(`${organizedCedarSystems[row.original.systemID]?.name}` || '')}
          </p>
        );
      }
    });

    cols.push({
      Header: t<string>('linkedSystemsTable.header.relationships'),
      accessor: 'systemRelationshipType',
      id: 'systemRelationshipType',
      Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => {
        return <>{translateSystemRelationships({ ...row }.cells[1]?.value)}</>;
      }
    });

    cols.push({
      Header: t<string>('linkedSystemsTable.header.actions'),
      Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => {
        return (
          <div>
            <Button
              type="button"
              unstyled
              onClick={() =>
                history.push(
                  `/linked-systems-form/${systemIntakeId}${row.original.id ? `/${row.original.id}` : ''}`
                )
              }
            >
              {t('linkedSystemsTable.edit')}
            </Button>
            <span className="margin-x-1" />
            <Button
              type="button"
              unstyled
              className="text-error"
              onClick={() => onRemoveLink(row.original.id)}
            >
              {t('linkedSystemsTable.remove')}
            </Button>
            <span className="margin-x-1" />
          </div>
        );
      }
    });

    return cols;
  }, [
    systemIntakeId,
    t,
    history,
    onRemoveLink,
    translateSystemRelationships,
    organizedCedarSystems
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

  rows.forEach(row => prepareRow(row));

  return (
    <div className="margin-bottom-6">
      {systems.length > 0 && (
        <>
          <TableResults
            globalFilter={state.globalFilter}
            pageIndex={pageIndex}
            pageSize={pageSize}
            filteredRowLength={rows.length}
            rowLength={systems.length}
            className="margin-bottom-4"
          />
          <UswdsTable
            bordered={false}
            fullWidth
            scrollable
            {...getTableProps()}
          >
            <caption className="usa-sr-only">
              {t('systemTable.caption')}
            </caption>

            <thead>
              {headerGroups.map(headerGroup => {
                return (
                  <tr key={{ ...headerGroup.getHeaderGroupProps() }.key}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        aria-sort={getColumnSortStatus(column)}
                        scope="col"
                        style={{
                          minWidth: index === 0 ? '50px' : '150px',
                          padding: index === 0 ? '0' : 'auto',
                          paddingLeft: index === 0 ? '.5em' : 'auto',
                          position: 'relative'
                        }}
                        key={column.id}
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
                );
              })}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                const { id, cells } = { ...row };
                return (
                  <tr key={id}>
                    {cells.map((cell, index) => (
                      <td
                        style={{
                          paddingLeft: index === 0 ? '.5em' : 'auto'
                        }}
                        key={{ ...cell.getCellProps() }.key}
                      >
                        {cell.render('Cell')}
                      </td>
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
            {systems.length > 5 && (
              <TablePageSize
                className="desktop:grid-col-auto"
                pageSize={state.pageSize}
                setPageSize={setPageSize}
              />
            )}
          </div>
        </>
      )}
      {loadingSystems && <PageLoading />}
      {(!systems || systems.length === 0) && (
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
      {cedarSystemsError && (
        <Alert type="warning" className="margin-top-5">
          <Trans
            i18nKey="linkedSystems:linkedSystemsTable.errorRetrievingCedarSystems"
            components={{
              link1: <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
            }}
          />
        </Alert>
      )}
    </div>
  );
};

export default LinkedSystemsTable;
