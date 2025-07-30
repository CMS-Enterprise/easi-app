import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
import {
  Button,
  ButtonGroup,
  ModalFooter,
  ModalHeading,
  Table
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import { FormattedFundingSource } from 'types/systemIntake';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';

type FundingSourcesTableProps = {
  fundingSources: FormattedFundingSource[];
  removeFundingSource: (index: number) => void;
};

const FundingSourcesTable = ({
  fundingSources,
  removeFundingSource
}: FundingSourcesTableProps) => {
  const { t } = useTranslation('fundingSources');

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState<number | null>(null);

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
              onClick={() => {
                setIndexToRemove(index);
                setIsRemoveModalOpen(true);
              }}
              data-testid={`removeFundingSource-${index}`}
            >
              {t('general:remove')}
            </Button>
          );
        }
      }
    ];
  }, [t]);

  const table = useTable(
    {
      columns,
      data: fundingSources,
      autoResetSortBy: false,
      autoResetPage: true
    },
    useSortBy
  );

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

  return (
    <>
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

                  if (column.id === 'actions') {
                    return (
                      <th {...headerProps} key={headerKey}>
                        {column.render('Header')}
                      </th>
                    );
                  }

                  return (
                    <th
                      {...headerProps}
                      key={headerKey}
                      aria-sort={getColumnSortStatus(column)}
                      scope="col"
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

      {/* Remove funding source modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        closeModal={() => setIsRemoveModalOpen(false)}
        className="font-body-md"
      >
        <ModalHeading>{t('removeFundingSourcesModal.heading')}</ModalHeading>
        <p>{t('removeFundingSourcesModal.description')}</p>

        <ModalFooter>
          <ButtonGroup>
            <Button
              type="button"
              className="margin-right-2 bg-error"
              onClick={() => {
                if (indexToRemove !== null) {
                  removeFundingSource(indexToRemove);
                }
                setIsRemoveModalOpen(false);
              }}
            >
              {t('removeFundingSourcesModal.removeFundingSource')}
            </Button>

            <Button
              type="button"
              onClick={() => setIsRemoveModalOpen(false)}
              unstyled
            >
              {t('general:cancel')}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FundingSourcesTable;
