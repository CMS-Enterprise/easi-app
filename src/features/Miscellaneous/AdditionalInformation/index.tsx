import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetTRBRequestSummaryQuery,
  RequestRelationType,
  SystemIntakeFragmentFragment
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import SystemCardTable from 'components/SystemCard/table';
import { RequestType } from 'types/requestType';
import formatContractNumbers from 'utils/formatContractNumbers';

import RelatedRequestsTable from './RelatedRequestsTable';

const AdditionalInformation = ({
  request,
  type
}: {
  request:
    | GetTRBRequestSummaryQuery['trbRequest']
    | SystemIntakeFragmentFragment;
  type: RequestType;
}) => {
  const { t } = useTranslation('admin');

  const parentRoute = type === 'itgov' ? 'it-governance' : 'trb';

  const isITGovAdmin = useContext(ITGovAdminContext);

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
        <Alert
          type="warning"
          headingLevel="h4"
          slim
          className="margin-top-3 margin-bottom-2"
        >
          {t('unlinkedAlert')}
        </Alert>
      )}

      {request.relationType === RequestRelationType.NEW_SYSTEM && (
        <Alert
          type="info"
          headingLevel="h4"
          slim
          className="margin-top-3 margin-bottom-2"
        >
          {t('newSystemAlert')}
        </Alert>
      )}

      {isITGovAdmin &&
        (request.relationType === null ||
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

      {request.relationType !== null && (
        <>
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

          {(!request.contractNumbers || request.contractNumbers.length < 1) && (
            <div className="margin-top-3">
              <strong>{t('contractNumber')}</strong>
              <p className="margin-top-1 text-base text-italic">
                {t('noContractNumber')}
              </p>
            </div>
          )}
        </>
      )}

      <RelatedRequestsTable requestID={request.id} type={type} />
    </div>
  );
};

export default AdditionalInformation;
