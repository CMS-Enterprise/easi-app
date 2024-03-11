import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid, IconArrowForward } from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';

import './index.scss';

export type SystemCardProps = {
  className?: string;
  id: string;
  name: string;
  description: string | null;
  acronym: string | null;
  businessOwnerOrg: string | null;
  businessOwners: string | null;
};

const SystemCard = ({
  className,
  id,
  name,
  description,
  acronym,
  businessOwnerOrg,
  businessOwners
}: SystemCardProps) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <Card
      data-testid="system-card"
      className={classnames('grid-col-12 system-card', className)}
    >
      <Grid mobile={{ col: 12 }}>
        <div className="system-card__header easi-header__basic">
          <h3 className="system-card__title margin-top-0 margin-bottom-1">
            {name}
          </h3>
        </div>

        <p className="margin-0">{acronym}</p>

        <p className="system-card__body-text line-height-body-4">
          {description}
        </p>

        <dl>
          <Grid row className="margin-bottom-2">
            <Grid tablet={{ col: 6 }}>
              <DescriptionTerm term={t('additionalInformation.component')} />
              <DescriptionDefinition definition={businessOwnerOrg} />
            </Grid>

            <Grid tablet={{ col: 6 }}>
              <DescriptionTerm
                term={t('additionalInformation.businessOwner')}
              />
              <DescriptionDefinition definition={businessOwners} />
            </Grid>
          </Grid>
        </dl>

        <Divider className="margin-bottom-2" />

        <UswdsReactLink
          to={`/systems/${id}/home/top`}
          className="display-flex flex-align-center"
        >
          {t('additionalInformation.viewSystem')}
          <IconArrowForward className="margin-left-1" />
        </UswdsReactLink>
      </Grid>
    </Card>
  );
};

export default SystemCard;
