import React from 'react';
import { useTranslation } from 'react-i18next';

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

      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-2">
        {t('additionalInformation.description')}
      </p>

      <div className="margin-bottom-4">
        <span className="font-body-md line-height-body-4 margin-right-1 text-base">
          {t('additionalInformation.somethingIncorrect')}
        </span>

        <UswdsReactLink to={`/system/link/${systemIntake.id}`}>
          {t('additionalInformation.editInformation')}
        </UswdsReactLink>
      </div>

      <SystemCardTable systems={systemIntake.systems} />

      {systemIntake.contract?.number && (
        <div className="margin-top-4">
          <strong>
            {t('additionalInformation.contractNumber', {
              count: systemIntake.contract?.number.split(',').length
            })}
          </strong>
          <p className="margin-top-1">{systemIntake.contract?.number}</p>
        </div>
      )}
    </div>
  );
};

export default AdditionalInformation;
