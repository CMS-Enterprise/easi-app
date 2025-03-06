import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, ButtonGroup, Table } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewerFragment } from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

type ParticipantsTableProps = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  setReviewerToRemove: (reviewer: SystemIntakeGRBReviewerFragment) => void;
};

const ParticipantsTable = ({
  grbReviewers,
  setReviewerToRemove
}: ParticipantsTableProps) => {
  const { t } = useTranslation('grbReview');
  const history = useHistory();
  const { pathname } = useLocation();

  const isITGovAdmin = useContext(ITGovAdminContext);

  /** Columns for table */
  const columns = useMemo<Column<SystemIntakeGRBReviewerFragment>[]>(() => {
    /** Column with action buttons to display for GRT admins */
    const actionColumn: Column<SystemIntakeGRBReviewerFragment> = {
      Header: t<string>('participantsTable.actions'),
      Cell: ({
        row: { original: reviewer }
      }: {
        row: { original: SystemIntakeGRBReviewerFragment };
      }) => {
        return (
          <ButtonGroup data-testid="grbReviewerActions">
            <Button
              type="button"
              onClick={() => history.push(`${pathname}/edit`, reviewer)}
              unstyled
            >
              {t('Edit')}
            </Button>
            <Button
              type="button"
              onClick={() => setReviewerToRemove(reviewer)}
              className="text-error"
              unstyled
            >
              {t('Remove')}
            </Button>
          </ButtonGroup>
        );
      }
    };

    return [
      {
        Header: t<string>('participantsTable.name'),
        id: 'commonName',
        accessor: ({ userAccount }) => userAccount.commonName
      },
      {
        Header: t<string>('participantsTable.votingRole'),
        accessor: 'votingRole',
        Cell: cell => {
          const { value } = cell;
          return <>{t<string>(`votingRoles.${value}`)}</>;
        }
      },
      {
        Header: t<string>('participantsTable.grbRole'),
        accessor: 'grbRole',
        Cell: cell => {
          const { value } = cell;
          return <>{t<string>(`reviewerRoles.${value}`)}</>;
        }
      },
      // Only display action column if user is GRT admin
      ...(isITGovAdmin ? [actionColumn] : [])
    ];
  }, [t, isITGovAdmin, setReviewerToRemove, history, pathname]);

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
    <div className="margin-top-3" data-testid="grb-participants-table">
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

export default ParticipantsTable;
