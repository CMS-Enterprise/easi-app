import React from 'react';

import { GetTrbRequestSummary_trbRequest as TrbRequest } from 'queries/types/GetTrbRequestSummary';
import AdditionalInformationComponent from 'views/AdditionalInformation';

const AdditionalInformation = ({ trbRequest }: { trbRequest: TrbRequest }) => {
  return <AdditionalInformationComponent system={trbRequest} type="trb" />;
};

export default AdditionalInformation;
