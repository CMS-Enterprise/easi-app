import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, IconArrowForward } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import { GetGovernanceTaskList_systemIntake as SystemIntake } from 'queries/types/GetGovernanceTaskList';
import { RequestRelationType } from 'types/graphql-global-types';

function AdditionalRequestInfo({ ...system }: SystemIntake) {
  const { t } = useTranslation('itGov');

  return (
    <div>
      <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
        {t('additionalRequestInfo.header')}
      </h4>

      {system.relationType === null && (
        <Alert
          type="warning"
          heading={t('additionalRequestInfo.actionRequiredAlert.header')}
        >
          {t('additionalRequestInfo.actionRequiredAlert.text')}
          <UswdsReactLink to={`/system/link/${system.id}`}>
            {t('additionalRequestInfo.actionRequiredAlert.answer')}
          </UswdsReactLink>
        </Alert>
      )}

      {system.relationType !== null && (
        <p className="text-base margin-top-1 margin-bottom-0">
          {system.relationType === RequestRelationType.EXISTING_SERVICE &&
            t('additionalRequestInfo.existingService')}
          {system.relationType === RequestRelationType.EXISTING_SYSTEM &&
            t('additionalRequestInfo.existingSystem')}
          {system.relationType === RequestRelationType.NEW_SYSTEM &&
            t('additionalRequestInfo.newSystem')}
          <br />
          <UswdsReactLink to={`/system/link/${system.id}`}>
            {t('additionalRequestInfo.edit')}
          </UswdsReactLink>
        </p>
      )}

      {system.systems.length > 0 && (
        <div>
          {system.systems.map(s => (
            <div
              key={s.id}
              className="margin-y-1 padding-3 border-1px box-shadow-2"
            >
              <h4 className="margin-top-0 margin-bottom-1">{s.name}</h4>{' '}
              <span>{s.acronym}</span>
              <Divider className="margin-top-1 margin-bottom-2" />
              <UswdsReactLink to={`/systems/${s.id}`}>
                {t('additionalRequestInfo.viewSystemProfile')}
                <IconArrowForward className="text-middle margin-left-05" />
              </UswdsReactLink>
            </div>
          ))}
        </div>
      )}

      {system.contractName !== null && (
        <p>
          <span className="text-base">
            {t('additionalRequestInfo.contractName')}
          </span>
          <br />
          {system.contractName}
        </p>
      )}

      {system.relationType !== null && (
        <p>
          <span className="text-base">
            {t('additionalRequestInfo.contractNumber')}
          </span>
          <br />
          {system.contractNumbers.length ? (
            system.contractNumbers.map(v => v.contractNumber).join(', ')
          ) : (
            <em className="text-base">
              {t('additionalRequestInfo.noContractNumber')}
            </em>
          )}
        </p>
      )}
    </div>
  );
}

export default AdditionalRequestInfo;
