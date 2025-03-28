import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, Table } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewerFragment } from 'gql/generated/graphql';

import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

import GRBReviewerVote from './GRBReviewerVote';

type DecisionRecordTableProps = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
};

/**
 * Displays the decision record table for GRB reviews
 */
const DecisionRecordTable = ({ grbReviewers }: DecisionRecordTableProps) => {
  const { t } = useTranslation('grbReview');

  /** Columns for table */
  const columns = useMemo<Column<SystemIntakeGRBReviewerFragment>[]>(() => {
    return [
      {
        Header: t<string>('participantsTable.name'),
        id: 'commonName',
        accessor: ({ userAccount }) => userAccount.commonName,
        width: 'auto'
      },
      {
        Header: t<string>('participantsTable.votingRole'),
        accessor: 'votingRole',
        Cell: cell => {
          const { value } = cell;
          return <>{t<string>(`votingRoles.${value}`)}</>;
        },
        width: 160
      },
      {
        Header: t<string>('participantsTable.grbRole'),
        accessor: 'grbRole',
        Cell: cell => {
          const { value } = cell;
          return <>{t<string>(`reviewerRoles.${value}`)}</>;
        },
        width: 350
      },
      {
        Header: t<string>('Vote'),
        accessor: grbReviewer => <GRBReviewerVote grbReviewer={grbReviewer} />,
        width: 350
      }
    ];
  }, [t]);

  const table = useTable(
    {
      columns,
      data: grbReviewers,
      autoResetSortBy: false,
      autoResetPage: true,
      initialState: {
        sortBy: useMemo(() => [{ id: 'commonName', desc: false }], [])
      }
    },
    useSortBy
  );

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    table;

  return (
    <div className="margin-top-6" data-testid="grb-participants-table">
      <Table bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px"
                  style={{
                    width: column.width
                  }}
                >
                  <Button
                    type="button"
                    className="width-full flex-justify"
                    unstyled
                    {...column.getSortByToggleProps()}
                  >
                    {column.render('Header')}
                    {getHeaderSortIcon(column)}
                  </Button>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                data-testid={`grbReviewer-${row.original.userAccount.username}`}
              >
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        width: cell.column.width
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.length === 0 && (
        <p className="text-italic margin-top-neg-1">
          {t('participantsTable.noReviewers')}
        </p>
      )}

      {rows.length > 0 && (
        <p
          className="usa-sr-only usa-table__announcement-region"
          aria-live="polite"
        >
          {currentTableSortDescription(headerGroups[0])}
        </p>
      )}
    </div>
  );
};

export default DecisionRecordTable;
