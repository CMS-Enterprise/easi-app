import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

/**
 * The last form step for confirmation.
 * This component does not use `FormStepHeader` or `Pager` like
 * the other `FormStepComponent`s.
 */
function Done({ breadcrumbBar }: { breadcrumbBar: React.ReactNode }) {
  const { t } = useTranslation('technicalAssistance');

  return (
    <div className="bg-success-lighter padding-bottom-6">
      <GridContainer>
        <Grid row>
          <Grid col>
            {breadcrumbBar}

            <PageHeading className="margin-bottom-0">
              {t('done.success.heading')}
            </PageHeading>
            <div className="font-body-lg line-height-body-5 text-light">
              {t('done.success.info')}
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </div>
  );
}

export default Done;
