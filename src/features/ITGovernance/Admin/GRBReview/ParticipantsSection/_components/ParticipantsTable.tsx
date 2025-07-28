import React, { useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Column, useSortBy, useTable } from 'react-table';
import {
  Button,
  ButtonGroup,
  ModalFooter,
  ModalHeading,
  Table
} from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewDocument,
  SystemIntakeGRBReviewerFragment,
  useDeleteSystemIntakeGRBReviewerMutation
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import Modal from 'components/Modal';
import useMessage from 'hooks/useMessage';
import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon
} from 'utils/tableSort';

type ParticipantsTableProps = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  fromGRBSetup?: boolean;
  showParticipantEditButton?: boolean;
};

const ParticipantsTable = ({
  grbReviewers,
  fromGRBSetup,
  showParticipantEditButton
}: ParticipantsTableProps) => {
  const { t } = useTranslation('grbReview');

  const { systemId } = useParams<{ systemId: string }>();

  const history = useHistory();

  const { pathname } = useLocation();

  const { showMessage } = useMessage();

  const [reviewerToRemove, setReviewerToRemove] =
    useState<SystemIntakeGRBReviewerFragment | null>(null);

  const isITGovAdmin = useContext(ITGovAdminContext);
  const [deleteReviewer] = useDeleteSystemIntakeGRBReviewerMutation({
    refetchQueries: [GetSystemIntakeGRBReviewDocument]
  });

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
              onClick={() => {
                if (fromGRBSetup) {
                  history.push(
                    `/it-governance/${systemId}/grb-review/edit?from-grb-setup`,
                    reviewer
                  );
                } else {
                  history.push(`${pathname}/edit`, reviewer);
                }
              }}
              className="margin-y-0"
              unstyled
            >
              {t('Edit')}
            </Button>
            <Button
              type="button"
              onClick={() => setReviewerToRemove(reviewer)}
              className="text-error margin-y-0"
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
      ...(isITGovAdmin && showParticipantEditButton ? [actionColumn] : [])
    ];
  }, [
    fromGRBSetup,
    history,
    isITGovAdmin,
    pathname,
    setReviewerToRemove,
    showParticipantEditButton,
    systemId,
    t
  ]);

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

  const removeGRBReviewer = (reviewer: SystemIntakeGRBReviewerFragment) => {
    deleteReviewer({ variables: { input: { reviewerID: reviewer.id } } })
      .then(() =>
        showMessage(
          <Trans
            i18nKey="grbReview:messages.success.remove"
            values={{ commonName: reviewer.userAccount.commonName }}
          />,
          { type: 'success' }
        )
      )
      .catch(() => showMessage(t('messages.error.remove'), { type: 'error' }));

    // Reset `reviewerToRemove` to close modal
    setReviewerToRemove(null);
  };

  return (
    <div className="margin-top-3" data-testid="grb-participants-table">
      {
        // Remove GRB reviewer modal
        !!reviewerToRemove && (
          <Modal
            isOpen={!!reviewerToRemove}
            closeModal={() => setReviewerToRemove(null)}
            className="easi-modal__content--narrow"
          >
            <ModalHeading>
              {t('removeModal.title', {
                commonName: reviewerToRemove.userAccount.commonName
              })}
            </ModalHeading>
            <p>{t('removeModal.text')}</p>
            <ModalFooter>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => removeGRBReviewer(reviewerToRemove)}
                  className="bg-error margin-right-1"
                >
                  {t('removeModal.remove')}
                </Button>
                <Button
                  type="button"
                  onClick={() => setReviewerToRemove(null)}
                  unstyled
                >
                  {t('Cancel')}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </Modal>
        )
      }
      <Table bordered={false} fullWidth scrollable {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={{ ...headerGroup.getHeaderGroupProps() }.key}
            >
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  aria-sort={getColumnSortStatus(column)}
                  scope="col"
                  className="border-bottom-2px"
                  key={column.id}
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
                key={row.id}
              >
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={{ ...cell.getCellProps() }.key}
                      data-testid={`grb-reviewer-${cell.column.id}`}
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

export default ParticipantsTable;
