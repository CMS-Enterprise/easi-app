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
import { cloneDeep } from 'lodash';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { AvatarCircle } from 'components/shared/Avatar/Avatar';
import GlobalClientFilter from 'components/TableFilter';
import TablePageSize from 'components/TablePageSize';
import TablePagination from 'components/TablePagination';
import { teamManagementRolesIndex } from 'constants/teamRolesIndex';
import { TeamMemberRoleTypeName, UsernameWithRoles } from 'types/systemProfile';
import globalFilterCellText from 'utils/globalFilterCellText';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';
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
        Header: t<string>('singleSystem.editTeam.tableHeader.name'),
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
        Header: t<string>('singleSystem.editTeam.tableHeader.roles'),
        id: 'role',
        accessor: 'roles',
        Cell: ({ row }: CellProps<UsernameWithRoles>) => {
          return row.original.roles.map(r => r.roleTypeName).join(', ');
        },
        sortType: (a: Row<UsernameWithRoles>, b: Row<UsernameWithRoles>) => {
          const ar = a.original.roles[0];
          const br = b.original.roles[0];
          // Sort on particular roles for this context
          const roleEndIdx = Object.keys(teamManagementRolesIndex).length;
          const ari =
            teamManagementRolesIndex[
              ar.roleTypeName as TeamMemberRoleTypeName
            ] ?? roleEndIdx;
          const bri =
            teamManagementRolesIndex[
              br.roleTypeName as TeamMemberRoleTypeName
            ] ?? roleEndIdx;
          if (ari !== bri) {
            return bri - ari;
          }
          // Then full names
          const an = getTeamMemberName(a.original).toLowerCase();
          const bn = getTeamMemberName(b.original).toLowerCase();
          if (an < bn) return 1;
          if (an > bn) return -1;
          return 0;
        }
      },
      {
        Header: t<string>('singleSystem.editTeam.tableHeader.actions'),
        id: 'actions',
        Cell: ({ row }: CellProps<UsernameWithRoles>) => {
          const user = row.original;
          return (
            <div className="text-no-wrap">
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

              {/* Cannot remove the last member */}
              {team.length > 1 && (
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
              )}
            </div>
          );
        },
        disableSortBy: true
      }
    ],
    [systemId, t, setMemberToDelete, team.length]
  );

  // Resort roles for every member for this context
  const tableData: UsernameWithRoles[] = useMemo(() => {
    // Make sure to not mutate the passed in team list
    const teamData = cloneDeep(team);

    const roleEndIdx = Object.keys(teamManagementRolesIndex).length;
    // eslint-disable-next-line no-restricted-syntax
    for (const p of teamData) {
      p.roles.sort((a, b) => {
        return (
          (teamManagementRolesIndex[a.roleTypeName as TeamMemberRoleTypeName] ??
            roleEndIdx) -
          (teamManagementRolesIndex[b.roleTypeName as TeamMemberRoleTypeName] ??
            roleEndIdx)
        );
      });
    }

    return teamData;
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
        sortBy: useMemo(() => [{ id: 'role', desc: true }], []),
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

      <Table bordered={false} fullWidth {...getTableProps()}>
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
              className="desktop:grid-col-fill flex-justify-start desktop:padding-bottom-0 desktop:margin-bottom-0"
            />
            <TablePageSize
              className="desktop:grid-col-auto"
              pageSize={state.pageSize}
              setPageSize={setPageSize}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default TeamTable;
