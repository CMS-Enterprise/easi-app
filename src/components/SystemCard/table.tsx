import React, { useMemo } from 'react';
import {
  Column,
  Row,
  useFlexLayout,
  usePagination,
  useTable
} from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { getPersonFullName } from 'features/Systems/SystemProfile/util';
import {
  GetTRBRequestSummaryQuery,
  SystemIntakeFragmentFragment
} from 'gql/generated/graphql';

import TablePagination from 'components/TablePagination';

import SystemCard from '.';

type SystemCardTableProps = {
  systems:
    | SystemIntakeFragmentFragment['systemIntakeSystems']
    | GetTRBRequestSummaryQuery['trbRequest']['systems'];
};

type IntakeRow = SystemIntakeFragmentFragment['systemIntakeSystems'][number];
type TrbRow = GetTRBRequestSummaryQuery['trbRequest']['systems'][number];

function isSystemIntakeSystems(
  systems: SystemCardTableProps['systems']
): systems is SystemIntakeFragmentFragment['systemIntakeSystems'] {
  return (
    Array.isArray(systems) &&
    systems.length > 0 &&
    // eslint-disable-next-line no-underscore-dangle
    (systems[0] as any).__typename === 'SystemIntakeSystem'
  );
}

/**
 * One table; we only switch the column Cell mapper based on the type guard.
 */
const SystemCardTable = ({ systems }: SystemCardTableProps) => {
  const isIntake = isSystemIntakeSystems(systems);

  // Typed data per branch
  const data = useMemo(
    () => (isIntake ? (systems as IntakeRow[]) : (systems as TrbRow[])),
    [isIntake, systems]
  );

  // Build columns based on which row type we're rendering
  const columns = useMemo<Column<IntakeRow | TrbRow>[]>(() => {
    if (isIntake) {
      // Intake Cell mapping
      return [
        {
          accessor: 'id',
          disableGlobalFilter: true,
          Cell: ({ row }: { row: Row<IntakeRow> }) => (
            <SystemCard
              id={row.original.cedarSystem?.id!}
              name={row.original.cedarSystem?.name!}
              description={row.original.cedarSystem?.description!}
              acronym={row.original.cedarSystem?.acronym}
              businessOwnerOrg={row.original.cedarSystem?.businessOwnerOrg}
              businessOwners={row.original.cedarSystem?.businessOwnerRoles
                ?.map(role => getPersonFullName(role))
                .join(', ')}
              systemRelationshipType={row.original.systemRelationshipType}
            />
          )
        }
      ];
    }

    // TRB Cell mapping
    return [
      {
        accessor: 'id',
        disableGlobalFilter: true,
        Cell: ({ row }: { row: Row<TrbRow> }) => (
          <SystemCard
            id={row.original.id}
            name={row.original.name}
            description={row.original.description}
            acronym={row.original.acronym}
            businessOwnerOrg={row.original.businessOwnerOrg}
            businessOwners={row.original.businessOwnerRoles
              ?.map(role => getPersonFullName(role))
              .join(', ')}
          />
        )
      }
    ];
  }, [isIntake]);

  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    page,
    state,
    prepareRow
  } = useTable<IntakeRow | TrbRow>(
    {
      columns,
      data,
      initialState: { pageSize: 1 }
    },
    usePagination,
    useFlexLayout
  );

  return (
    <div id="system-card-table">
      <UswdsTable {...getTableProps()} fullWidth>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/prop-types
              <tr {...row.getRowProps()} key={row.id}>
                {
                  // eslint-disable-next-line react/prop-types
                  row.cells.map(cell => {
                    return (
                      <td
                        className="border-0 padding-0"
                        {...cell.getCellProps()}
                        key={{ ...cell.getCellProps() }.key}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })
                }
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>

      {data.length > 1 && (
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
        />
      )}
    </div>
  );
};

export default SystemCardTable;
