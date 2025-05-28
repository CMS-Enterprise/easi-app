import React from 'react';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import ReviewRow from 'components/ReviewRow';
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
          <DescriptionTerm term="What internal collaboration or vendor engagement will support the recommended work?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={values.collaborationNeeded}
          />
        </div>
      </ReviewRow>
      <ReviewRow className="margin-bottom-3">
        <div className="line-height-body-3">
          <DescriptionTerm term="What is the current process that you are using for this work, or how is this need currently being met?" />
          <DescriptionDefinition
            className="text-pre-wrap"
            definition={values.currentSolutionSummary}
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
      {/* TODO: NJD - add response to GRT? handle conditional rendering? */}
    </DescriptionList>
  );
};

export default RequestDescriptionReview;
