import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Grid, Icon } from '@trussworks/react-uswds';
import {
  GetSystemIntakeContactsDocument,
  SystemIntakeFragmentFragment,
  useDeleteSystemIntakeContactMutation,
  useGetSystemIntakeContactsQuery
} from 'gql/generated/graphql';

import CollapsableLink from 'components/CollapsableLink';
import IconLink from 'components/IconLink';
import PageHeading from 'components/PageHeading';
import ReviewRow from 'components/ReviewRow';
import SystemIntakeContactsTable from 'components/SystemIntakeContactsTable';
import TaskStatusTag from 'components/TaskStatusTag';
import useMessage from 'hooks/useMessage';

import { DefinitionCombo } from '../Decision';

const RequestHome = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation('requestHome');
  const { showMessage, showErrorMessageInModal } = useMessage();

  const { data, loading } = useGetSystemIntakeContactsQuery({
    variables: {
      id: systemIntake.id
    }
  });

  const [removeContact] = useDeleteSystemIntakeContactMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeContactsDocument,
        variables: { id: systemIntake.id }
      }
    ]
  });

  const handleRemoveContact = (id: string) =>
    removeContact({ variables: { input: { id } } })
      .then(() => {
        showMessage(t('requestHome:pocRemoval.success'), {
          type: 'success'
        });
      })
      .catch(() => {
        showErrorMessageInModal(t('requestHome:pocRemoval.error'));
      });

  const history = useHistory();

  const bizCaseStatusToRender = ['DONE', 'NOT_NEEDED', 'SUBMITTED'].includes(
    systemIntake.itGovTaskStatuses.bizCaseDraftStatus
  )
    ? systemIntake.itGovTaskStatuses.bizCaseFinalStatus
    : systemIntake.itGovTaskStatuses.bizCaseDraftStatus;

  return (
    <div data-testid="request-home">
      <div className="margin-bottom-6">
        <PageHeading className="margin-y-0">
          {t('requestHome.title')}
        </PageHeading>
        <p className="easi-body-medium margin-y-0">
          {t('requestHome.description')}
        </p>
      </div>

      {/* Project team and POC section */}
      <div className="margin-y-4 padding-bottom-6 border-bottom-1px border-base-light">
        <h2 className="margin-bottom-0">
          {t('requestHome.sections.teamInfo.heading')}
        </h2>
        <p className="easi-body-medium margin-top-0 margin-bottom-2">
          {t('requestHome.sections.teamInfo.description')}
        </p>
        <IconLink
          to={`/it-governance/${systemIntake.id}/add-point-of-contact`}
          icon={<Icon.Add aria-hidden />}
        >
          {t('requestHome.sections.teamInfo.addAnother')}
        </IconLink>
        <SystemIntakeContactsTable
          contacts={data?.systemIntakeContacts?.allContacts}
          loading={loading}
          handleEditContact={contact => {
            history.push({
              pathname: `/it-governance/${systemIntake.id}/edit-point-of-contact`,
              state: { contact }
            });
          }}
          removeContact={handleRemoveContact}
          pageSize={5}
        />
      </div>

      {/* Request summary section */}
      <div className="margin-y-4">
        <h2 className="margin-bottom-4">
          {t('requestHome.sections.requestSummary.heading')}
        </h2>
        <Grid row className="margin-bottom-4">
          <div className="tablet:grid-col-6 margin-bottom-2 tablet:margin-bottom-0">
            <p className="text-bold margin-top-0 margin-bottom-1">
              {t('requestHome.sections.requestSummary.intakeRequestForm.title')}
            </p>
            <div className="margin-top-1 margin-bottom-2">
              <TaskStatusTag
                status={systemIntake.itGovTaskStatuses.intakeFormStatus}
              />
            </div>

            <IconLink
              to={`/it-governance/${systemIntake.id}/intake-request`}
              icon={<Icon.ArrowForward aria-hidden />}
              iconPosition="after"
            >
              {t('requestHome.sections.requestSummary.intakeRequestForm.view')}
            </IconLink>
          </div>
          <div className="tablet:grid-col-6">
            <p className="text-bold margin-top-0 margin-bottom-1">
              {t('requestHome.sections.requestSummary.businessCase.title')}
            </p>
            <div className="margin-top-1 margin-bottom-2">
              <TaskStatusTag status={bizCaseStatusToRender} />
            </div>
            <IconLink
              to={`/it-governance/${systemIntake.id}/business-case`}
              icon={<Icon.ArrowForward aria-hidden />}
              iconPosition="after"
            >
              {t('requestHome.sections.requestSummary.businessCase.view')}
            </IconLink>
          </div>
        </Grid>

        {/* Intake request form overview */}
        <div className="bg-primary-lighter padding-3">
          <h3 className="margin-y-0">
            {t('requestHome.sections.requestSummary.overview.heading')}
          </h3>
          <p className="easi-body-normal margin-y-0">
            {t('requestHome.sections.requestSummary.overview.description')}
          </p>
          <CollapsableLink
            className="margin-top-1 padding-bottom-0"
            id="request-home-summary"
            label={t('requestHome.sections.requestSummary.overview.showMore')}
            closeLabel={t(
              'requestHome.sections.requestSummary.overview.showLess'
            )}
            styleLeftBar={false}
            bold={false}
          >
            <div className="padding-top-3">
              <DefinitionCombo
                term={t('intake:review.businessNeed')}
                definition={
                  systemIntake.businessNeed ??
                  t('grbReview:businessCaseOverview.noSolution')
                }
              />
              <DefinitionCombo
                term={t('intake:review.solving')}
                definition={
                  systemIntake.businessSolution ??
                  t('grbReview:businessCaseOverview.noSolution')
                }
              />
              <DefinitionCombo
                term={t('intake:review.process')}
                definition={
                  systemIntake.currentStage ??
                  t('grbReview:businessCaseOverview.noSolution')
                }
              />
              <ReviewRow className="margin-bottom-0">
                <div>
                  <DefinitionCombo
                    term={t('intake:review.currentAnnualSpending')}
                    definition={
                      systemIntake.annualSpending?.currentAnnualSpending ??
                      t('grbReview:businessCaseOverview.noSolution')
                    }
                  />
                </div>
                <div>
                  <DefinitionCombo
                    term={t('intake:review.currentAnnualSpendingITPortion')}
                    definition={
                      systemIntake.annualSpending
                        ?.currentAnnualSpendingITPortion ??
                      t('grbReview:businessCaseOverview.noSolution')
                    }
                  />
                </div>
              </ReviewRow>
              <ReviewRow className="margin-bottom-0">
                <div>
                  <DefinitionCombo
                    term={t('intake:review.plannedYearOneSpending')}
                    className="margin-bottom-0"
                    definition={
                      systemIntake.annualSpending?.plannedYearOneSpending ??
                      t('grbReview:businessCaseOverview.noSolution')
                    }
                  />
                </div>
                <div>
                  <DefinitionCombo
                    term={t('intake:review.plannedYearOneSpendingITPortion')}
                    className="margin-bottom-0"
                    definition={
                      systemIntake.annualSpending
                        ?.plannedYearOneSpendingITPortion ??
                      t('grbReview:businessCaseOverview.noSolution')
                    }
                  />
                </div>
              </ReviewRow>
            </div>
          </CollapsableLink>
        </div>
      </div>
    </div>
  );
};

export default RequestHome;
