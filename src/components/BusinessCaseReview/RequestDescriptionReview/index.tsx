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
      <ReviewRow className="margin-bottom-3">
        <div className="line-height-body-3">
          <DescriptionTerm term="What is your business or user need?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={values.businessNeed}
          />
        </div>
      </ReviewRow>
      <ReviewRow className="margin-bottom-3">
        <div className="line-height-body-3">
          <DescriptionTerm term="How will CMS benefit from this effort?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={values.cmsBenefit}
          />
        </div>
      </ReviewRow>
      <ReviewRow className="margin-bottom-3">
        <div className="line-height-body-3">
          <DescriptionTerm term="Summary of Current Solution" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={values.currentSolutionSummary}
          />
        </div>
      </ReviewRow>
      <ReviewRow className="margin-bottom-3">
        <div className="line-height-body-3">
          <DescriptionTerm term="How does this effort align with organizational priorities?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={values.priorityAlignment}
          />
        </div>
      </ReviewRow>
      <ReviewRow className="margin-bottom-3">
        <div className="line-height-body-3">
          <DescriptionTerm term="How will you determine whether or not this effort is successful?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={values.successIndicators}
          />
        </div>
      </ReviewRow>
    </DescriptionList>
  );
};

export default RequestDescriptionReview;
