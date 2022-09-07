import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import { Grid, Link } from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

type TechnicalAssistanceProps = {};

// eslint-disable-next-line no-empty-pattern
function TechnicalAssistance({}: TechnicalAssistanceProps) {
  const { t } = useTranslation('technicalAssistance');
  const { url } = useRouteMatch();
  return (
    <MainContent className="technical-assistance grid-container">
      <Grid row>
        <Grid>
          <PageHeading>{t('heading')}</PageHeading>
          <Link
            href={`${url}/request-type`}
            className="usa-button"
            variant="unstyled"
          >
            {t('nextStep')}
          </Link>
        </Grid>
      </Grid>
    </MainContent>
  );
}

export default TechnicalAssistance;
