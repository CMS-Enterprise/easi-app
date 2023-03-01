import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
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
import { AdviceLetterFormFields } from 'types/technicalAssistance';
import { adviceLetterSchema } from 'validations/trbRequestSchema';
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
  component: ({ trbRequestId }: { trbRequestId: string }) => JSX.Element;
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
  const { id, formStep, subpage } = useParams<{
    id: string;
    formStep: string;
    subpage: string;
  }>();

  const { t } = useTranslation('technicalAssistance');
  const steps = t<StepsText>('adviceLetterForm.steps', { returnObjects: true });

  // TRB request query
  const { data, loading } = useQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: { id }
  });
  /** Current trb request */
  const trbRequest = data?.trbRequest;

  const { adviceLetter } = trbRequest || {};

  /** Advice letter form context */
  const formContext = useForm<AdviceLetterFormFields>({
    resolver: yupResolver(adviceLetterSchema),
    defaultValues: {
      meetingSummary: adviceLetter?.meetingSummary,
      nextSteps: adviceLetter?.nextSteps,
      isFollowupRecommended: adviceLetter?.isFollowupRecommended,
      followUpPoint: adviceLetter?.followupPoint
    }
  });

  const { handleSubmit } = formContext;

  /** Submit advice letter form */
  const onSubmit = formData => null;

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
      {!subpage && (
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
          hideSteps={
            adviceLetterStatus === TRBAdviceLetterStatus.CANNOT_START_YET
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
      )}
      <GridContainer>
        <Grid>
          {
            // TODO: View if advice letter cannot be started yet
            adviceLetterStatus === TRBAdviceLetterStatus.CANNOT_START_YET ? (
              <p>Cannot start yet</p>
            ) : (
              /** Advice letter form */
              <FormProvider {...formContext}>
                <Form className="maxw-none" onSubmit={handleSubmit(onSubmit)}>
                  <currentFormStep.component trbRequestId={id} />
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
