import React, { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Column, useSortBy, useTable } from 'react-table';
import { Button, ButtonGroup, Table } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { SystemIntakeGrbReviewer } from 'queries/types/SystemIntakeGrbReviewer';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

import IsGrbViewContext from '../IsGrbViewContext';

type GRBReviewProps = {
  id: string;
  grbReviewers: SystemIntakeGrbReviewer[];
};

const GRBReview = ({ id, grbReviewers }: GRBReviewProps) => {
  const { t } = useTranslation('grbReview');

  const isGrbView = useContext(IsGrbViewContext);

  const columns = useMemo<Column<SystemIntakeGrbReviewer>[]>(() => {
    /** Column with action buttons to display for GRT admins */
    const actionColumn: Column<SystemIntakeGrbReviewer> = {
      Header: t<string>('participantsTable.actions'),
      Cell: () => {
        // TODO: Update edit and remove buttons with functionality from EASI-4332
        return (
          <ButtonGroup data-testid="grbReviewerActions">
            <Button type="button" onClick={() => null} unstyled>
              {t('Edit')}
            </Button>
            <Button
              type="button"
              onClick={() => null}
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
  }, [t, isGrbView]);

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
    <div className="padding-bottom-4">
      <PageHeading className="margin-y-0">{t('title')}</PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-3">
        {t('description')}
      </p>

      {/* Feature in progress alert */}
      <Alert
        type="info"
        heading={t('featureInProgress')}
        className="margin-bottom-5"
      >
        <Trans
          i18nKey="grbReview:featureInProgressText"
          components={{
            a: (
              <UswdsReactLink to="/help/send-feedback" target="_blank">
                feedback form
              </UswdsReactLink>
            )
          }}
        />
      </Alert>

      {/* Participants table */}
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
        <UswdsReactLink
          className="usa-button"
          // TODO EASI-4332: link to add GRB reviewer form
          to="/"
        >
          {t('addGrbReviewer')}
        </UswdsReactLink>
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
      </div>

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

export default GRBReview;
