import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import { isEqual } from 'lodash';

import PageLoading from 'components/PageLoading';
import { Alert } from 'components/shared/Alert';
import StepHeader from 'components/StepHeader';
import useCacheQuery from 'hooks/useCacheQuery';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBGuidanceLetterStatus } from 'types/graphql-global-types';
import {
  FormAlertObject,
  GuidanceFormStepKey
} from 'types/technicalAssistance';
import {
  meetingSummarySchema,
  nextStepsSchema
} from 'validations/trbRequestSchema';
import NotFound from 'views/NotFound';

import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import { StepSubmit } from '../RequestForm';

import Done from './Done';
import InternalReview from './InternalReview';
import NextSteps from './NextSteps';
import Recommendations from './Recommendations';
import Review from './Review';
import Summary from './Summary';

import './index.scss';

type StepsText = { name: string; longName?: string; description?: string }[];

const guidanceFormSteps = [
  {
    slug: 'summary',
    component: Summary
  },
  {
    slug: 'insights',
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

type GuidanceFormStep = (typeof guidanceFormSteps)[number];

/**
 * TRB request admin guidance letter form
 */
const GuidanceLetterForm = () => {
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
  const { data, loading } = useCacheQuery<
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

  const [stepsCompleted, setStepsCompleted] = useState<GuidanceFormStepKey[]>();

  // Form level alerts from step components
  const [formAlert, setFormAlert] = useState<FormAlertObject | null>(null);

  /** Form steps translated text object */
  const steps = t<StepsText>('guidanceLetterForm.steps', {
    returnObjects: true
  });

  /** Index of current form step - will return -1 if invalid URL */
  const currentStepIndex: number = guidanceFormSteps.findIndex(
    ({ slug }) => slug === formStep
  );

  /** Current form step object */
  const currentFormStep: GuidanceFormStep = guidanceFormSteps[currentStepIndex];

  // When navigating to a different step, checks if all previous form steps are valid
  const checkValidSteps = useCallback(
    (index: number): boolean => {
      return (
        guidanceFormSteps.filter(
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
          guidanceFormSteps.findIndex(
            step => step.slug === stepsCompleted?.slice(-1)[0]
          ) + 1;

      if (!fromAdmin && currentStepIndex === 0) return;
      if (!guidanceFormSteps[stepRedirectIndex]?.slug) return;
      // Redirect to latest available step
      history.replace(
        `/trb/${id}/guidance/${guidanceFormSteps[stepRedirectIndex].slug}`
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
      let completed: GuidanceFormStepKey[] = stepsCompleted
        ? [...stepsCompleted]
        : [];
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
        const { nextSteps, isFollowupRecommended, followupPoint } =
          adviceLetter;

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
                completed = ['summary', 'insights', 'next-steps'];
              }
            })
        );
      }

      if (
        trbRequest?.taskStatuses.adviceLetterStatus ===
          TRBGuidanceLetterStatus.READY_FOR_REVIEW &&
        !stepsCompleted?.includes('review')
      ) {
        completed = ['summary', 'insights', 'next-steps', 'internal-review'];
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
        message: t(`guidanceLetter.alerts.${type}`)
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
          heading={t('guidanceLetterForm.heading')}
          text={t('guidanceLetterForm.description')}
          subText={t('guidanceLetterForm.text')}
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
              const url = `/trb/${id}/guidance/${guidanceFormSteps[index].slug}`;

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
                  url: `/trb/${id}/guidance`
                },
                { text: t('guidanceLetterForm.heading') }
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
                  const url = `/trb/${id}/guidance`;
                  if (stepSubmit) {
                    stepSubmit?.(() => history.push(url), false);
                  } else {
                    history.push(url);
                  }
                }}
              >
                <Icon.ArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
                {t('guidanceLetterForm.returnToRequest')}
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

export default GuidanceLetterForm;
