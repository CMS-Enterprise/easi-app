import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Button,
  Form,
  Grid,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import StepHeader from 'components/StepHeader';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import NotFound from 'views/NotFound';

import Breadcrumbs from '../Breadcrumbs';

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

type StepsText = { name: string; longName?: string; description?: string }[];

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

  const { t } = useTranslation('technicalAssistance');
  const steps = t<StepsText>('adviceLetterForm.steps', { returnObjects: true });

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

  /** Index of current form step - will return -1 if invalid URL */
  const currentStepIndex: number = adviceFormSteps.findIndex(
    ({ slug }) => slug === formStep
  );

  /** Current form step object */
  const currentFormStep: AdviceFormStep = adviceFormSteps[currentStepIndex];

  // Page loading
  if (loading) return <PageLoading />;

  // If invalid URL or request doesn't exist, return page not found
  if (currentStepIndex === -1 || !trbRequest) return <NotFound />;

  const {
    taskStatuses: { adviceLetterStatus }
  } = trbRequest;

  return (
    <>
      <StepHeader
        heading={t('adviceLetterForm.heading')}
        text={t('adviceLetterForm.description')}
        subText={t('adviceLetterForm.text')}
        step={currentStepIndex + 1}
        steps={steps.map((step, index) => ({
          key: step.name,
          label: (
            <>
              <span className="name">{step.name}</span>
              <span className="long">{step.longName ?? step.name}</span>
            </>
          ),
          description: step.description,
          completed: index < currentStepIndex,
          // TODO: onClick prop
          onClick: () => null
        }))}
        breadcrumbBar={
          <Breadcrumbs
            items={[
              { text: t('Home'), url: '/trb' },
              {
                text: t(`Request ${id}`),
                url: `/trb/${id}/advice`
              },
              { text: t('adviceLetterForm.heading') }
            ]}
          />
        }
      >
        <Button
          type="button"
          unstyled
          // TODO: disabled prop
          disabled={false}
          // TODO: onClick prop
          onClick={() => null}
        >
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('adviceLetterForm.returnToRequest')}
        </Button>
      </StepHeader>
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
    </>
  );
};

export default AdviceLetterForm;
