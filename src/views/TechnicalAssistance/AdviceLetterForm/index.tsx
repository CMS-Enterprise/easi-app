import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Form, Grid, GridContainer } from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
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
  const { id, formStep } = useParams<{
    id: string;
    formStep: string;
  }>();

  /** Advice letter form context */
  const formContext = useForm();

  const { handleSubmit } = formContext;

  // TRB request query
  const { data, loading } = useQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: { id }
  });
  /** Current trb request */
  const trbRequest = data?.trbRequest;

  /** Submit advice letter form */
  const onSubmit = formData => console.log(formData);

  /** Current form step slug - will return undefined if URL is invalid */
  const currentFormStep: AdviceFormStep | undefined = adviceFormSteps.find(
    ({ slug }) => slug === formStep
  );

  // Page loading
  if (loading) return <PageLoading />;

  // If invalid URL or request doesn't exist, return page not found
  if (!currentFormStep || !trbRequest) return <NotFound />;

  const {
    taskStatuses: { adviceLetterStatus }
  } = trbRequest;

  return (
    <GridContainer>
      <Grid>
        {
          // TODO: View if advice letter cannot be started yet
          adviceLetterStatus === TRBAdviceLetterStatus.CANNOT_START_YET ? (
            <p>Cannot start yet</p>
          ) : (
            /** Advice letter form */
            <FormProvider {...formContext}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <currentFormStep.component />
              </Form>
            </FormProvider>
          )
        }
      </Grid>
    </GridContainer>
  );
};

export default AdviceLetterForm;
