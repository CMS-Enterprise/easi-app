import React from 'react';

import ReviewRow from 'components/ReviewRow';
import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import { RequestDescriptionForm } from 'types/businessCase';

type RequestDescriptionReviewProps = {
  values: RequestDescriptionForm;
};

const RequestDescriptionReview = ({
  values
}: RequestDescriptionReviewProps) => {
  return (
    <DescriptionList title="Request description">
      <ReviewRow>
        <div className="margin-bottom-205 line-height-body-3">
          <DescriptionTerm term="What is your business or user need?" />
          <DescriptionDefinition
            className="text-pre"
            definition={values.businessNeed}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="margin-bottom-205 line-height-body-3">
          <DescriptionTerm term="How will CMS benefit from this effort?" />
          <DescriptionDefinition
            className="text-pre"
            definition={values.cmsBenefit}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="margin-bottom-205 line-height-body-3">
          <DescriptionTerm term="How does this effort align with organizational priorities?" />
          <DescriptionDefinition
            className="text-pre"
            definition={values.priorityAlignment}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div className="margin-bottom-205 line-height-body-3">
          <DescriptionTerm term="How will you determine whether or not this effort is successful?" />
          <DescriptionDefinition
            className="text-pre"
            definition={values.successIndicators}
          />
        </div>
      </ReviewRow>
    </DescriptionList>
  );
};

export default RequestDescriptionReview;
