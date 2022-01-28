import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardGroup, Grid } from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

type SystemHomeProps = {
  className?: string;
  children?: React.ReactNode;
  system: CedarSystemProps;
};

const SystemHome = ({ className, children, system }: SystemHomeProps) => {
  const { t } = useTranslation('systemProfile');
  return (
    <Grid className="grid-container">
      <Grid row>
        <Grid desktop={{ col: 9 }}>
          <CardGroup>
            <Card
              data-testid="system-card"
              className={classnames('grid-col-12', className)}
            >
              <div className="grid-col-12">{children}</div>
            </Card>
          </CardGroup>
        </Grid>
        {/* Point of contact/ miscellaneous info */}
        <Grid desktop={{ col: 3 }}>
          <div className="top-divider" />
          <p>{t('singleSystem.pointOfContact')}</p>
          <DescriptionTerm
            className="system-profile__subheader"
            term={system.businessOwnerOrgComp || ''}
          />
          <DescriptionDefinition
            definition={t('singleSystem.summary.subheader2')}
          />
          <p>
            <UswdsReactLink
              aria-label={t('singleSystem.sendEmail')}
              className="line-height-body-5"
              to="/" // TODO: Get link from CEDAR?
              variant="external"
              target="_blank"
            >
              {t('singleSystem.sendEmail')}
              <span aria-hidden>&nbsp;</span>
            </UswdsReactLink>
          </p>
          <p>
            <UswdsReactLink
              aria-label={t('singleSystem.moreContact')}
              className="line-height-body-5"
              to="/" // TODO: Get link from CEDAR?
              variant="external"
              target="_blank"
            >
              {t('singleSystem.moreContact')}
              <span aria-hidden>&nbsp;</span>
            </UswdsReactLink>
          </p>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SystemHome;
