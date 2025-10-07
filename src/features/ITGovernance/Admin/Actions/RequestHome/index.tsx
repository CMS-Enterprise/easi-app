import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Grid, Icon } from '@trussworks/react-uswds';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import IconButton from 'components/IconButton';
import PageHeading from 'components/PageHeading';

const RequestHome = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation('governanceReviewTeam');

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
        <p className="easi-body-medium margin-y-0">
          {t('requestHome.sections.teamInfo.description')}
        </p>
      </div>

      {/* Request summary section */}
      <div className="margin-y-4">
        <h2 className="margin-bottom-4">
          {t('requestHome.sections.requestSummary.heading')}
        </h2>
        <Grid row>
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
      </div>
    </div>
  );
};

export default RequestHome;
