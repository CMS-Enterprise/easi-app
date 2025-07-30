import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useTable } from 'react-table';
import { Button, Table } from '@trussworks/react-uswds';

import { FormattedFundingSource } from 'types/systemIntake';

type FundingSourcesTableProps = {
  fundingSources: FormattedFundingSource[];
  removeFundingSource: (index: number) => void;
};

const FundingSourcesTable = ({
  fundingSources,
  removeFundingSource
}: FundingSourcesTableProps) => {
  const { t } = useTranslation('fundingSources');

  const columns = useMemo<Column<FormattedFundingSource>[]>(() => {
    return [
      {
        Header: t<string>('projectNumber'),
        accessor: 'projectNumber',
        id: 'projectNumber'
      },
      {
        Header: t<string>('investments'),
        accessor: 'investments',
        id: 'investments',
        Cell: ({ value }: { value: string[] }) => <>{value.join(', ')}</>
      },
      {
        Header: t<string>('general:actions'),
        id: 'actions',
        accessor: (_, index) => {
          return (
            <Button
              unstyled
              type="button"
              className="text-error margin-y-0"
              onClick={() => removeFundingSource(index)}
              data-testid={`removeFundingSource-${index}`}
            >
              {t('general:remove')}
            </Button>
          );
        }
      }
    ];
  }, [t, removeFundingSource]);

  const table = useTable({
    columns,
    data: fundingSources,
    autoResetSortBy: false,
    autoResetPage: true
  });

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

  return (
    <div>
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
                    <th {...headerProps} key={headerKey}>
                      {column.render('Header')}
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

            return (
              <tr {...rowProps} key={rowKey}>
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
    </div>
  );
};

export default FundingSourcesTable;
