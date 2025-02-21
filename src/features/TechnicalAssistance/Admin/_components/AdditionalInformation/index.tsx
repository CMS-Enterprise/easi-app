import React from 'react';
import AdditionalInformationComponent from 'features/Miscellaneous/AdditionalInformation';
import { GetTRBRequestSummaryQuery } from 'gql/generated/graphql';

const AdditionalInformation = ({
  trbRequest
}: {
  trbRequest: GetTRBRequestSummaryQuery['trbRequest'];
}) => {
  return <AdditionalInformationComponent request={trbRequest} type="trb" />;
};

export default AdditionalInformation;
