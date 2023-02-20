import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Form } from '@trussworks/react-uswds';

import NotFound from 'views/NotFound';

import InternalReview from './InternalReview';
import NextSteps from './NextSteps';
import Recommendations from './Recommendations';
import Review from './Review';
import Summary from './Summary';

type AdviceFormStep = {
  key: string;
  slug: string;
  component: () => JSX.Element;
};

const adviceFormSteps: AdviceFormStep[] = [
  {
    key: 'summary',
    slug: 'summary',
    component: Summary
  },
  {
    key: 'recommendations',
    slug: 'recommendations',
    component: Recommendations
  },
  {
    key: 'nextSteps',
    slug: 'next-steps',
    component: NextSteps
  },
  {
    key: 'internalReview',
    slug: 'internal-review',
    component: InternalReview
  },
  {
    key: 'review',
    slug: 'review',
    component: Review
  }
];

const AdviceLetterForm = () => {
  // Get url params
  const { formStep } = useParams<{
    id: string;
    formStep: string;
  }>();

  const formContext = useForm();

  const { handleSubmit } = formContext;
  const onSubmit = data => console.log(data);

  /** Current form step slug - will return undefined if page not found */
  const currentFormStep: AdviceFormStep | undefined = adviceFormSteps.find(
    ({ slug }) => slug === formStep
  );

  if (!currentFormStep) return <NotFound />;

  return (
    <FormProvider {...formContext}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <currentFormStep.component />
      </Form>
    </FormProvider>
  );
};

export default AdviceLetterForm;
