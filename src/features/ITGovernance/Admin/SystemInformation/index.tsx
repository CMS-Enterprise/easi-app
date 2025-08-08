import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import RelatedRequestsTable from 'features/Miscellaneous/AdditionalInformation/RelatedRequestsTable';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import SystemCardTable from 'components/SystemCard/table';

const SystemInformation = ({
  request
}: {
  request: SystemIntakeFragmentFragment;
}) => {
  const { t: adminT } = useTranslation('admin');
  const { t: linkedSystemsT } = useTranslation('linkedSystems');

  console.log(request);

  return (
    <div>
      <PageHeading className="margin-y-0">
        {linkedSystemsT('title')}
      </PageHeading>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-1">
        {linkedSystemsT('description')}
      </p>
      <div className="margin-bottom-3">
        <span className="font-body-md line-height-body-4 margin-right-1 text-base">
          {adminT('somethingIncorrect')}
        </span>

        <UswdsReactLink to={`/linked-systems/${request.id}`}>
          {linkedSystemsT('editSystemInformation')}
        </UswdsReactLink>
      </div>
      {/* When it is in empty state */}
      {request.systems.length === 0 && (
        <Alert
          type="info"
          headingLevel="h4"
          slim
          className="margin-top-3 margin-bottom-2"
        >
          {adminT('newSystemAlert')}
        </Alert>
      )}

      {request.systems.length > 0 && (
        <SystemCardTable systems={request.systems} />
      )}
      {/* {request.relationType === RequestRelationType.EXISTING_SERVICE && (
        <div className="margin-top-3">
          <strong>{adminT('serviceOrContract')}</strong>

          <p className="margin-top-1">{request.contractName}</p>
        </div>
      )} */}
      {/* {request.relationType === null && (
        <Alert
          type="warning"
          headingLevel="h4"
          slim
          className="margin-top-3 margin-bottom-2"
        >
          {adminT('unlinkedAlert')}
        </Alert>
      )} */}
      {/* {request.relationType === RequestRelationType.NEW_SYSTEM && ( */}

      {/* )} */}
      {/* {request.relationType !== null && (
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
      )} */}
      <RelatedRequestsTable requestID={request.id} type="itgov" />
    </div>
  );
};

export default SystemInformation;
