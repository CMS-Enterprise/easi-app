import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ApolloQueryResult } from '@apollo/client';
import { Button, GridContainer, Icon } from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables,
  TRBFeedbackStatus,
  TRBFormStatus,
  useGetTRBRequestQuery
} from 'gql/generated/graphql';
import { isEqual } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import useTRBAttendees from 'hooks/useTRBAttendees';
import nullFillObject from 'utils/nullFillObject';
import {
  inputBasicSchema,
  trbRequesterSchema
} from 'validations/trbRequestSchema';

import Breadcrumbs from '../../../../components/Breadcrumbs';
import StepHeader from '../../../../components/StepHeader';

import Attendees from './Attendees';
import Basic, { basicBlankValues } from './Basic';
import Check from './Check';
import Documents from './Documents';
import Done from './Done';
import Feedback from './Feedback';
import SubjectAreas from './SubjectAreas';
import ViewSubmittedRequest from './ViewSubmittedRequest';

/** Ordered list of request form steps as url slugs  */
const formStepSlugs = [
  'basic',
  'subject',
  'attendees',
  'documents',
  'check'
] as const;

type FormStepSlug = (typeof formStepSlugs)[number];

/** All slugs under the Trb request form */
const viewSlugs = [...formStepSlugs, 'done', 'view', 'feedback'] as const;

type ViewSlug = (typeof viewSlugs)[number];

/**
 * A promise wrapper for form step submit handlers.
 * Run the `onValid` callback after successful validation.
 * Use this to change address urls after submissions are successfully completed.
 */
export type StepSubmit = (
  onValid?: () => void,
  shouldValidate?: boolean
) => Promise<void>;

export type TrbFormAlert =
  | {
      type: 'success' | 'warning' | 'error' | 'info';
      message: string;
      heading?: React.ReactNode;
      slim?: boolean;
    }
  | false;

export interface FormStepComponentProps {
  request: GetTRBRequestQuery['trbRequest'];
  /** Refetch the trb request from the form wrapper */
  refetchRequest: (
    variables?: Partial<GetTRBRequestQueryVariables> | undefined
  ) => Promise<ApolloQueryResult<GetTRBRequestQuery>>;
  /**
   * Set the current form step component submit handler
   * so that in can be used in other places like the header.
   * Form step components need to reassign the handler.
   */
  setStepSubmit: React.Dispatch<React.SetStateAction<StepSubmit | null>>;
  /** Set to update the submitting state from step components to the parent request form */
  setIsStepSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  /** Set a form level alert message from within step components */
  setFormAlert: React.Dispatch<React.SetStateAction<TrbFormAlert>>;
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
  step: FormStepSlug;
}[] = [
  { component: Basic, step: 'basic' },
  { component: SubjectAreas, step: 'subject' },
  { component: Attendees, step: 'attendees' },
  { component: Documents, step: 'documents' },
  { component: Check, step: 'check' }
];

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
  warning,
  formAlert,
  setFormAlert,
  taskListUrl
}: {
  step: number;
  /** Unassigned request is used as a loading state toggle. */
  request?: GetTRBRequestQuery['trbRequest'];
  breadcrumbBar: React.ReactNode;
  stepsCompleted?: string[];
  stepSubmit: StepSubmit | null;
  isStepSubmitting: boolean;
  warning?: React.ReactNode;
  formAlert: TrbFormAlert;
  setFormAlert: React.Dispatch<React.SetStateAction<TrbFormAlert>>;
  taskListUrl: string;
}) {
  const history = useHistory();

  const { t } = useTranslation('technicalAssistance');
  const text = t('requestForm', {
    returnObjects: true
  }) as RequestFormText;

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

        // Basic Details and Attendees are the only steps with required form fields
        // Prevent links beyond these steps if they are not completed
        onClick:
          request &&
          !isStepSubmitting &&
          idx !== step - 1 && // not the current step
          Array.isArray(stepsCompleted) &&
          // If Attendees is complete then everything's available
          (stepsCompleted.includes('attendees') ||
            // Or if Basic is complete, steps up to and including Attendees available
            (idx < 3 && stepsCompleted.includes('basic')))
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
      warning={warning}
      errorAlert={
        formAlert && (
          <Alert
            heading={formAlert.heading}
            type={formAlert.type}
            slim={formAlert.slim}
            className="trb-form-error margin-top-3 margin-bottom-2"
            closeAlert={setFormAlert}
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
            }, false);
          }}
        >
          <Icon.ArrowBack
            className="margin-right-05 margin-bottom-2px text-tbottom"
            aria-hidden
          />
          {t('button.saveAndExit')}
        </Button>
      )}
    </StepHeader>
  );
}

function EditsRequestedWarning({
  requestId,
  step
}: {
  requestId: string;
  step?: string;
}) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <div className="bg-error-lighter padding-y-2">
      <GridContainer className="width-full">
        <div>
          <Icon.Warning
            aria-hidden
            className="text-error-dark text-middle margin-right-1"
            size={3}
          />
          <span className="text-middle line-height-body-5">
            {t('editsRequested.alert')}
          </span>
        </div>
        <div className="margin-top-2">
          <UswdsReactLink
            variant="unstyled"
            className="usa-button usa-button--outline"
            to={{
              pathname: `/trb/requests/${requestId}/feedback`,
              state: { prevStep: step }
            }}
          >
            {t('editsRequested.viewFeedback')}
          </UswdsReactLink>
        </div>
      </GridContainer>
    </div>
  );
}

/**
 * This is a component base for the TRB request form.
 */
function RequestForm() {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();

  const { state } = useLocation<{ prevStep?: string }>();

  const prevStep = state?.prevStep;

  const { id, step, view } = useParams<{
    /** Request id */
    id: string;
    /** Form step slug from `formStepSlugs` */
    step?: ViewSlug;
    /** Form step subview */
    view?: string;
  }>();

  const { data, error, loading, refetch } = useGetTRBRequestQuery({
    variables: { id }
  });

  const request: GetTRBRequestQuery['trbRequest'] | undefined =
    data?.trbRequest;

  const {
    data: { requester }
  } = useTRBAttendees(id);

  // Determine the steps that are already completed by attempting to pre-validate them
  const [stepsCompleted, setStepsCompleted] = useState<
    FormStepSlug[] | undefined
  >();

  // Prevalidate certain steps that will be checked against
  // to enable slug paths and links in the StepHeader
  useEffect(() => {
    if (!request) {
      return;
    }
    (async () => {
      const completed: FormStepSlug[] = [];
      const stepValidators = [];

      // Check the Basic step
      const basicStep = 'basic';
      if (!completed.includes(basicStep)) {
        stepValidators.push(
          inputBasicSchema
            .isValid(nullFillObject(request.form, basicBlankValues), {
              strict: true
            })
            .then(valid => {
              if (valid) completed.push(basicStep);
            })
        );
      }

      // Check Requester for the Attendees step
      const attendeesStep = 'attendees';
      if (!completed.includes(attendeesStep) && requester) {
        stepValidators.push(
          // See Attendees.tsx for schema validation
          trbRequesterSchema
            .isValid(
              {
                euaUserId: requester.userInfo?.euaUserId || '',
                component: requester.component,
                role: requester.role
              },
              { strict: true }
            )
            .then(valid => {
              if (valid) completed.push(attendeesStep);
            })
        );
      }

      Promise.allSettled(stepValidators).then(() => {
        if (!isEqual(completed, stepsCompleted)) setStepsCompleted(completed);
      });
    })();
  }, [request, requester, stepsCompleted]);

  // Handle some redirects based on status, steps completed, step slugs

  // If the form is completed then only allow `view`
  useEffect(() => {
    if (
      step !== 'view' &&
      step !== 'feedback' &&
      request?.taskStatuses.formStatus === TRBFormStatus.COMPLETED
    ) {
      history.replace(`/trb/requests/${id}/view`);
    }
  }, [history, id, request?.taskStatuses.formStatus, step]);

  // Check step param, redirect to the first step if invalid
  useEffect(() => {
    if (
      !step || // Step undefined
      !viewSlugs.includes(step) // Invalid step slug
    ) {
      history.replace(`/trb/requests/${id}/${formStepSlugs[0]}`);
    }
  }, [history, id, step]);

  // Prevent step slugs if not completed and redirect to the latest available
  // TODO Figure out what might be happening with CI runs hitting this block when submitting basic form step
  // useEffect(() => {
  //   if (stepsCompleted === undefined) {
  //     return;
  //   }
  //   if (
  //     !stepsCompleted.includes('basic') &&
  //     (step === 'subject' ||
  //       step === 'attendees' ||
  //       step === 'documents' ||
  //       step === 'check')
  //   ) {
  //     history.replace(`/trb/requests/${id}/basic`);
  //   } else if (
  //     !stepsCompleted.includes('attendees') &&
  //     (step === 'documents' || step === 'check')
  //   ) {
  //     history.replace(`/trb/requests/${id}/attendees`);
  //   }
  // }, [history, id, step, stepsCompleted]);

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

  // Check the request task feedback status for edits requested
  const editsRequestedWarning = useMemo(
    () =>
      request?.taskStatuses.feedbackStatus ===
      TRBFeedbackStatus.EDITS_REQUESTED ? (
        <EditsRequestedWarning requestId={request.id} step={step} />
      ) : null,
    [request?.id, request?.taskStatuses.feedbackStatus, step]
  );

  // References to the submit handler and submitting state of the current form step
  const [stepSubmit, setStepSubmit] = useState<StepSubmit | null>(null);
  const [isStepSubmitting, setIsStepSubmitting] = useState<boolean>(false);

  // Form level alerts from step components
  const [formAlert, setFormAlert] = useState<TrbFormAlert>(false);

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

  if (error) {
    return (
      <GridContainer className="width-full">
        <NotFoundPartial />
      </GridContainer>
    );
  }

  // Return early on certain slugs that are not form steps
  if (step === 'done') {
    return <Done breadcrumbBar={defaultBreadcrumbs} />;
  }

  if (step === 'view' && request) {
    return (
      <ViewSubmittedRequest
        request={request}
        breadcrumbBar={defaultBreadcrumbs}
        taskListUrl={taskListUrl}
      />
    );
  }

  if (step === 'feedback' && request) {
    return (
      <Feedback
        request={request}
        taskListUrl={taskListUrl}
        prevStep={prevStep}
      />
    );
  }

  const stepIdx = formStepSlugs.indexOf(step as FormStepSlug);
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
          warning={editsRequestedWarning}
          formAlert={formAlert}
          setFormAlert={setFormAlert}
          taskListUrl={taskListUrl}
        />
      )}
      {request && Array.isArray(stepsCompleted) ? (
        // Render the step component when request data is available
        // and `stepsCompleted` is defined after prevalidating form fields of steps
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
