import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid } from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';

import './index.scss';

type SystemCardProps = {
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
  const { t } = useTranslation();

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

        <Grid row className="margin-bottom-2">
          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm term="CMS component owner" />
            <DescriptionDefinition definition={businessOwnerOrg || ''} />
          </Grid>

          <Grid desktop={{ col: 6 }}>
            <DescriptionTerm term="Business Owner" />
            <DescriptionDefinition definition="Patrick Segura" />
          </Grid>
        </Grid>

        <Divider className="margin-bottom-2" />

        <UswdsReactLink to={`/systems/${id}/home/top`}>
          View system profile
        </UswdsReactLink>
      </Grid>
    </Card>
  );
};

export default SystemCard;
