import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, ButtonGroup, Table } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewerFragment } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { SystemIntakeState } from 'types/graphql-global-types';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';
import IsGrbViewContext from 'views/GovernanceReviewTeam/IsGrbViewContext';

type ParticipantsTableProps = {
  id: string;
  state: SystemIntakeState;
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  setReviewerToRemove: (reviewer: SystemIntakeGRBReviewerFragment) => void;
};

/**
 * Participants table used in GRB Review tab
 */
const ParticipantsTable = ({
  id,
  state,
  grbReviewers,
  setReviewerToRemove
}: ParticipantsTableProps) => {
  const { t } = useTranslation('grbReview');
  const history = useHistory();
  const { pathname } = useLocation();

  const isGrbView = useContext(IsGrbViewContext);

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
        Cell: ({ value }) => t<string>(`votingRoles.${value}`)
      },
      {
        Header: t<string>('participantsTable.grbRole'),
        accessor: 'grbRole',
        Cell: ({ value }) => t<string>(`reviewerRoles.${value}`)
      },
      // Only display action column if user is GRT admin
      ...(isGrbView ? [] : [actionColumn])
    ];
  }, [t, isGrbView, setReviewerToRemove, history, pathname]);

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

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows
  } = table;

  return (
    <>
      <h2 className="margin-bottom-0">{t('participants')}</h2>

      <p className="margin-top-05 line-height-body-5">
        {t('participantsText')}
      </p>

      {isGrbView ? (
        // GRB Reviewer documentation links
        <div className="bg-base-lightest padding-2">
          <h4 className="margin-top-0 margin-bottom-1">
            {t('availableDocumentation')}
          </h4>
          <ButtonGroup>
            <UswdsReactLink
              to={`/governance-review-board/${id}/business-case`}
              className="margin-right-3"
            >
              {t('viewBusinessCase')}
            </UswdsReactLink>
            <UswdsReactLink
              to={`/governance-review-board/${id}/intake-request`}
              className="margin-right-3"
            >
              {t('viewIntakeRequest')}
            </UswdsReactLink>
            <UswdsReactLink to={`/governance-review-board/${id}/documents`}>
              {t('viewOtherDocuments')}
            </UswdsReactLink>
          </ButtonGroup>
        </div>
      ) : (
        // Add GRB reviewer button
        <div className="desktop:display-flex flex-align-center">
          <Button
            type="button"
            onClick={() => history.push(`${pathname}/add`)}
            disabled={state === SystemIntakeState.CLOSED}
            outline={grbReviewers.length > 0}
          >
            {t(
              grbReviewers.length > 0
                ? 'addAnotherGrbReviewer'
                : 'addGrbReviewer'
            )}
          </Button>

          {state === SystemIntakeState.CLOSED && (
            <p className="desktop:margin-y-0 desktop:margin-left-1">
              <Trans
                i18nKey="grbReview:closedRequest"
                components={{
                  a: (
                    <UswdsReactLink
                      to={`/governance-review-team/${id}/resolutions/re-open-request`}
                    >
                      re-open
                    </UswdsReactLink>
                  )
                }}
              />
            </p>
          )}
        </div>
      )}

      <div className="margin-top-3">
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
    </>
  );
};

export default ParticipantsTable;