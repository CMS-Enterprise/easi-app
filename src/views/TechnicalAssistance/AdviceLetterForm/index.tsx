import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Form,
  Grid,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import HelpText from 'components/shared/HelpText';
import StepHeader from 'components/StepHeader';
import {
  GetTrbAdviceLetterQuery,
  UpdateTrbAdviceLetterQuery
} from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import {
  UpdateTrbAdviceLetter,
  UpdateTrbAdviceLetterVariables
} from 'queries/types/UpdateTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { AdviceLetterFormFields } from 'types/technicalAssistance';
import { adviceLetterSchema } from 'validations/trbRequestSchema';
import NotFound from 'views/NotFound';

import Breadcrumbs from '../Breadcrumbs';

import InternalReview from './InternalReview';
import NextSteps from './NextSteps';
import Recommendations, { RecommendationsProps } from './Recommendations';
import Review from './Review';
import Summary from './Summary';

type UpdateAdviceLetterType = (
  fields?: (keyof AdviceLetterFormFields)[],
  redirectUrl?: string
) => Promise<void>;

export type StepComponentProps = {
  trbRequestId: string;
  updateAdviceLetter: UpdateAdviceLetterType;
};

type ComponentType = ({
  trbRequestId,
  updateAdviceLetter
}: StepComponentProps) => JSX.Element;

type RecommendationsComponentType = ({
  trbRequestId,
  recommendations
}: RecommendationsProps) => JSX.Element;

type AdviceFormStep = {
  key: string;
  slug: string;
  component: ComponentType | RecommendationsComponentType;
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

/**
 * TRB request admin advice letter form
 */
const AdviceLetterForm = () => {
  // Get url params
  const { id, formStep, subpage } = useParams<{
    id: string;
    formStep: string;
    subpage: string;
  }>();

  const history = useHistory();

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

  const [update] = useMutation<
    UpdateTrbAdviceLetter,
    UpdateTrbAdviceLetterVariables
  >(UpdateTrbAdviceLetterQuery);

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

  const {
    handleSubmit,
    getValues,
    trigger,
    formState: { isSubmitting, dirtyFields, errors }
  } = formContext;

  /** Submit advice letter form */
  const onSubmit = formData => {
    console.log({ dirtyFields, formData });
  };

  /** Index of current form step - will return -1 if invalid URL */
  const currentStepIndex: number = adviceFormSteps.findIndex(
    ({ slug }) => slug === formStep
  );

  /** Current form step object */
  const currentFormStep: AdviceFormStep = adviceFormSteps[currentStepIndex];

  /**
   * Form wrapper for step components
   */
  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    if (formStep === 'recommendations') {
      // If form step is recommendations, render component without form wrapper
      return <>{children}</>;
    }

    /** Whether to show required fields help text */
    const showHelpText = formStep === 'summary' || formStep === 'next-steps';

    // Advice letter form with step component
    return (
      <FormProvider {...formContext}>
        <Form className="maxw-none" onSubmit={handleSubmit(onSubmit)}>
          {
            /* Required fields text */
            showHelpText && (
              <HelpText className="margin-top-1 margin-bottom-3">
                <Trans
                  i18nKey="technicalAssistance:requiredFields"
                  components={{ red: <span className="text-red" /> }}
                />
              </HelpText>
            )
          }
          {
            /* Form fields */
            children
          }
        </Form>
      </FormProvider>
    );
  };

  /** Validates form fields, updates advice letter, and redirects user */
  const updateAdviceLetter: UpdateAdviceLetterType = async (
    /** Array of field keys to update - defaults to all changed fields */
    fields,
    /** URL to redirect to after successful mutation - defaults to `/trb/${id}/advice` */
    redirectUrl = `/trb/${id}/advice`
  ) => {
    /** Array of field names to update */
    const fieldsArray =
      fields || (Object.keys(dirtyFields) as (keyof AdviceLetterFormFields)[]);

    /** Object containing updated field values */
    const updatedValues: Partial<AdviceLetterFormFields> = fieldsArray.reduce(
      (acc, key) => ({
        ...acc,
        [key]: getValues()[key as keyof AdviceLetterFormFields]
      }),
      {}
    );

    return (
      // Validate fields
      trigger(fieldsArray)
        .then(valid => {
          // If field validation passes, update advice letter
          if (valid) {
            update({
              variables: {
                input: {
                  trbRequestId: id,
                  ...updatedValues
                }
              }
            })
              .then(result => {
                // If no errors, redirect
                if (!result.errors) {
                  history.push(redirectUrl);
                }
              })
              // If mutation fails, throw error
              .catch(e => {
                throw new Error(e);
              });
          } else {
            // If validation fails, throw error
            throw new Error('Invalid field submission');
          }
        })
        // Log error message and form errors
        .catch(e =>
          // eslint-disable-next-line no-console
          console.error({
            message: e,
            errors
          })
        )
    );
  };

  // Page loading
  if (loading) return <PageLoading />;

  // If invalid URL or request doesn't exist, return page not found
  if (currentStepIndex === -1 || !trbRequest) return <NotFound />;

  const {
    taskStatuses: { adviceLetterStatus }
  } = trbRequest;

  return (
    <>
      {/** Form page header */}
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
            disabled={isSubmitting}
            onClick={() =>
              updateAdviceLetter().then(() => history.push(`/trb/${id}/advice`))
            }
          >
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('adviceLetterForm.returnToRequest')}
          </Button>
        </StepHeader>
      )}
      {/** Form page body */}
      <GridContainer>
        <Grid>
          {
            // TODO: View if advice letter cannot be started yet
            adviceLetterStatus === TRBAdviceLetterStatus.CANNOT_START_YET ? (
              <p>Cannot start yet</p>
            ) : (
              <FormWrapper>
                <currentFormStep.component
                  trbRequestId={id}
                  updateAdviceLetter={updateAdviceLetter}
                  recommendations={adviceLetter?.recommendations || []}
                />
              </FormWrapper>
            )
          }
        </Grid>
      </GridContainer>
    </>
  );
};

export default AdviceLetterForm;
