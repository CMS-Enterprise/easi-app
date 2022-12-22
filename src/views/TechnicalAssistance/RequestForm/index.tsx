import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ApolloQueryResult, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';
import { isEqual } from 'lodash';

import PageLoading from 'components/PageLoading';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import {
  GetTrbRequest,
  GetTrbRequest_trbRequest as TrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';
import { TRBRequestType } from 'types/graphql-global-types';
import nullFillObject from 'utils/nullFillObject';
import { inputBasicSchema } from 'validations/trbRequestSchema';
import { NotFoundPartial } from 'views/NotFound';

import StepHeader from '../../../components/StepHeader';
import Breadcrumbs from '../Breadcrumbs';

import Attendees from './Attendees';
import Basic, { basicBlankValues } from './Basic';
import Check from './Check';
import Documents from './Documents';
import Done from './Done';
import SubjectAreas from './SubjectAreas';

/**
 * A promise wrapper for form step submit handlers.
 * Run the `onValid` callback after successful validation.
 * Use this to change address urls after submissions are successfully completed.
 */
export type StepSubmit = (onValid?: () => void) => Promise<void>;

export interface FormStepComponentProps {
  request: TrbRequest;
  /** Refetch the trb request from the form wrapper */
  refetchRequest: (
    variables?: Partial<GetTrbRequestVariables> | undefined
  ) => Promise<ApolloQueryResult<GetTrbRequest>>;
  /**
   * Set the current form step component submit handler
   * so that in can be used in other places like the header.
   * Form step components need to reassign the handler.
   */
  setStepSubmit: React.Dispatch<React.SetStateAction<StepSubmit | null>>;
  /** Set to update the submitting state from step components to the parent request form */
  setIsStepSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  /** Set a form level alert message from within step components */
  setFormAlert: React.Dispatch<
    React.SetStateAction<{ type: 'success' | 'error'; message: string } | false>
  >;
  stepUrl: {
    current: string;
    next: string;
    back: string;
  };
  taskListUrl: string;
}

/**
 * Form view components with step url slugs for each form request step.
 */
export const formStepComponents: {
  component: (props: FormStepComponentProps) => JSX.Element;
  step: string;
}[] = [
  { component: Basic, step: 'basic' },
  { component: SubjectAreas, step: 'subject' },
  { component: Attendees, step: 'attendees' },
  { component: Documents, step: 'documents' },
  { component: Check, step: 'check' }
];

/**
 * Mapped form step slugs from `formStepComponents`.
 * The last `done` slug is not a form step and is handled separately.
 */
const formStepSlugs = formStepComponents.map(f => f.step).concat('done');

type RequestFormText = {
  heading: string;
  description: string[];
  steps: {
    name: string;
    description?: string;
    longName?: string;
  }[];
};

/**
 * Wrap StepHeader with TRB text.
 */
function Header({
  step,
  request,
  breadcrumbBar,
  stepsCompleted,
  stepSubmit,
  isStepSubmitting,
  formAlert,
  taskListUrl
}: {
  step: number;
  /** Unassigned request is used as a loading state toggle. */
  request?: TrbRequest;
  breadcrumbBar: React.ReactNode;
  stepsCompleted: string[];
  stepSubmit: StepSubmit | null;
  isStepSubmitting: boolean;
  formAlert: { type: 'success' | 'error'; message: string } | false;
  taskListUrl: string;
}) {
  const history = useHistory();

  const { t } = useTranslation('technicalAssistance');
  const text = t<RequestFormText>('requestForm', {
    returnObjects: true
  });

  return (
    <StepHeader
      heading={text.heading}
      text={text.description[0]}
      subText={text.description[1]}
      step={step}
      steps={text.steps.map((stp, idx) => ({
        key: stp.name,
        label: (
          <>
            <span className="name">{stp.name}</span>
            <span className="long">{stp.longName ?? stp.name}</span>
          </>
        ),
        description: stp.description,
        completed: idx < step - 1,

        // Basic details is the only step with required form fields
        // Prevent links to other steps until basic is complete
        onClick:
          request &&
          !isStepSubmitting &&
          idx !== step - 1 && // not the current step
          stepsCompleted.includes('basic')
            ? () => {
                stepSubmit?.(() => {
                  history.push(
                    `/trb/requests/${request.id}/${formStepSlugs[idx]}`
                  );
                });
              }
            : undefined
      }))}
      hideSteps={!request}
      breadcrumbBar={breadcrumbBar}
      errorAlert={
        formAlert && (
          <Alert
            heading={step !== 3 && t('errors.somethingWrong')}
            type={formAlert.type}
            className="trb-form-error margin-top-3 margin-bottom-2"
          >
            {formAlert.message}
          </Alert>
        )
      }
    >
      {request && (
        <Button
          type="button"
          unstyled
          disabled={isStepSubmitting}
          onClick={() => {
            stepSubmit?.(() => {
              history.push(taskListUrl);
            });
          }}
        >
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('button.saveAndExit')}
        </Button>
      )}
    </StepHeader>
  );
}

/**
 * This is a component base for the TRB request form.
 */
function RequestForm() {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();

  // New requests require `requestType`
  const location = useLocation<{ requestType: string }>();
  const requestType = location.state?.requestType as TRBRequestType;

  const { id, step, view } = useParams<{
    /** Request id */
    id: string;
    /** Form step slug from `formStepSlugs` */
    step?: string;
    /** Form step subview */
    view?: string;
  }>();

  const { data, error, loading, refetch } = useQuery<
    GetTrbRequest,
    GetTrbRequestVariables
  >(GetTrbRequestQuery, {
    variables: { id }
  });

  const request: TrbRequest | undefined = data?.trbRequest;

  // Determine the steps that are already completed by attempting to pre-validate them
  const [stepsCompleted, setStepsCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!request) {
      return;
    }
    (async () => {
      const completed = [...stepsCompleted];

      // Only the Basic Details step needs a completed form
      // The rest have all optional fields and can be skipped
      const stp = 'basic';

      // Skip if already validated
      if (!completed.includes(stp)) {
        inputBasicSchema
          .isValid(nullFillObject(request.form, basicBlankValues), {
            strict: true
          })
          .then(valid => {
            if (valid) {
              completed.push(stp);
              if (!isEqual(completed, stepsCompleted))
                setStepsCompleted(completed);
            }
          });
      }
    })();
  }, [request, stepsCompleted]);

  useEffect(() => {
    if (request) {
      // Check step param, redirect to the first step if invalid
      if (!step || !formStepSlugs.includes(step)) {
        history.replace(`/trb/requests/${id}/${formStepSlugs[0]}`);
      }
    }
  }, [history, id, request, requestType, step]);

  const taskListUrl = useMemo(
    () => (request ? `/trb/task-list/${request.id}` : null),
    [request]
  );

  const defaultBreadcrumbs = useMemo(
    () =>
      taskListUrl ? (
        <Breadcrumbs
          items={[
            { text: t('heading'), url: '/trb' },
            {
              text: t('taskList.heading'),
              url: taskListUrl
            },
            { text: t('requestForm.heading') }
          ]}
        />
      ) : null,
    [t, taskListUrl]
  );

  // References to the submit handler and submitting state of the current form step
  const [stepSubmit, setStepSubmit] = useState<StepSubmit | null>(null);
  const [isStepSubmitting, setIsStepSubmitting] = useState<boolean>(false);

  // Form level errors from step components
  const [formAlert, setFormAlert] = useState<
    { type: 'success' | 'error'; message: string } | false
  >(false);

  // Clear the form level error as implied when steps change
  useEffect(() => {
    setFormAlert(false);
  }, [setFormAlert, step]);

  // Scroll to the form error
  useEffect(() => {
    if (formAlert) {
      const err = document.querySelector('.trb-form-error');
      err?.scrollIntoView();
    }
  }, [formAlert]);

  if (!step || taskListUrl === null) {
    return null;
  }

  // `Done` has a different layout and is handled seperately
  if (step === 'done') {
    return <Done breadcrumbBar={defaultBreadcrumbs} />;
  }

  if (error) {
    return (
      <GridContainer className="width-full">
        <NotFoundPartial />
      </GridContainer>
    );
  }

  const stepIdx = formStepSlugs.indexOf(step);
  const stepNum = stepIdx + 1;

  const FormStepComponent = formStepComponents[stepIdx].component;

  return (
    <>
      {!view && (
        // Do not render the common header if a step subview is used
        <Header
          step={stepNum}
          breadcrumbBar={defaultBreadcrumbs}
          request={request}
          stepsCompleted={stepsCompleted}
          stepSubmit={stepSubmit}
          isStepSubmitting={isStepSubmitting}
          formAlert={formAlert}
          taskListUrl={taskListUrl}
        />
      )}
      {request ? (
        <GridContainer className="width-full">
          <FormStepComponent
            request={request}
            stepUrl={{
              current: `/trb/requests/${request.id}/${formStepSlugs[stepIdx]}`,
              // No bounds checking on steps since invalid ones are redirected earlier
              // and bad urls can be ignored
              next: `/trb/requests/${request.id}/${formStepSlugs[stepIdx + 1]}`,
              back: `/trb/requests/${request.id}/${formStepSlugs[stepIdx - 1]}`
            }}
            taskListUrl={taskListUrl}
            refetchRequest={refetch}
            setStepSubmit={setStepSubmit}
            setIsStepSubmitting={setIsStepSubmitting}
            setFormAlert={setFormAlert}
          />
        </GridContainer>
      ) : (
        loading && <PageLoading />
      )}
    </>
  );
}

export default RequestForm;
