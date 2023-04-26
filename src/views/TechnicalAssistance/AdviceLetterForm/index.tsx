import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Button,
  Grid,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';
import { isEqual } from 'lodash';

import PageLoading from 'components/PageLoading';
import { Alert } from 'components/shared/Alert';
import StepHeader from 'components/StepHeader';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { FormAlertObject } from 'types/technicalAssistance';
import {
  meetingSummarySchema,
  nextStepsSchema
} from 'validations/trbRequestSchema';
import NotFound from 'views/NotFound';

import Breadcrumbs from '../Breadcrumbs';
import { StepSubmit } from '../RequestForm';

import Done from './Done';
import InternalReview from './InternalReview';
import NextSteps from './NextSteps';
import Recommendations from './Recommendations';
import Review from './Review';
import Summary from './Summary';

import './index.scss';

type StepsText = { name: string; longName?: string; description?: string }[];

type FormStepKey =
  | 'summary'
  | 'recommendations'
  | 'next-steps'
  | 'internal-review'
  | 'review';

const adviceFormSteps = [
  {
    slug: 'summary',
    component: Summary
  },
  {
    slug: 'recommendations',
    component: Recommendations
  },
  {
    slug: 'next-steps',
    component: NextSteps
  },
  {
    slug: 'internal-review',
    component: InternalReview
  },
  {
    slug: 'review',
    component: Review
  }
] as const;

type AdviceFormStep = typeof adviceFormSteps[number];

/**
 * TRB request admin advice letter form
 */
const AdviceLetterForm = () => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  // Get url params
  const { id, formStep, subpage } = useParams<{
    id: string;
    formStep: string;
    subpage: string;
  }>();

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

  // References to the submit handler and submitting state of the current form step
  const [stepSubmit, setStepSubmit] = useState<StepSubmit | null>(null);
  const [isStepSubmitting, setIsStepSubmitting] = useState<boolean>(false);

  const [stepsCompleted, setStepsCompleted] = useState<FormStepKey[]>();

  // Form level alerts from step components
  const [formAlert, setFormAlert] = useState<FormAlertObject | null>(null);

  /** Form steps translated text object */
  const steps = t<StepsText>('adviceLetterForm.steps', { returnObjects: true });

  /** Index of current form step - will return -1 if invalid URL */
  const currentStepIndex: number = adviceFormSteps.findIndex(
    ({ slug }) => slug === formStep
  );

  /** Current form step object */
  const currentFormStep: AdviceFormStep = adviceFormSteps[currentStepIndex];

  // When navigating to a different step, checks if all previous form steps are valid
  const checkValidSteps = useCallback(
    (index: number): boolean => {
      const stepsToValidate = adviceFormSteps.slice(0, index);
      const validSteps = stepsToValidate.filter(({ slug }) =>
        stepsCompleted?.includes(slug)
      );
      return stepsToValidate.length === validSteps.length;
    },
    [stepsCompleted]
  );

  useEffect(() => {
    if (!adviceLetter) {
      return;
    }
    (async () => {
      const completed: FormStepKey[] = stepsCompleted
        ? [...stepsCompleted]
        : ['recommendations'];
      const stepValidators = [];

      // Check the Meeting Summary step
      if (!completed.includes('summary')) {
        const { meetingSummary } = adviceLetter || {};
        stepValidators.push(
          meetingSummarySchema
            .isValid(
              { meetingSummary },
              {
                strict: true
              }
            )
            .then(valid => {
              if (valid) completed.unshift('summary');
            })
        );
      }

      // Check the Next Steps step
      if (!completed.includes('next-steps')) {
        const {
          nextSteps,
          isFollowupRecommended,
          followupPoint
        } = adviceLetter;

        stepValidators.push(
          nextStepsSchema
            .isValid(
              { nextSteps, isFollowupRecommended, followupPoint },
              {
                strict: true
              }
            )
            .then(valid => {
              if (valid) completed.push('next-steps');
            })
        );
      }

      if (
        !completed.includes('internal-review') &&
        trbRequest?.taskStatuses?.adviceLetterStatus ===
          TRBAdviceLetterStatus.READY_FOR_REVIEW
      ) {
        completed.push('internal-review');
      }

      Promise.allSettled(stepValidators).then(() => {
        if (!isEqual(completed, stepsCompleted)) setStepsCompleted(completed);
      });
    })();
  }, [
    stepsCompleted,
    adviceLetter,
    trbRequest?.taskStatuses?.adviceLetterStatus
  ]);

  // Redirect if previous step is not completed
  useEffect(() => {
    if (stepsCompleted && !checkValidSteps(currentStepIndex)) {
      /** Returns latest available step index */
      const stepRedirectIndex = !stepsCompleted.includes('summary')
        ? 0
        : // If summary is completed, return index of last completed step plus 1
          adviceFormSteps.findIndex(
            step => step.slug === stepsCompleted?.slice(-1)[0]
          ) + 1;

      // Redirect to latest available step
      history.replace(
        `/trb/${id}/advice/${adviceFormSteps[stepRedirectIndex].slug}`
      );
    }
  }, [stepsCompleted, currentStepIndex, history, id, checkValidSteps]);

  useEffect(() => {
    if (formAlert) {
      const err = document.querySelector('.trb-form-error');
      err?.scrollIntoView();
    }
  }, [formAlert]);

  // Page loading
  if (loading) return <PageLoading />;

  // If advice letter can't be started, return page not found
  if (
    !trbRequest ||
    !adviceLetter ||
    trbRequest.taskStatuses.adviceLetterStatus ===
      TRBAdviceLetterStatus.CANNOT_START_YET
  ) {
    return <NotFound />;
  }

  const {
    taskStatuses: { adviceLetterStatus }
  } = trbRequest;

  if (formStep === 'done') {
    return <Done />;
  }

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
            onClick: async () => {
              const url = `/trb/${id}/advice/${adviceFormSteps[index].slug}`;

              if (
                !isStepSubmitting &&
                currentStepIndex !== index &&
                checkValidSteps(index)
              ) {
                if (stepSubmit) {
                  stepSubmit?.(() => history.push(url));
                } else {
                  history.push(url);
                }
              }
            }
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
          errorAlert={
            formAlert && (
              <Alert
                type={formAlert.type}
                className={`trb-form-${formAlert.type} margin-top-3`}
                slim
              >
                {formAlert.message}
              </Alert>
            )
          }
        >
          {/* Save and return to request button */}
          <Button
            type="button"
            unstyled
            disabled={isStepSubmitting}
            onClick={() => {
              const url = `/trb/${id}/advice`;
              if (stepSubmit) {
                stepSubmit?.(() => history.push(url));
              } else {
                history.push(url);
              }
            }}
          >
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('adviceLetterForm.returnToRequest')}
          </Button>
        </StepHeader>
      )}

      {/* Current form step component */}
      <GridContainer>
        <Grid>
          <currentFormStep.component
            trbRequestId={id}
            adviceLetter={adviceLetter}
            adviceLetterStatus={adviceLetterStatus}
            setFormAlert={setFormAlert}
            setStepSubmit={setStepSubmit}
            setIsStepSubmitting={setIsStepSubmitting}
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default AdviceLetterForm;
