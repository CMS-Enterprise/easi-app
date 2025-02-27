import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Divider from 'components/Divider';
import { SystemProfileSubviewProps } from 'types/systemProfile';
import { showSystemVal } from 'utils/showVal';

import './index.scss';

const SystemSubSystems = ({ system }: SystemProfileSubviewProps) => {
  const { t } = useTranslation('systemProfile');

  const subsystems = system.cedarSubSystems;

  const systemsCountCap = 5;
  const [isSystemsExpanded, setSystemsExpanded] = useState<boolean>(false);
  const showMoreSystemsToggle = subsystems
    ? subsystems.length - systemsCountCap > 0
    : false;

  return (
    <>
      <h2 className="margin-top-0 margin-bottom-4">
        {t('singleSystem.subSystems.header')}
      </h2>
      {subsystems.length ? (
        <>
          <CardGroup className="margin-0">
            {subsystems
              .slice(0, isSystemsExpanded ? undefined : systemsCountCap)
              .map(sub => {
                return (
                  <Card key={sub.id} className="grid-col-12 margin-bottom-2">
                    <CardHeader className="padding-2 padding-bottom-0">
                      <div className="display-flex margin-bottom-105">
                        <div className="flex-fill">
                          <h3 className="margin-y-0 line-height-body-2">
                            {sub.name}
                          </h3>
                        </div>
                      </div>
                      {sub.acronym && (
                        <div className="margin-top-0 margin-bottom-2 font-sans-xs line-height-body-1">
                          {sub.acronym}
                        </div>
                      )}
                    </CardHeader>
                    <CardBody className="padding-2">
                      <div>
                        {showSystemVal(sub.description, {
                          defaultVal: t<string>(
                            'singleSystem.subSystems.noSystemDescription'
                          )
                        })}
                      </div>
                      <Divider className="margin-y-2" />
                      <DescriptionTerm
                        className="margin-bottom-05 line-height-body-1 text-normal"
                        term={t('singleSystem.subSystems.retirementDate')}
                      />
                      <DescriptionDefinition
                        className="font-body-md line-height-body-4"
                        definition={showSystemVal(null)} // Using null until retirement date is available
                      />
                    </CardBody>
                  </Card>
                );
              })}
          </CardGroup>
          {showMoreSystemsToggle && (
            <Button
              unstyled
              type="button"
              className="line-height-body-5"
              onClick={() => {
                setSystemsExpanded(!isSystemsExpanded);
              }}
            >
              {t(
                `singleSystem.subSystems.showSystems.${
                  isSystemsExpanded ? 'less' : 'more'
                }`
              )}
              <Icon.ExpandMore
                className="margin-left-05 margin-bottom-2px text-tbottom"
                style={{
                  transform: isSystemsExpanded ? 'rotate(180deg)' : ''
                }}
              />
            </Button>
          )}
        </>
      ) : (
        <Alert headingLevel="h4" type="info" className="margin-bottom-2">
          {t('singleSystem.subSystems.noSubsystems')}
        </Alert>
      )}
    </>
  );
};

export default SystemSubSystems;
