import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Grid, GridContainer, SiteAlert } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import MainContent from 'components/MainContent';

import './index.scss';

// Authenticated paths to render the <ServiceAlert /> banner
const alertPaths: string[] = [
  '/',
  '/systems',
  '/system/making-a-request',
  '/trb',
  '/help'
];

type ServiceAlertType = {
  translationKey: string; // Translation file key for accessing banner heading and content
  landing?: boolean; // Styling adjustment for landing page
  className?: string;
};

const ServiceAlert = ({
  translationKey,
  landing,
  className
}: ServiceAlertType) => {
  const { t } = useTranslation('serviceAlert');
  const { pathname } = useLocation();
  const { serviceAlertEnabled } = useFlags();

  if (!alertPaths.includes(pathname) || !serviceAlertEnabled) {
    return null;
  }

  return (
    <MainContent className={classNames('bg-emergency', className)}>
      <GridContainer
        className={classNames({
          'service-alert__landing': landing,
          'padding-x-0': !landing
        })}
      >
        <Grid desktop={{ col: 12 }} className="padding-y-1">
          <SiteAlert
            variant="emergency"
            slim
            heading={t(`${translationKey}.heading`)}
          >
            <p className="margin-y-0">{t(`${translationKey}.content`)}</p>
          </SiteAlert>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ServiceAlert;
