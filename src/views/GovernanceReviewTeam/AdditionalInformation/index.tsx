import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import SystemCardTable from 'components/SystemCard/table';
import { SystemIntake } from 'queries/types/SystemIntake';

const AdditionalInformation = ({
  systemIntake
}: {
  systemIntake: SystemIntake;
}) => {
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <div>
      <PageHeading className="margin-y-0">
        {t('additionalInformation.title')}
      </PageHeading>

      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-1">
        {t('additionalInformation.description')}
      </p>

      {systemIntake.systems.length > 0 && (
        <>
          <div className="margin-bottom-3">
            <span className="font-body-md line-height-body-4 margin-right-1 text-base">
              {t('additionalInformation.somethingIncorrect')}
            </span>

            <UswdsReactLink to={`/system/link/${systemIntake.id}`}>
              {t('additionalInformation.editInformation')}
            </UswdsReactLink>
          </div>

          <SystemCardTable systems={systemIntake.systems} />
        </>
      )}

      {systemIntake.systems.length === 0 && !systemIntake.contractName && (
        <div className="margin-top-3">
          <Alert type="info" slim className="margin-top-0 margin-bottom-2">
            {t('additionalInformation.noLinkedSystemAlert')}
          </Alert>
          <UswdsReactLink
            to={`/system/link/${systemIntake.id}`}
            className="usa-button usa-button--outline"
          >
            {t('additionalInformation.linkSystem')}
          </UswdsReactLink>
        </div>
      )}

      {systemIntake.contractName && (
        <div className="margin-top-3">
          <strong>{t('additionalInformation.serviceOrContract')}</strong>
          <p className="margin-top-1">{systemIntake.contractName}</p>
        </div>
      )}

      {systemIntake.contract?.number && (
        <div className="margin-top-3">
          <strong>
            {t('additionalInformation.contractNumber', {
              plural:
                systemIntake.contract?.number.split(',').length > 1 ? 's' : ''
            })}
          </strong>
          <p className="margin-top-1">{systemIntake.contract?.number}</p>
        </div>
      )}
    </div>
  );
};

export default AdditionalInformation;
