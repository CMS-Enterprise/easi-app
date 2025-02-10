import React from 'react';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { GeneralRequestInfoForm } from 'types/businessCase';

type GeneralRequestInfoReviewProps = {
  values: GeneralRequestInfoForm;
};

const GeneralRequestInfoReview = ({
  values
}: GeneralRequestInfoReviewProps) => {
  return (
    <DescriptionList title="General request information">
      <ReviewRow>
        <div>
          <DescriptionTerm term="Project name" />
          <DescriptionDefinition definition={values.requestName} />
        </div>
        <div>
          <DescriptionTerm term="Business Owner" />
          <DescriptionDefinition definition={values.businessOwner.name} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div>
          <DescriptionTerm term="Requester" />
          <DescriptionDefinition definition={values.requester.name} />
        </div>
        <div>
          <DescriptionTerm term="Requester phone number" />
          <DescriptionDefinition definition={values.requester.phoneNumber} />
        </div>
      </ReviewRow>
    </DescriptionList>
  );
};

export default GeneralRequestInfoReview;
