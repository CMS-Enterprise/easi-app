import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Grid, GridContainer, IconError } from '@trussworks/react-uswds';
import classNames from 'classnames';

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

  if (!alertPaths.includes(pathname)) {
    return null;
  }

  return (
    <MainContent className={classNames('bg-emergency', className)}>
      <GridContainer
        className={classNames({
          'service-alert__landing padding-x-4': landing
        })}
      >
        <Grid desktop={{ col: 12 }}>
          <div className="bg-emergency display-flex text-white padding-y-2 line-height-mono-4">
            <div className="margin-right-2 width-4 service-alert__icon">
              <IconError size={4} />
            </div>
            <div>
              <h3 className="margin-0">{t(`${translationKey}.heading`)}</h3>

              <p className="margin-y-0">{t(`${translationKey}.content`)}</p>
            </div>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ServiceAlert;
