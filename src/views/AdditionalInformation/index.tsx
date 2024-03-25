import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import SystemCardTable from 'components/SystemCard/table';
import { GetTrbRequestSummary_trbRequest as TrbRequest } from 'queries/types/GetTrbRequestSummary';
import { SystemIntake } from 'queries/types/SystemIntake';
import { RequestType } from 'types/requestType';
import formatContractNumbers from 'utils/formatContractNumbers';

const AdditionalInformation = ({
  request,
  type
}: {
  request: TrbRequest | SystemIntake;
  type: RequestType;
}) => {
  const { t } = useTranslation('admin');

  const parentRoute = type === 'itgov' ? 'governance-review-team' : 'trb';

  return (
    <div>
      <PageHeading className="margin-y-0">{t('title')}</PageHeading>

      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-1">
        {t('description')}
      </p>

      {(request.systems.length > 0 || request.contractName) && (
        <div className="margin-bottom-3">
          <span className="font-body-md line-height-body-4 margin-right-1 text-base">
            {t('somethingIncorrect')}
          </span>

          <UswdsReactLink
            to={`/${parentRoute}/${request.id}/additional-information/link`}
          >
            {t('editInformation')}
          </UswdsReactLink>
        </div>
      )}

      {request.systems.length > 0 && (
        <SystemCardTable systems={request.systems} />
      )}

      {request.contractName && (
        <div className="margin-top-3">
          <strong>{t('serviceOrContract')}</strong>

          <p className="margin-top-1">{request.contractName}</p>
        </div>
      )}

      {request.systems.length === 0 && !request.contractName && (
        <div className="margin-top-3">
          <Alert type="info" slim className="margin-top-0 margin-bottom-2">
            {t('noLinkedSystemAlert')}
          </Alert>
          <UswdsReactLink
            to={`/${parentRoute}/${request.id}/additional-information/link`}
            className="usa-button usa-button--outline"
          >
            {t('linkSystem')}
          </UswdsReactLink>
        </div>
      )}

      {request.contractNumbers?.length > 0 && (
        <div className="margin-top-3">
          <strong>
            {t('contractNumber', {
              count: request.contractNumbers.length
            })}
          </strong>
          <p className="margin-top-1">
            {formatContractNumbers(request.contractNumbers)}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdditionalInformation;
