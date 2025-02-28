import React, { useMemo } from 'react';
import { Row, useFlexLayout, usePagination, useTable } from 'react-table';
import { Table as UswdsTable } from '@trussworks/react-uswds';
import { getPersonFullName } from 'features/Systems/SystemProfile/util';
import {
  GetTRBRequestSummaryQuery,
  SystemIntakeFragmentFragment
} from 'gql/generated/graphql';

import TablePagination from 'components/TablePagination';

import SystemCard from '.';

type SystemCardTableProps = {
  systems: GetTRBRequestSummaryQuery['trbRequest']['systems'];
};

/**
 * Creating a bare table for SystemCard
 * Utilizing pagination for each/single card
 * */

const SystemCardTable = ({ systems }: SystemCardTableProps) => {
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
            />
          );
        }
      }
    ];
  }, []);

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
                    <td className="border-0 padding-0" {...cell.getCellProps()}>
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
