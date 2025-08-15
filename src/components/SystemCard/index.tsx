import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { SystemRelationshipType } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

export type SystemCardProps = {
  className?: string;
  id: string;
  name: string;
  description: string | null | undefined;
  acronym: string | null | undefined;
  businessOwnerOrg: string | null | undefined;
  businessOwners: string | null | undefined;
  systemRelationshipType?: SystemRelationshipType[];
  otherSystemRelationshipDescription?: string;
};

const SystemCard = ({
  className,
  id,
  name,
  description,
  acronym,
  businessOwnerOrg,
  businessOwners,
  systemRelationshipType,
  otherSystemRelationshipDescription
}: SystemCardProps) => {
  const { t } = useTranslation('admin');

  return (
    <Card
      data-testid="system-card"
      className={classnames('grid-col-12 system-card', className)}
    >
      <Grid mobile={{ col: 12 }}>
        <div className="system-card__header">
          <h3 className="system-card__title margin-top-0 margin-bottom-1">
            {name}
          </h3>
          {acronym && <p className="margin-0 margin-left-1">({acronym})</p>}
        </div>

        {!!systemRelationshipType && (
          <div className="bg-primary-lighter margin-bottom-1 padding-y-105 padding-right-105">
            <ul className="margin-y-0">
              {systemRelationshipType.map(type => (
                <li key={type}>
                  {t(`linkedSystems:relationshipTypes.${type}`)}
                  {type === SystemRelationshipType.OTHER &&
                    ` (${otherSystemRelationshipDescription})`}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="system-card__body-text line-height-body-4">
          {description}
        </p>

        <dl>
          <Grid row className="margin-bottom-2">
            <Grid tablet={{ col: 6 }}>
              <DescriptionTerm term={t('component')} />
              <DescriptionDefinition definition={businessOwnerOrg} />
            </Grid>

            <Grid tablet={{ col: 6 }}>
              <DescriptionTerm term={t('businessOwner')} />
              <DescriptionDefinition definition={businessOwners} />
            </Grid>
          </Grid>
        </dl>

        <Divider className="margin-bottom-2" />

        <UswdsReactLink
          to={`/systems/${id}/home/top`}
          className="display-flex flex-align-center"
        >
          {t('viewSystem')}
          <Icon.ArrowForward className="margin-left-1" aria-hidden />
        </UswdsReactLink>
      </Grid>
    </Card>
  );
};

export default SystemCard;
