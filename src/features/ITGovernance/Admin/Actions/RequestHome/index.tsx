import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Grid, Icon } from '@trussworks/react-uswds';
import {
  GetSystemIntakeContactsDocument,
  SystemIntakeContactFragment,
  SystemIntakeFragmentFragment,
  useDeleteSystemIntakeContactMutation,
  useGetSystemIntakeContactsQuery
} from 'gql/generated/graphql';

import IconButton from 'components/IconButton';
import PageHeading from 'components/PageHeading';
import ReviewRow from 'components/ReviewRow';
import SystemIntakeContactsTable from 'components/SystemIntakeContactsTable';
import TaskStatusTag from 'components/TaskStatusTag';

import { DefinitionCombo } from '../../Decision';

const RequestHome = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation('requestHome');

  const [expandedOverview, setExpandedOverview] = useState(false);
  const [contactToEdit, setContactToEdit] =
    useState<SystemIntakeContactFragment | null>(null);

  console.log(contactToEdit);

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
        <Link to="add-point-of-contact">
          <IconButton icon={<Icon.Add aria-hidden />} type="button" unstyled>
            {t('requestHome.sections.teamInfo.addAnother')}
          </IconButton>
        </Link>
        <SystemIntakeContactsTable
          contacts={data?.systemIntakeContacts?.allContacts}
          loading={loading}
          // className="margin-top-3 padding-top-05 margin-bottom-6"
          // handleEditContact={() => {
          //   setContactToEdit();
          //   history.push()
          // } }
          handleEditContact={contact => {
            setContactToEdit(contact);
            history.push({
              pathname: 'edit-point-of-contact',
              state: { contact }
            });
          }}
          removeContact={id => removeContact({ variables: { input: { id } } })}
        />
      </div>

      {/* Request summary section */}
      <div className="margin-y-4">
        <h2 className="margin-bottom-4">
          {t('requestHome.sections.requestSummary.heading')}
        </h2>
        <Grid row className="margin-bottom-4">
          <div className="tablet:grid-col-6">
            <p className="text-bold margin-top-0 margin-bottom-1">
              {t('requestHome.sections.requestSummary.intakeRequestForm.title')}
            </p>
            <div className="margin-y-1">
              <TaskStatusTag
                status={systemIntake.itGovTaskStatuses.intakeFormStatus}
              />
            </div>
            <Link to={`/it-governance/${systemIntake.id}/intake-request`}>
              <IconButton
                icon={<Icon.ArrowForward aria-hidden />}
                type="button"
                unstyled
                iconPosition="after"
              >
                {t(
                  'requestHome.sections.requestSummary.intakeRequestForm.view'
                )}
              </IconButton>
            </Link>
          </div>
          <div className="tablet:grid-col-6">
            <p className="text-bold margin-top-0 margin-bottom-1">
              {t('requestHome.sections.requestSummary.businessCase.title')}
            </p>
            <div className="margin-y-1">
              <TaskStatusTag status={bizCaseStatusToRender} />
            </div>
            <Link to={`/it-governance/${systemIntake.id}/business-case`}>
              <IconButton
                icon={<Icon.ArrowForward aria-hidden />}
                type="button"
                unstyled
                iconPosition="after"
              >
                {t('requestHome.sections.requestSummary.businessCase.view')}
              </IconButton>
            </Link>
          </div>
        </Grid>

        {/* Intake request form overview */}
        <div
          // Conditional rendering padding class to adjust padding becuase RichTextViewer adds a padding at the bottom
          className={`bg-primary-lighter padding-3 ${expandedOverview ? 'padding-bottom-0' : ''}`}
        >
          <h3 className="margin-y-0">
            {t('requestHome.sections.requestSummary.overview.heading')}
          </h3>
          <p className="easi-body-normal margin-y-0">
            {t('requestHome.sections.requestSummary.overview.description')}
          </p>
          <IconButton
            type="button"
            unstyled
            className="margin-top-1"
            onClick={() => setExpandedOverview(!expandedOverview)}
            icon={
              expandedOverview ? (
                <Icon.ExpandLess aria-hidden />
              ) : (
                <Icon.ExpandMore aria-hidden />
              )
            }
          >
            {expandedOverview
              ? t('requestHome.sections.requestSummary.overview.showLess')
              : t('requestHome.sections.requestSummary.overview.showMore')}
          </IconButton>
          {expandedOverview && (
            <div className="padding-top-3">
              <DefinitionCombo
                term={t('intake:review.businessNeed')}
                definition={
                  systemIntake.businessNeed ??
                  t('grbReview.businessCaseOverview.noSolution')
                }
              />
              <DefinitionCombo
                term={t('intake:review.solving')}
                definition={
                  systemIntake.businessSolution ??
                  t('grbReview.businessCaseOverview.noSolution')
                }
              />
              <DefinitionCombo
                term={t('intake:review.process')}
                definition={
                  systemIntake.currentStage ??
                  t('grbReview.businessCaseOverview.noSolution')
                }
              />
              <ReviewRow>
                <div>
                  <DefinitionCombo
                    term={t('intake:review.currentAnnualSpending')}
                    definition={
                      systemIntake.annualSpending?.currentAnnualSpending ??
                      t('grbReview.businessCaseOverview.noSolution')
                    }
                  />
                </div>
                <div>
                  <DefinitionCombo
                    term={t('intake:review.currentAnnualSpendingITPortion')}
                    definition={
                      systemIntake.annualSpending
                        ?.currentAnnualSpendingITPortion ??
                      t('grbReview.businessCaseOverview.noSolution')
                    }
                  />
                </div>
              </ReviewRow>
              <ReviewRow>
                <div>
                  <DefinitionCombo
                    term={t('intake:review.plannedYearOneSpending')}
                    definition={
                      systemIntake.annualSpending?.plannedYearOneSpending ??
                      t('grbReview.businessCaseOverview.noSolution')
                    }
                  />
                </div>
                <div>
                  <DefinitionCombo
                    term={t('intake:review.plannedYearOneSpendingITPortion')}
                    definition={
                      systemIntake.annualSpending
                        ?.plannedYearOneSpendingITPortion ??
                      t('grbReview.businessCaseOverview.noSolution')
                    }
                  />
                </div>
              </ReviewRow>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestHome;
