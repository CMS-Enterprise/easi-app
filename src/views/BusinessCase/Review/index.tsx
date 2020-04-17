import React from 'react';
import { FormikProps } from 'formik';
import ReviewRow from 'components/ReviewRow';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
import ScrollableTabs from 'components/shared/ScrollableTabs';
import { BusinessCaseModel } from 'types/businessCase';

type ReviewProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};

const Review = ({ formikProps }: ReviewProps) => {
  const { values } = formikProps;
  return (
    <div className="margin-bottom-7">
      <h1 className="font-heading-xl margin-top-4">Review</h1>

      <h2 className="font-heading-xl">Contact Details</h2>
      <DescriptionList title="General Project Information">
        <ReviewRow>
          <div>
            <DescriptionTerm term="Project Name" />
            <DescriptionDefinition definition={values.projectName} />
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
            <DescriptionTerm term="Requester Phone Number" />
            <DescriptionDefinition definition={values.requester.phoneNumber} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div>
            <DescriptionTerm term="Operating Plan Budget Number" />
            <DescriptionDefinition definition={values.budgetNumber || 'N/A'} />
          </div>
        </ReviewRow>
      </DescriptionList>

      <h2 className="font-heading-xl margin-top-6">Project Description</h2>
      <DescriptionList title="Project Description">
        <ReviewRow>
          <div className="margin-bottom-205 line-height-body-3">
            <DescriptionTerm term="What is your business or user need?" />
            <DescriptionDefinition definition={values.businessNeed} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div className="margin-bottom-205 line-height-body-3">
            <DescriptionTerm term="How will CMS benefit from this effort?" />
            <DescriptionDefinition definition={values.cmsBenefit} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div className="margin-bottom-205 line-height-body-3">
            <DescriptionTerm term="How does this effort align with organizational priorities?" />
            <DescriptionDefinition definition={values.priorityAlignment} />
          </div>
        </ReviewRow>
        <ReviewRow>
          <div className="margin-bottom-205 line-height-body-3">
            <DescriptionTerm term="How will you determine whether or not this effort is successful?" />
            <DescriptionDefinition definition={values.successIndicators} />
          </div>
        </ReviewRow>
      </DescriptionList>

      <h2 className="font-heading-xl margin-top-6">Alternatives Analysis</h2>
      <div className="bg-base-lightest">
        <ScrollableTabs
          tabs={[
            'As-Is Solution',
            'Preferred Solution',
            'Alternative A',
            'Alternative B'
          ]}
        >
          <div />
        </ScrollableTabs>
      </div>
    </div>
  );
};

export default Review;
