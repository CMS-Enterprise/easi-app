import React, { useCallback, useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Cell, Column, useSortBy, useTable } from 'react-table';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  ComboBox,
  Form,
  FormGroup,
  Table
} from '@trussworks/react-uswds';
import {
  CreateSystemIntakeGRBReviewersMutationFn,
  useGetGRBReviewersComparisonsQuery
} from 'gql/gen/graphql';

import { useEasiForm } from 'components/EasiForm';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import Spinner from 'components/Spinner';
import useMessage from 'hooks/useMessage';
import { GRBReviewerComparison, GRBReviewerFields } from 'types/grbReview';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';
import { CreateGRBReviewersSchema } from 'validations/grbReviewerSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

type BulkAddGRBReviewersFormProps = {
  systemId: string;
  createGRBReviewers: CreateSystemIntakeGRBReviewersMutationFn;
  grbReviewStartedAt?: string | null;
};

const BulkAddGRBReviewersForm = ({
  systemId,
  createGRBReviewers,
  grbReviewStartedAt
}: BulkAddGRBReviewersFormProps) => {
  const { t } = useTranslation('grbReview');
  const { showMessage, showMessageOnNextPage } = useMessage();
  const history = useHistory();

  /** ID of selected IT Gov request */
  const [activeITGovernanceRequestId, setActiveITGovernanceRequestId] =
    useState<string>();

  const { data, loading } = useGetGRBReviewersComparisonsQuery({
    variables: {
      id: systemId
    }
  });
  const itGovernanceRequests = data?.compareGRBReviewersByIntakeID;

  const { control, watch, handleSubmit } = useEasiForm<{
    grbReviewers: GRBReviewerFields[];
  }>({
    resolver: yupResolver(CreateGRBReviewersSchema)
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'grbReviewers'
  });

  const grbReviewers = watch('grbReviewers');

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  /** Submit form and add GRB reviewers */
  const submit = handleSubmit(({ grbReviewers: reviewers }) =>
    createGRBReviewers({
      variables: {
        input: {
          systemIntakeID: systemId,
          reviewers: reviewers.map(({ userAccount, ...reviewer }) => ({
            ...reviewer,
            euaUserId: userAccount.username
          }))
        }
      }
    })
      .then(() => {
        showMessageOnNextPage(
          <Trans
            i18nKey="grbReview:messages.success.add"
            count={grbReviewers.length}
          />,
          { type: 'success' }
        );
        history.push(grbReviewPath);
      })
      .catch(() => showMessage(t('messages.error.add'), { type: 'error' }))
  );

  /** Array of GRB reviewers from selected IT Gov request */
  const grbReviewersArray: GRBReviewerComparison[] | undefined = useMemo(() => {
    if (!activeITGovernanceRequestId) return undefined;

    return itGovernanceRequests?.find(
      ({ id }) => id === activeITGovernanceRequestId
    )?.reviewers;
  }, [activeITGovernanceRequestId, itGovernanceRequests]);

  /** Checkbox field for toggling GRB reviewer */
  const GRBReviewerCheckbox = useCallback(
    ({ reviewer }: { reviewer: GRBReviewerComparison }) => {
      /** Reviewer index if already added to array */
      const reviewerIndex = grbReviewers.findIndex(
        ({ userAccount }) =>
          userAccount.username === reviewer.userAccount.username
      );

      const { userAccount, grbRole, votingRole, isCurrentReviewer } = reviewer;

      const isChecked: boolean = reviewerIndex > -1;

      const toggleReviewer = () =>
        isChecked
          ? remove(reviewerIndex)
          : append({
              userAccount,
              grbRole,
              votingRole
            });

      return (
        <Checkbox
          className="grb-review-select-checkbox"
          id={`grbReviewSelect-${userAccount.username}`}
          name={`grbReviewSelect-${userAccount.username}`}
          checked={isChecked || isCurrentReviewer}
          label={userAccount.commonName}
          onChange={toggleReviewer}
          // Disable users that have already been added as reviewer
          disabled={isCurrentReviewer}
        />
      );
    },
    [append, remove, grbReviewers]
  );

  const columns = useMemo<Column<GRBReviewerComparison>[]>(() => {
    return [
      {
        Header: (
          <Checkbox
            className="grb-review-select-checkbox grb-review-select-checkbox_header"
            id="grbReviewSelect-header"
            name="grbReviewSelect-header"
            label={t<string>('participantsTable.name')}
            disabled
            checked
          />
        ),
        accessor: 'userAccount',
        Cell: ({
          row: { original: reviewer }
        }: Cell<GRBReviewerComparison>) => (
          <GRBReviewerCheckbox reviewer={reviewer} />
        )
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
      }
    ];
  }, [t, GRBReviewerCheckbox]);

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data: grbReviewersArray || [],
        autoResetSortBy: false,
        autoResetPage: true
      },
      useSortBy
    );

  if (loading || !itGovernanceRequests) return <Spinner />;

  return (
    <Form onSubmit={submit} className="maxw-none">
      <p className="line-height-body-5 margin-top-3 tablet:grid-col-6">
        {t('form.addFromRequestDescription')}
      </p>

      <FormGroup className="tablet:grid-col-6">
        <Label
          htmlFor="itGovernanceRequests"
          className="text-normal margin-bottom-05"
        >
          {t('form.itGovernanceRequests')}
        </Label>
        <HelpText id="itGovernanceRequestsHelpText">
          {t('form.itGovernanceRequestsHelpText')}
        </HelpText>

        <ComboBox
          id="itGovernanceRequests"
          name="itGovernanceRequests"
          className="maxw-none"
          onChange={id => setActiveITGovernanceRequestId(id)}
          options={itGovernanceRequests.map(request => ({
            label: request.requestName,
            value: request.id
          }))}
        />
      </FormGroup>

      <div
        className={
          grbReviewersArray ? 'tablet:grid-col-9' : 'tablet:grid-col-6'
        }
      >
        {grbReviewersArray ? (
          <>
            <p className="margin-top-6">
              <Trans
                i18nKey="grbReview:form.grbReviewerResults"
                count={grbReviewersArray.length}
              />
            </p>

            {/* GRB reviewers table */}
            <Table bordered={false} fullWidth scrollable {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        aria-sort={getColumnSortStatus(column)}
                        scope="col"
                        className="border-bottom-2px"
                      >
                        <Button
                          type="button"
                          unstyled
                          className="width-full display-flex margin-top-0"
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
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        ) : (
          <>
            <Alert type="info" className="margin-top-3" slim>
              {t('form.selectRequestAlert')}
            </Alert>

            <Divider className="margin-top-6" />
          </>
        )}
      </div>

      <Alert type="info" slim className="margin-top-5 tablet:grid-col-6">
        {t(
          grbReviewStartedAt
            ? 'form.infoAlertReviewStarted'
            : 'form.infoAlertReviewNotStarted'
        )}
      </Alert>

      <Pager
        next={{
          text:
            grbReviewers.length > 1
              ? t('form.addReviewer', { count: grbReviewers.length })
              : t('form.addReviewer'),
          disabled: grbReviewers.length === 0
        }}
        taskListUrl={grbReviewPath}
        saveExitText={t('form.returnToRequest', {
          context: 'add'
        })}
        border={false}
        className="margin-top-4"
        submitDisabled
      />
    </Form>
  );
};

export default BulkAddGRBReviewersForm;
