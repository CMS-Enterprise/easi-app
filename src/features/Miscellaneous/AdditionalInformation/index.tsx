import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import classNames from 'classnames';
import ITGovAdminContext from 'features/ITGovernance/Admin/ITGovAdminContext';
import {
  GetTRBRequestSummaryQuery,
  RequestRelationType,
  SystemIntakeFragmentFragment
} from 'gql/generated/graphql';

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
  const { t: adminT } = useTranslation('admin');
  const { t: linkedSystemsT } = useTranslation('linkedSystems');

  const parentRoute = type === 'itgov' ? 'it-governance' : 'trb';

  const isITGovAdmin = useContext(ITGovAdminContext);
  return (
    <div>
      <PageHeading className="margin-y-0">
        {parentRoute === 'it-governance'
          ? linkedSystemsT('title')
          : adminT('title')}
      </PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-1">
        {parentRoute === 'it-governance'
          ? linkedSystemsT('description')
          : adminT('description')}
      </p>
      {(request.relationType === RequestRelationType.EXISTING_SYSTEM ||
        request.relationType === RequestRelationType.EXISTING_SERVICE) && (
        <div className="margin-bottom-3">
          <span className="font-body-md line-height-body-4 margin-right-1 text-base">
            {adminT('somethingIncorrect')}
          </span>

          <UswdsReactLink
            to={`/${parentRoute}/${request.id}/system-information/link`}
          >
            {parentRoute === 'it-governance'
              ? linkedSystemsT('editInformation')
              : adminT('editInformation')}
          </UswdsReactLink>
        </div>
      )}
      {request.relationType === RequestRelationType.EXISTING_SYSTEM &&
        request.systems.length > 0 && (
          <SystemCardTable
            systems={request.systems}
            systemRelationshipType={
              // Type guard: 'cedarSystemRelationShips' only exists on SystemIntakeFragment.
              // This narrows the union type, so we can safely access the first system’s relationshipType.
              'cedarSystemRelationShips' in request
                ? request.cedarSystemRelationShips?.[0]?.systemRelationshipType
                : undefined
            }
          />
        )}
      {request.relationType === RequestRelationType.EXISTING_SERVICE && (
        <div className="margin-top-3">
          <strong>{adminT('serviceOrContract')}</strong>

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
          {adminT('unlinkedAlert')}
        </Alert>
      )}
      {request.relationType === RequestRelationType.NEW_SYSTEM && (
        <Alert
          type="info"
          headingLevel="h4"
          slim
          className="margin-top-3 margin-bottom-2"
        >
          {adminT('newSystemAlert')}
        </Alert>
      )}
      {isITGovAdmin &&
        (request.relationType === null ||
          request.relationType === RequestRelationType.NEW_SYSTEM) && (
          <UswdsReactLink
            to={`/${parentRoute}/${request.id}/system-information/link`}
            className={classNames('usa-button', {
              'usa-button--outline': request.relationType !== null
            })}
          >
            {adminT('linkSystem')}
          </UswdsReactLink>
        )}
      {request.relationType !== null && (
        <>
          {request.contractNumbers?.length > 0 && (
            <div className="margin-top-3">
              <strong>
                {adminT('contractNumber', {
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
              <strong>{adminT('contractNumber')}</strong>
              <p className="margin-top-1 text-base text-italic">
                {adminT('noContractNumber')}
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
