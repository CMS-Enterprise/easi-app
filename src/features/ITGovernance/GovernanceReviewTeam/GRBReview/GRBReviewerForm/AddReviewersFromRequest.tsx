import React, { useCallback, useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  CellProps,
  Column,
  HeaderGroup,
  useSortBy,
  useTable
} from 'react-table';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  ComboBox,
  Form,
  FormGroup,
  Table
} from '@trussworks/react-uswds';
import Pager from 'features/TechnicalReviewBoard/RequestForm/Pager';
import { useGetGRBReviewersComparisonsQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Divider from 'components/Divider';
import { useEasiForm } from 'components/EasiForm';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import Spinner from 'components/Spinner';
import { GRBReviewerComparison, GRBReviewerFields } from 'types/grbReview';
import { getColumnSortStatus, getHeaderSortIcon } from 'utils/tableSort';
import { CreateGRBReviewersSchema } from 'validations/grbReviewerSchema';

type AddReviewersFromRequestProps = {
  systemId: string;
  createGRBReviewers: (reviewers: GRBReviewerFields[]) => Promise<void>;
  grbReviewStartedAt?: string | null;
};

/** Form to add multiple GRB Reviewers from existing IT Governance request */
const AddReviewersFromRequest = ({
  systemId,
  createGRBReviewers,
  grbReviewStartedAt
}: AddReviewersFromRequestProps) => {
  const { t } = useTranslation('grbReview');

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

  const { append, remove, replace } = useFieldArray({
    control,
    name: 'grbReviewers'
  });

  const grbReviewers = watch('grbReviewers');

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  /** Array of GRB reviewers from selected IT Gov request */
  const grbReviewersArray: GRBReviewerComparison[] | undefined = useMemo(() => {
    if (!activeITGovernanceRequestId) return undefined;

    return itGovernanceRequests?.find(
      ({ id }) => id === activeITGovernanceRequestId
    )?.reviewers;
  }, [activeITGovernanceRequestId, itGovernanceRequests]);

  /** Reviewers that have NOT already been added to this Intake Request */
  const availableReviewers: GRBReviewerComparison[] = useMemo(() => {
    return (
      grbReviewersArray?.filter(reviewer => !reviewer.isCurrentReviewer) || []
    );
  }, [grbReviewersArray]);

  /** Checkbox header to toggle select all GRB reviewers */
  const SelectAllCheckbox = useCallback(
    ({ column }: { column: HeaderGroup<GRBReviewerComparison> }) => {
      const isChecked: boolean =
        grbReviewers?.length > 0 &&
        grbReviewers?.length === availableReviewers.length;

      const toggleSelectAll = () => {
        if (isChecked) return remove();

        return replace(
          availableReviewers.map(
            ({ id, isCurrentReviewer, ...reviewer }) => reviewer
          )
        );
      };

      return (
        <div className="grb-review-select-checkbox grb-review-select-checkbox__header usa-checkbox position-relative">
          <input
            className="usa-checkbox__input"
            type="checkbox"
            id="grbReviewSelect-header"
            name="grbReviewSelect-header"
            checked={isChecked}
            onChange={toggleSelectAll}
            aria-label={t('Toggle select all reviewers')}
          />

          <label
            className="usa-checkbox__label margin-top-0"
            htmlFor="grbReviewSelect-header"
          >
            {t('participantsTable.name')}
          </label>

          {/* Button for toggling column sort */}
          <Button
            className="margin-top-0 position-absolute top-0 bottom-0 width-full display-flex flex-justify-end"
            type="button"
            aria-label={t('Toggle sort by name')}
            unstyled
            {...column.getSortByToggleProps()}
          >
            <div className="width-205 margin-top-05">
              {getHeaderSortIcon(column)}
            </div>
          </Button>
        </div>
      );
    },
    [t, availableReviewers, grbReviewers?.length, remove, replace]
  );

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
        Header: (props: any) => {
          const { column } = props;
          return <SelectAllCheckbox column={column} />;
        },
        accessor: 'userAccount',
        Cell: ({
          row: { original: reviewer }
        }: CellProps<GRBReviewerComparison>) => (
          <GRBReviewerCheckbox reviewer={reviewer} />
        )
      },
      {
        Header: t<string>('participantsTable.votingRole'),
        accessor: 'votingRole',
        Cell: (cell: CellProps<GRBReviewerComparison>) => {
          const { value } = cell;
          return <>{t<string>(`votingRoles.${value}`)}</>;
        }
      },
      {
        Header: t<string>('participantsTable.grbRole'),
        accessor: 'grbRole',
        Cell: (cell: CellProps<GRBReviewerComparison>) => {
          const { value } = cell;
          return <>{t<string>(`reviewerRoles.${value}`)}</>;
        }
      }
    ];
  }, [t, GRBReviewerCheckbox, SelectAllCheckbox]);

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
    <Form
      onSubmit={handleSubmit(values => createGRBReviewers(values.grbReviewers))}
      className="maxw-none"
    >
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
                        {...column.getHeaderProps()}
                        aria-sort={getColumnSortStatus(column)}
                        scope="col"
                        className="border-bottom-2px"
                      >
                        {column.id === 'userAccount' ? (
                          // Name column header with checkbox
                          column.render('Header')
                        ) : (
                          <Button
                            type="button"
                            unstyled
                            {...column.getSortByToggleProps()}
                          >
                            {column.render('Header')}
                            {getHeaderSortIcon(column)}
                          </Button>
                        )}
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
          text: t('form.submit', {
            context: 'add',
            count: grbReviewers.length > 1 ? grbReviewers.length : 1
          }),
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

export default AddReviewersFromRequest;
