import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Grid, Icon } from '@trussworks/react-uswds';
import {
  GetSystemIntakeContactsDocument,
  SystemIntakeFragmentFragment,
  useDeleteSystemIntakeContactMutation,
  useGetSystemIntakeContactsQuery
} from 'gql/generated/graphql';

import IconButton from 'components/IconButton';
import PageHeading from 'components/PageHeading';
import ReviewRow from 'components/ReviewRow';
import SystemIntakeContactsTable from 'components/SystemIntakeContactsTable';

import { DefinitionCombo } from '../../Decision';

const RequestHome = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation('governanceReviewTeam');

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
        <Link to="/">
          <IconButton icon={<Icon.Add aria-hidden />} type="button" unstyled>
            {t('requestHome.sections.teamInfo.addAnother')}
          </IconButton>
        </Link>
        <SystemIntakeContactsTable
          contacts={data?.systemIntakeContacts?.allContacts}
          loading={loading}
          // className="margin-top-3 padding-top-05 margin-bottom-6"
          // handleEditContact={setContactToEdit}
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
            {/* Insert status here */}
            <Link to="/">
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
            {/* Insert status here */}
            <Link to="/">
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
        <div className="bg-primary-lighter padding-3 padding-bottom-0">
          <h3 className="margin-y-0">
            {t('requestHome.sections.requestSummary.overview.heading')}
          </h3>
          <p className="easi-body-normal margin-y-0">
            {t('requestHome.sections.requestSummary.overview.description')}
          </p>
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
        </div>
      </div>
    </div>
  );
};

export default RequestHome;
