import React, { useMemo } from 'react';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, Table } from '@trussworks/react-uswds';
import { useGetSystemIntakeContactsQuery } from 'gql/generated/graphql';

import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

type SystemIntakeContact = {
  id: string;
  userAccount: {
    commonName: string;
  };
  component: string;
  roles: string[];
};

const SystemIntakeContactsTable = ({
  systemIntakeId
}: {
  systemIntakeId: string;
}) => {
  const { data } = useGetSystemIntakeContactsQuery({
    variables: {
      id: systemIntakeId
    }
  });

  const { additionalContacts = [] } = data?.systemIntakeContacts || {};

  const columns = useMemo<Column<SystemIntakeContact>[]>(
    () => [
      {
        Header: 'Name',
        accessor: (row: SystemIntakeContact) => row.userAccount.commonName,
        id: 'commonName'
      },
      {
        Header: 'Component',
        accessor: 'component',
        id: 'component'
      },
      {
        Header: 'Role(s)',
        accessor: 'roles',
        id: 'roles',
        Cell: ({ value }: { value: string[] }) => <>{value.join(', ')}</>
      }
    ],
    []
  );

  const table = useTable(
    {
      columns,
      data: additionalContacts,
      autoResetSortBy: false,
      autoResetPage: true
    },
    useSortBy
  );

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

  return (
    <Table bordered={false} fullWidth scrollable {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => {
          const { key, ...headerGroupProps } =
            headerGroup.getHeaderGroupProps();

          return (
            <tr {...headerGroupProps} key={key}>
              {headerGroup.headers.map(column => {
                const { key: headerKey, ...headerProps } =
                  column.getHeaderProps();

                return (
                  <th
                    {...headerProps}
                    key={headerKey}
                    aria-sort={getColumnSortStatus(column)}
                    scope="col"
                    className="border-bottom-2px"
                    style={{
                      width: column.width
                    }}
                  >
                    <Button
                      type="button"
                      className="width-full flex-justify margin-y-0"
                      unstyled
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      {getHeaderSortIcon(column)}
                    </Button>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          const { key: rowKey, ...rowProps } = row.getRowProps();

          const { id } = row.original;

          return (
            <tr {...rowProps} key={rowKey} data-testid={`contact-${id}`}>
              {row.cells.map(cell => {
                const { key: cellKey, ...cellProps } = cell.getCellProps();

                return (
                  <td {...cellProps} key={cellKey}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default SystemIntakeContactsTable;
