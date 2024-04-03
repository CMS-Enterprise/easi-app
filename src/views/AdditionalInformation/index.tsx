import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import SystemCardTable from 'components/SystemCard/table';
import { GetTrbRequestSummary_trbRequest as TrbRequest } from 'queries/types/GetTrbRequestSummary';
import { SystemIntake } from 'queries/types/SystemIntake';
import { RequestRelationType } from 'types/graphql-global-types';
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

      {(request.relationType === RequestRelationType.EXISTING_SYSTEM ||
        request.relationType === RequestRelationType.EXISTING_SERVICE) && (
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

      {request.relationType === RequestRelationType.EXISTING_SYSTEM &&
        request.systems.length > 0 && (
          <SystemCardTable systems={request.systems} />
        )}

      {request.relationType === RequestRelationType.EXISTING_SERVICE && (
        <div className="margin-top-3">
          <strong>{t('serviceOrContract')}</strong>

          <p className="margin-top-1">{request.contractName}</p>
        </div>
      )}

      {request.relationType === null && (
        <Alert type="warning" slim className="margin-top-3 margin-bottom-2">
          {t('unlinkedAlert')}
        </Alert>
      )}

      {request.relationType === RequestRelationType.NEW_SYSTEM && (
        <Alert type="info" slim className="margin-top-3 margin-bottom-2">
          {t('newSystemAlert')}
        </Alert>
      )}

      {(request.relationType === null ||
        request.relationType === RequestRelationType.NEW_SYSTEM) && (
        <UswdsReactLink
          to={`/${parentRoute}/${request.id}/additional-information/link`}
          className={classNames('usa-button', {
            'usa-button--outline': request.relationType !== null
          })}
        >
          {t('linkSystem')}
        </UswdsReactLink>
      )}

      {type !== 'itgov' && // Hide the contract number field from itgov, see Note [EASI-4160 Disable Contract Number Linking]
        request.relationType !== null &&
        request.contractNumbers?.length > 0 && (
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
