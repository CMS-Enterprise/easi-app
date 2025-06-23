import React from 'react';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import ReviewRow from 'components/ReviewRow';
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
          <DescriptionTerm term="Contact / request title" />
          <DescriptionDefinition definition={values.requestName} />
        </div>
        <div>
          <DescriptionTerm term="Contact / request acronym" />
          <DescriptionDefinition
            definition={values.projectAcronym ? values.projectAcronym : 'N/A'}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div>
          <DescriptionTerm term="CMS Business Owner" />
          <DescriptionDefinition definition={values.businessOwner.name} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div>
          <DescriptionTerm term="Requester" />
          <DescriptionDefinition definition={values.requester.name} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div>
          <DescriptionTerm term="Requester phone number" />
          <DescriptionDefinition definition={values.requester.phoneNumber} />
        </div>
      </ReviewRow>
    </DescriptionList>
  );
};

export default GeneralRequestInfoReview;
