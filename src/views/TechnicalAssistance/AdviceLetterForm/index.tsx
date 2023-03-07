import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Button,
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
import { FormAlertObject, StepComponentProps } from 'types/technicalAssistance';
import NotFound from 'views/NotFound';

import Breadcrumbs from '../Breadcrumbs';

import InternalReview from './InternalReview';
import NextSteps from './NextSteps';
import Recommendations, { RecommendationsProps } from './Recommendations';
import Review from './Review';
import Summary from './Summary';

import './index.scss';

type ComponentType = ({
  trbRequestId,
  adviceLetter
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

  const [formAlert, setFormAlert] = useState<FormAlertObject | undefined>();

  // TRB request query
  const { data, loading } = useQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: { id }
  });
  /** Current trb request */
  const trbRequest = data?.trbRequest;

  /** Index of current form step - will return -1 if invalid URL */
  const currentStepIndex: number = adviceFormSteps.findIndex(
    ({ slug }) => slug === formStep
  );

  /** Current form step object */
  const currentFormStep: AdviceFormStep = adviceFormSteps[currentStepIndex];

  // Page loading
  if (loading) return <PageLoading />;

  // If invalid URL or request doesn't exist, return page not found
  if (currentStepIndex === -1 || !trbRequest || !trbRequest.adviceLetter)
    return <NotFound />;

  const {
    adviceLetter,
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
            onClick: () => {
              history.push(`/trb/${id}/advice/${adviceFormSteps[index].slug}`);
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
          hideSteps={
            adviceLetterStatus === TRBAdviceLetterStatus.CANNOT_START_YET
          }
          errorAlert={
            formAlert && (
              <Alert type={formAlert.type} className="margin-top-3" slim>
                {formAlert.message}
              </Alert>
            )
          }
        >
          <Button
            type="button"
            unstyled
            // TODO: Disabled prop
            // disabled={isSubmitting}
            // TODO: Save on click
            onClick={() => history.push(`/trb/${id}/advice`)}
          >
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('adviceLetterForm.returnToRequest')}
          </Button>
        </StepHeader>
      )}
      {/** Step component */}
      <GridContainer>
        <Grid>
          {
            // TODO: View if advice letter cannot be started yet
            adviceLetterStatus === TRBAdviceLetterStatus.CANNOT_START_YET ? (
              <p>Cannot start yet</p>
            ) : (
              <currentFormStep.component
                trbRequestId={id}
                adviceLetter={adviceLetter}
                setFormAlert={setFormAlert}
                recommendations={adviceLetter?.recommendations || []}
              />
            )
          }
        </Grid>
      </GridContainer>
    </>
  );
};

export default AdviceLetterForm;
