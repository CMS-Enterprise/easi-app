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
import { Button, Link, Table as UswdsTable } from '@trussworks/react-uswds';
import {
  CedarSystem,
  GetCedarSystemsQuery,
  SystemIntakeSystem,
  useGetCedarSystemsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
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
  systemIntakeId,
  onRemoveLink
}: TableProps) => {
  const { t } = useTranslation('linkedSystems');

  const history = useHistory();

  const { loading, error: cedarSystemsError, data } = useGetCedarSystemsQuery();

  const organizedCedarSystems = useMemo(
    () => organizeCedarSystems(data),
    [data]
  );

  const translateSystemRelationships = useCallback(
    (systemRelationships: string[] = [], otherDesc?: string | null) =>
      systemRelationships
        .filter(Boolean)
        .map(relationship => {
          if (relationship === 'OTHER') {
            return otherDesc
              ? `${t(`relationshipTypes.${relationship}`)} (${otherDesc})`
              : t(`relationshipTypes.${relationship}`);
          }
          return t(`relationshipTypes.${relationship}`);
        })
        .join(', '),
    [t]
  );

  const columns = useMemo<Column<SystemIntakeSystem>[]>(() => {
    return [
      {
        Header: t<string>('linkedSystemsTable.header.systemName'),
        accessor: 'systemID',
        id: 'systemID',
        Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => {
          return (
            <p>{organizedCedarSystems[row.original.systemID]?.name ?? ''}</p>
          );
        }
      },
      {
        Header: t<string>('linkedSystemsTable.header.relationships'),
        accessor: 'systemRelationshipType',
        id: 'systemRelationshipType',
        Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => (
          <>
            {translateSystemRelationships(
              row.original.systemRelationshipType,
              row.original.otherSystemRelationshipDescription
            )}
          </>
        )
      },
      {
        Header: t<string>('linkedSystemsTable.header.actions'),
        Cell: ({ row }: { row: Row<SystemIntakeSystem> }) => {
          return (
            <>
              <Button
                type="button"
                unstyled
                className="margin-top-0"
                onClick={() =>
                  history.push(
                    `/linked-systems-form/${systemIntakeId}${row.original.id ? `/${row.original.id}` : ''}`
                  )
                }
              >
                {t('linkedSystemsTable.edit')}
              </Button>
              <Button
                type="button"
                unstyled
                className="margin-top-0 margin-left-2 text-error"
                onClick={() => onRemoveLink(row.original.id)}
              >
                {t('linkedSystemsTable.remove')}
              </Button>
            </>
          );
        }
      }
    ];
  }, [
    history,
    onRemoveLink,
    organizedCedarSystems,
    systemIntakeId,
    t,
    translateSystemRelationships
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
    nextPage,
    previousPage,
    setPageSize
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

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      <UswdsTable bordered={false} fullWidth scrollable {...getTableProps()}>
        <caption className="usa-sr-only">{t('systemTable.caption')}</caption>

        <thead>
          {headerGroups.map(headerGroup => {
            return (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    aria-sort={getColumnSortStatus(column)}
                    scope="col"
                    style={{
                      minWidth: index === 2 ? '150px' : '200px',
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
          {page.map((row: Row<SystemIntakeSystem>) => {
            prepareRow(row);
            // eslint-disable-next-line react/prop-types
            const { id, cells } = row;
            return (
              <tr key={id}>
                {
                  // eslint-disable-next-line react/prop-types
                  cells.map((cell, index) => (
                    <td
                      style={{ paddingLeft: index === 0 ? '.5em' : 'auto' }}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))
                }
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

      {(!systems || systems.length === 0) && (
        <Alert type="info" className="margin-top-0">
          <Trans i18nKey="linkedSystems:linkedSystemsTable.noSystemsListed" />
        </Alert>
      )}
      {cedarSystemsError && (
        <Alert type="warning" className="margin-top-0">
          <Trans
            i18nKey="linkedSystems:linkedSystemsTable.errorRetrievingCedarSystems"
            components={{
              link1: <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
            }}
          />
        </Alert>
      )}
    </>
  );
};

export default LinkedSystemsTable;
