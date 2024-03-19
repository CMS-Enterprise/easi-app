import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import SystemCardTable from 'components/SystemCard/table';
import { GetTrbRequestSummary_trbRequest as TrbRequest } from 'queries/types/GetTrbRequestSummary';

const AdditionalInformation = ({ trbRequest }: { trbRequest: TrbRequest }) => {
  const { t } = useTranslation('technicalAssistance');

  return (
    <div>
      <PageHeading className="margin-y-0">
        {t('additionalInformation.title')}
      </PageHeading>

      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-1">
        {t('additionalInformation.description')}
      </p>

      {(trbRequest.systems.length > 0 || trbRequest.contractName) && (
        <div className="margin-bottom-3">
          <span className="font-body-md line-height-body-4 margin-right-1 text-base">
            {t('additionalInformation.somethingIncorrect')}
          </span>

          <UswdsReactLink
            to={`/trb/${trbRequest.id}/additional-information/link`}
          >
            {t('additionalInformation.editInformation')}
          </UswdsReactLink>
        </div>
      )}

      {trbRequest.systems.length > 0 && (
        <SystemCardTable systems={trbRequest.systems} />
      )}

      {trbRequest.contractName && (
        <div className="margin-top-3">
          <strong>{t('additionalInformation.serviceOrContract')}</strong>

          <p className="margin-top-1">{trbRequest.contractName}</p>
        </div>
      )}

      {trbRequest.systems.length === 0 && !trbRequest.contractName && (
        <div className="margin-top-3">
          <Alert type="info" slim className="margin-top-0 margin-bottom-2">
            {t('additionalInformation.noLinkedSystemAlert')}
          </Alert>
          <UswdsReactLink
            to={`/trb/${trbRequest.id}/additional-information/link`}
            className="usa-button usa-button--outline"
          >
            {t('additionalInformation.linkSystem')}
          </UswdsReactLink>
        </div>
      )}

      {trbRequest.contractNumbers.length > 0 && (
        <div className="margin-top-3">
          <strong>
            {t('additionalInformation.contractNumber', {
              plural: trbRequest.contractNumbers.length > 1 ? 's' : ''
            })}
          </strong>
          <p className="margin-top-1">
            {trbRequest.contractNumbers
              .map(contract => contract.contractNumber)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdditionalInformation;
