import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
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

export type FormStepKey =
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
  const location = useLocation<{
    error?: boolean;
    state: { fromAdmin?: boolean };
    fromAdmin?: boolean;
  }>();

  const fromAdmin = location.state?.fromAdmin;

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
      return (
        adviceFormSteps.filter(
          (step, i) => stepsCompleted?.includes(step.slug) && i < index
        ).length === index
      );
    },
    [stepsCompleted]
  );

  /** Redirect if previous steps are not completed */
  const redirectStep = useCallback(() => {
    if (stepsCompleted && !checkValidSteps(currentStepIndex - 1)) {
      /** Returns latest available step index */
      const stepRedirectIndex = !stepsCompleted.includes('summary')
        ? 0
        : // If summary is completed, return index of last completed step plus 1
          adviceFormSteps.findIndex(
            step => step.slug === stepsCompleted?.slice(-1)[0]
          ) + 1;

      if (!fromAdmin && currentStepIndex === 0) return;
      if (!adviceFormSteps[stepRedirectIndex]?.slug) return;
      // Redirect to latest available step
      history.replace(
        `/trb/${id}/advice/${adviceFormSteps[stepRedirectIndex].slug}`
      );
    }
  }, [
    stepsCompleted,
    currentStepIndex,
    history,
    id,
    checkValidSteps,
    fromAdmin
  ]);

  useEffect(() => {
    if (!adviceLetter) return;
    (async () => {
      let completed: FormStepKey[] = stepsCompleted ? [...stepsCompleted] : [];
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
              if (valid) completed = ['summary'];
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
              // Internal review should be marked completed with next steps
              if (valid) {
                completed = ['summary', 'recommendations', 'next-steps'];
              }
            })
        );
      }

      if (
        trbRequest?.taskStatuses.adviceLetterStatus ===
          TRBAdviceLetterStatus.READY_FOR_REVIEW &&
        !stepsCompleted?.includes('review')
      ) {
        completed = [
          'summary',
          'recommendations',
          'next-steps',
          'internal-review'
        ];
      }

      Promise.allSettled(stepValidators).then(() => {
        if (!isEqual(completed, stepsCompleted)) {
          setStepsCompleted(completed);
        } else {
          /** Once stepsCompleted is finished evaluating, redirect to last valid step if necessary */
          redirectStep();
        }
      });
    })();
  }, [
    stepsCompleted,
    adviceLetter,
    trbRequest?.taskStatuses?.adviceLetterStatus,
    redirectStep,
    formStep
  ]);

  useEffect(() => {
    if (formAlert) {
      const err = document.querySelector('.trb-form-error');
      err?.scrollIntoView();
    }
  }, [formAlert]);

  useEffect(() => {
    if (!adviceLetter && !loading) {
      const type = location?.state?.error ? 'error' : 'info';
      setFormAlert({
        type,
        message: t(`adviceLetter.alerts.${type}`)
      });
    }
  }, [adviceLetter, loading, location?.state?.error, t]);

  // Page loading
  if (loading) return <PageLoading />;

  // If invalid trb request, show not found
  if (!trbRequest) {
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
            disabled:
              isStepSubmitting ||
              currentStepIndex === index ||
              !checkValidSteps(index),
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

              if (stepSubmit) {
                stepSubmit?.(() => history.push(url));
              } else {
                history.push(url);
              }
            }
          }))}
          breadcrumbBar={
            <Breadcrumbs
              items={[
                { text: t('adminHome.home'), url: '/trb' },
                {
                  text: t('adminHome.breadcrumb'),
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
                closeAlert={setFormAlert}
              >
                {formAlert.message}
              </Alert>
            )
          }
          hideSteps={!adviceLetter}
        >
          {
            /* Save and return to request button */
            !!adviceLetter && (
              <Button
                type="button"
                unstyled
                disabled={isStepSubmitting}
                onClick={() => {
                  const url = `/trb/${id}/advice`;
                  if (stepSubmit) {
                    stepSubmit?.(() => history.push(url), false);
                  } else {
                    history.push(url);
                  }
                }}
              >
                <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
                {t('adviceLetterForm.returnToRequest')}
              </Button>
            )
          }
        </StepHeader>
      )}

      {/* Current form step component */}
      <GridContainer>
        <Grid>
          {adviceLetter && (
            <currentFormStep.component
              trbRequestId={id}
              adviceLetter={adviceLetter}
              adviceLetterStatus={adviceLetterStatus}
              setFormAlert={setFormAlert}
              setStepSubmit={setStepSubmit}
              setIsStepSubmitting={setIsStepSubmitting}
              stepsCompleted={stepsCompleted}
              setStepsCompleted={setStepsCompleted}
            />
          )}
        </Grid>
      </GridContainer>
    </>
  );
};

export default AdviceLetterForm;
