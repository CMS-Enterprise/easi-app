import React from 'react';
import { FormikProps } from 'formik';

import BusinessCaseReview from 'components/BusinessCaseReview';
import { BusinessCaseModel } from 'types/businessCase';

type ReviewProps = {
  formikProps: FormikProps<BusinessCaseModel>;
};

const Review = ({ formikProps }: ReviewProps) => {
  const { values } = formikProps;

  return (
    <div className="margin-bottom-7">
      <h1 className="font-heading-xl margin-top-4">
        Check your answers before sending
      </h1>

      <BusinessCaseReview values={values} />
    </div>
  );
};

export default Review;
