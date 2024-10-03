import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Button, Table } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { AvatarCircle } from 'components/shared/Avatar/Avatar';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import teamRolesIndex from 'constants/teamRolesIndex';
import { UsernameWithRoles } from 'types/systemProfile';
import globalFilterCellText from 'utils/globalFilterCellText';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';
import { NotFoundPartial } from 'views/NotFound';
import { getTeamMemberName } from 'views/SystemProfile/components/Team/Edit';

function TeamTable({
  cedarSystemId: systemId,
  team,
  setMemberToDelete
}: {
  cedarSystemId: string;
  team: UsernameWithRoles[];
  setMemberToDelete: React.Dispatch<
    React.SetStateAction<{
      euaUserId: string;
      commonName: string;
    } | null>
  >;
}) {
  const { t } = useTranslation('systemProfile');

  const columns: Column<UsernameWithRoles>[] = useMemo(
    () => [
      {
        Header: 'Name',
        id: 'name',
        accessor: uwr => {
          const p = uwr.roles[0];
          return `${p.assigneeFirstName || ''} ${p.assigneeLastName || ''}`;
        },
        Cell: ({ value }: CellProps<UsernameWithRoles, string>) => {
          return (
            <div className="display-flex flex-align-center">
              <AvatarCircle user={value} />
              <span className="margin-left-1">{value}</span>
            </div>
          );
        }
      },
      {
        Header: 'Role',
        id: 'role',
        accessor: 'roles',
        Cell: ({ row }: CellProps<UsernameWithRoles>) => {
          return row.original.roles.map(r => r.roleTypeName).join(', ');
        },
        sortType: (a: Row<UsernameWithRoles>, b: Row<UsernameWithRoles>) => {
          const ar = a.original.roles[0];
          const br = b.original.roles[0];
          const ari = teamRolesIndex()[ar.roleTypeName || ''] ?? 99;
          const bri = teamRolesIndex()[br.roleTypeName || ''] ?? 99;
          if (ari !== bri) {
            return ari - bri;
          }
          return 0;
        }
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }: CellProps<UsernameWithRoles>) => {
          const user = row.original;
          return (
            <>
              <UswdsReactLink
                to={{
                  pathname: `/systems/${systemId}/team/edit/team-member`,
                  search: 'workspace',
                  state: {
                    user
                  }
                }}
                className="text-primary"
              >
                {t('singleSystem.editTeam.editRoles')}
              </UswdsReactLink>
              <Button
                type="button"
                unstyled
                className="margin-left-1 text-error"
                onClick={() =>
                  setMemberToDelete({
                    euaUserId: user.assigneeUsername,
                    commonName: getTeamMemberName(user)
                  })
                }
              >
                {t('singleSystem.editTeam.remove')}
              </Button>
            </>
          );
        },
        disableSortBy: true
      }
    ],
    [systemId, t, setMemberToDelete]
  );

  const tableData: UsernameWithRoles[] = useMemo(() => {
    // Alpha by first name, except with Business owner and Project lead roles at the top
    const initIndex: { [v: string]: number } = {
      'Business Owner': 0,
      'Project Lead': 1,
      'Government Task Lead (GTL)': 2,
      "Contracting Officer's Representative (COR)": 3
    };

    return team.concat().sort((a, b) => {
      // Some roles
      const ar = a.roles[0];
      const br = b.roles[0];
      const ari = initIndex[ar.roleTypeName || ''] ?? 9;
      const bri = initIndex[br.roleTypeName || ''] ?? 9;
      if (ari !== bri) {
        return ari - bri;
      }
      // Then full names
      const an = getTeamMemberName(a).toLowerCase();
      const bn = getTeamMemberName(b).toLowerCase();
      if (an < bn) return -1;
      if (an > bn) return 1;
      return 0;
    });
  }, [team]);

  const {
    canNextPage,
    canPreviousPage,
    getTableBodyProps,
    getTableProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    rows,
    setGlobalFilter,
    setPageSize,
    state
  } = useTable(
    {
      columns,
      globalFilter: useMemo(() => globalFilterCellText, []),
      data: tableData,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        // sortBy: useMemo(() => [{ id: 'role', desc: true }], []),
        pageIndex: 0,
        pageSize: 10
      }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  rows.map(row => prepareRow(row));

  const error = false;
  const loading = false;

  if (error) {
    return <NotFoundPartial />;
  }

  if (loading) {
    return <PageLoading />;
  }
  return (
    <div>
      {team.length > state.pageSize && (
        <GlobalClientFilter
          setGlobalFilter={setGlobalFilter}
          tableID="workspace-team-table"
          tableName={t('singleSystem.editTeam.teamMembers')}
          className="margin-y-3"
        />
      )}

      <Table bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px"
                >
                  <Button
                    type="button"
                    unstyled
                    className="width-full display-flex"
                    {...column.getSortByToggleProps()}
                  >
                    <div className="flex-fill text-no-wrap">
                      {column.render('Header')}
                    </div>
                    <div className="position-relative width-205 margin-left-05">
                      {getHeaderSortIcon(column)}
                    </div>
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIdx) => {
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length === 0 && (
        <div className="padding-x-2 padding-bottom-1 border-bottom-1px margin-top-neg-105 line-height-body-5">
          {t('singleSystem.noDataAvailable')}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="grid-row grid-gap grid-gap-lg">
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
              className="desktop:grid-col-fill flex-justify-start margin-left-neg-1 desktop:padding-bottom-0 desktop:margin-bottom-0"
            />
            <TablePageSize
              className="desktop:grid-col-auto"
              pageSize={state.pageSize}
              setPageSize={setPageSize}
            />
          </div>

          <div
            className="usa-sr-only usa-table__announcement-region"
            aria-live="polite"
          >
            {currentTableSortDescription(headerGroups[0])}
          </div>
        </>
      )}
    </div>
  );
}

export default TeamTable;
