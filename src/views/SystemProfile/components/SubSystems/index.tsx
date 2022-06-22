import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  IconBookmark
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import Divider from 'components/shared/Divider';
import { SystemProfileSubviewProps } from 'types/systemProfile';

import './index.scss';

const SystemSubSystems = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');
  return (
    <>
      <h2 className="margin-top-0 margin-bottom-4">
        {t('singleSystem.subSystems.header')}
      </h2>
      <CardGroup className="margin-0">
        {system.subSystems?.map(sub => {
          return (
            <Card key={sub.id} className="grid-col-12 margin-bottom-2">
              <CardHeader className="padding-2 padding-bottom-0">
                <div className="display-flex margin-bottom-105">
                  <div className="flex-fill">
                    <h3 className="margin-y-0 line-height-body-2">
                      <UswdsReactLink to="/">{sub.name}</UswdsReactLink>
                    </h3>
                  </div>
                  <div className="flex-auto">
                    <IconBookmark size={4} className="bookmark__icon" />
                  </div>
                </div>
                <div className="margin-top-0 margin-bottom-2 font-sans-xs line-height-body-1">
                  {sub.acronym}
                </div>
              </CardHeader>
              <CardBody className="padding-2">
                <div>{sub.description}</div>
                <Divider className="margin-y-2" />
                <DescriptionTerm
                  className="margin-bottom-05 font-body-xs line-height-body-1 text-normal"
                  term={t('singleSystem.subSystems.retirementDate')}
                />
                <DescriptionDefinition
                  className="font-body-md line-height-body-4 text-bold"
                  definition={sub.retirementDate}
                />
              </CardBody>
            </Card>
          );
        })}
      </CardGroup>
    </>
  );
};

export default SystemSubSystems;
