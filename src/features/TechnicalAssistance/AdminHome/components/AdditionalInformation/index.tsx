import React from 'react';
import AdditionalInformationComponent from 'features/Miscellaneous/AdditionalInformation';
import { GetTrbRequestSummary_trbRequest as TrbRequest } from 'gql/legacyGQL/types/GetTrbRequestSummary';

const AdditionalInformation = ({ trbRequest }: { trbRequest: TrbRequest }) => {
  return <AdditionalInformationComponent request={trbRequest} type="trb" />;
};

export default AdditionalInformation;
