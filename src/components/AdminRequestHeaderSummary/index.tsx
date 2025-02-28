import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';
import {
  GetTRBRequestSummaryQuery,
  RequestRelationType
} from 'gql/generated/graphql';

import { formatDateLocal } from 'utils/date';
import getSystemOrContractName from 'utils/getSystemOrContractName';

// Some properties are just display strings passed in after any parsing,
// because original ITG & TRB objects are different.
type AdminRequestHeaderSummaryProps = {
  requestName: string;
  submittedAt: string;
  requestType: string;
  relationType?: RequestRelationType | null;
  contractName?: string | null;
  systems: GetTRBRequestSummaryQuery['trbRequest']['systems'];
  requester: string;
  trbRequesterTestId?: string;
  contractNumbers: string[];
};

function AdminRequestHeaderSummary({
  requestName,
  submittedAt,
  requestType,
  relationType,
  contractName,
  systems,
  requester,
  trbRequesterTestId = '',
  contractNumbers
}: AdminRequestHeaderSummaryProps) {
  const { t } = useTranslation('governanceReviewTeam');
  return (
    <>
      {/* Request summary */}
      <div className="display-flex flex-align-end flex-wrap margin-bottom-2">
        <h2 className="margin-top-05 margin-bottom-0 margin-right-2">
          {requestName}
        </h2>
        <p
          className="margin-y-05 text-primary-light"
          data-testid="summary-submissionDate"
        >
          {t('submittedOn', {
            date: formatDateLocal(submittedAt, 'MM/dd/yyyy')
          })}
        </p>
      </div>

      <Grid row gap>
        <Grid tablet={{ col: 8 }}>
          <h5 className="text-normal margin-y-0">{t('requestType')}</h5>
          <h4 className="margin-top-05 margin-bottom-2">{requestType}</h4>

          <h5 className="text-normal margin-y-0">
            {t('systemServiceContractName')}
          </h5>
          <h4 className="margin-top-05 margin-bottom-2">
            {getSystemOrContractName(relationType, contractName, systems)}
          </h4>
        </Grid>

        <Grid tablet={{ col: 4 }}>
          <h5 className="text-normal margin-y-0">
            {t('intake:contactDetails.requester')}
          </h5>
          <h4
            className="margin-top-05 margin-bottom-2"
            data-testid={trbRequesterTestId}
          >
            {requester}
          </h4>

          <h5 className="text-normal margin-y-0">
            {t('intake:review.contractNumber')}
          </h5>
          <h4 className="margin-top-05 margin-bottom-2">
            {contractNumbers.join(', ') || t('noneSpecified')}
          </h4>
        </Grid>
      </Grid>
    </>
  );
}

export default AdminRequestHeaderSummary;
