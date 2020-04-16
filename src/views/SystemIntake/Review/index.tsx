import React from 'react';
import { FormikProps } from 'formik';
import { SystemIntakeForm } from 'types/systemIntake';
import { SystemIntakeReview } from 'components/SystemIntakeReview';

type ReviewProps = {
  formikProps: FormikProps<SystemIntakeForm>;
};

const Review = ({ formikProps }: ReviewProps) => {
  const { values } = formikProps;
  const heading = 'Check your answers before sending';
  return (
    <div>
      <SystemIntakeReview heading={heading} systemIntake={values} />
      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">What happens next?</h2>
      <p>
        The Governance Review Team will review and get back to you with{' '}
        <strong>one of these</strong> outcomes:
      </p>
      <ul className="usa-list">
        <li>direct you to go through the Governance Review process</li>
        <li>or decide there is no further governance needed</li>
      </ul>
      <p>They will get back to you in two business days.</p>
    </div>
  );
};

export default Review;
