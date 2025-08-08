import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Row, useFlexLayout, usePagination, useTable } from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { getPersonFullName } from 'features/Systems/SystemProfile/util';
import {
  SystemIntakeFragmentFragment,
  SystemRelationshipType,
  useGetSystemIntakeSystemsQuery
} from 'gql/generated/graphql';

import TablePagination from 'components/TablePagination';

import SystemCard from '.';

type SystemCardTableProps = {
  systems: SystemIntakeFragmentFragment['systems'];
  systemRelationshipType?: SystemRelationshipType[];
};

/**
 * Creating a bare table for SystemCard
 * Utilizing pagination for each/single card
 * */

const SystemCardTable = ({
  systems,
  systemRelationshipType
}: SystemCardTableProps) => {
  const { systemId } = useParams<{ systemId: string }>();

  console.log(`systems[0].id: ${systems[0].id}`);
  // console.log('systemRelationshipType', systemRelationshipType);

  const { data, loading, error } = useGetSystemIntakeSystemsQuery({
    variables: {
      systemIntakeId: systemId
    }
  });
  console.log(data?.systemIntakeSystems);

  const columns: any = useMemo(() => {
    return [
      {
        accessor: 'id',
        disableGlobalFilter: true,
        Cell: ({
          row
        }: {
          row: Row<SystemIntakeFragmentFragment['systems'][number]>;
        }) => {
          return (
            <SystemCard
              id={row.original.id}
              name={row.original.name}
              description={row.original.description}
              acronym={row.original.acronym}
              businessOwnerOrg={row.original.businessOwnerOrg}
              businessOwners={row.original.businessOwnerRoles
                .map(role => getPersonFullName(role))
                .join(', ')}
              systemRelationshipType={systemRelationshipType}
            />
          );
        }
      }
    ];
  }, [systemRelationshipType]);

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
  } = useTable(
    {
      columns,
      data: systems,
      initialState: {
        pageSize: 1
      }
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
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      className="border-0 padding-0"
                      {...cell.getCellProps()}
                      key={{ ...cell.getCellProps() }.key}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </UswdsTable>

      {systems.length > 1 && (
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
