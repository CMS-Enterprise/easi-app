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

        <UswdsReactLink
          to={{
            pathname: `/linked-systems/${request.id}`,
            state: { from: 'admin' }
          }}
        >
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
        <SystemCardTable systems={request.systemIntakeSystems} />
      )}
      <RelatedRequestsTable requestID={request.id} type="itgov" />
    </div>
  );
};

export default SystemInformation;
