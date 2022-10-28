import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GridContainer, IconArrowBack } from '@trussworks/react-uswds';
import { isEqual } from 'lodash';
import * as yup from 'yup';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import CreateTrbRequestQuery from 'queries/CreateTrbRequestQuery';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import {
  CreateTrbRequest,
  // eslint-disable-next-line camelcase
  CreateTrbRequest_createTRBRequest,
  CreateTrbRequestVariables
} from 'queries/types/CreateTrbRequest';
import {
  GetTrbRequest,
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

export interface FormStepComponentProps {
  // eslint-disable-next-line camelcase
  request: CreateTrbRequest_createTRBRequest;
  refreshRequest: () => void;
  stepUrl: {
    current: string;
    next: string;
    back: string;
  };
}

/**
 * Form view components with step url slugs for each form request step.
 * `inputSchema` and `blankValues` are used to determine `stepsCompleted`.
 * */
// Temporary optional defs for inputSchema and blankValues used until dev is finished with all steps
export const formStepComponents: {
  component: (props: FormStepComponentProps) => JSX.Element;
  step: string;
  inputSchema?: yup.SchemaOf<any>;
  blankValues?: any;
}[] = [
  {
    component: Basic,
    step: 'basic',
    inputSchema: inputBasicSchema,
    blankValues: basicBlankValues
  },
  {
    component: SubjectAreas,
    step: 'subject'
  },
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
  stepsCompleted
}: {
  step: number;
  /** Unassigned request is used as a loading state toggle. */
  // eslint-disable-next-line camelcase
  request?: CreateTrbRequest_createTRBRequest;
  breadcrumbBar: React.ReactNode;
  stepsCompleted: string[];
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

        // Handle links to available steps determined by completed steps
        // Indexing of the step text matches `stepsCompleted`
        completed: idx < stepsCompleted.length,
        onClick:
          request && idx <= stepsCompleted.length
            ? e => {
                history.push(
                  `/trb/requests/${request.id}/${formStepSlugs[idx]}`
                );
              }
            : undefined
      }))}
      hideSteps={!request}
      breadcrumbBar={breadcrumbBar}
    >
      {request && (
        <UswdsReactLink to="/trb">
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('button.saveAndExit')}
        </UswdsReactLink>
      )}
    </StepHeader>
  );
}

/**
 * This is a component base for the TRB request form.
 * Route param `id` is either `new` or a TrbRequest id.
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

  const [create, createResult] = useMutation<
    CreateTrbRequest,
    CreateTrbRequestVariables
  >(CreateTrbRequestQuery);

  const [get, getResult] = useLazyQuery<GetTrbRequest, GetTrbRequestVariables>(
    GetTrbRequestQuery
  );

  const getRequest = useCallback(() => {
    get({ variables: { id } });
  }, [get, id]);

  // Assign request data from the first available query response
  // Prioritize by latest type: get, create
  // eslint-disable-next-line camelcase
  const request: CreateTrbRequest_createTRBRequest | undefined =
    getResult.data?.trbRequest || createResult.data?.createTRBRequest;

  // Determine the steps that are already completed by attempting to pre-validate them
  const [stepsCompleted, setStepsCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!request) {
      return;
    }
    (async () => {
      // console.log('check completed', stepsCompleted);
      const completed = [...stepsCompleted];

      // Validate steps sequentially
      // eslint-disable-next-line no-restricted-syntax
      for (const stp of formStepComponents) {
        if (
          // Skip already validated
          !completed.includes(stp.step) &&
          // Temp check for blankValues and inputSchema
          // Remove when these props are available for all steps
          stp.blankValues &&
          stp.inputSchema
        ) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await stp.inputSchema.validate(
              nullFillObject(request.form, stp.blankValues),
              {
                strict: true
              }
            );
          } catch (err) {
            break;
          }
          // console.log('idx', stpIdx, stp.step);
          completed.push(stp.step);
        }
      }

      // console.log('completed', completed, stepsCompleted);
      if (!isEqual(completed, stepsCompleted)) setStepsCompleted(completed);
    })();
  }, [request, stepsCompleted]);

  useEffect(() => {
    // Create a new request if `id` is new and go to it
    if (id === 'new') {
      // Request type must be defined for new requests
      if (requestType) {
        if (!createResult.called) {
          // Create the new request
          create({ variables: { requestType } }).then(res => {
            // Update the url with the request id
            if (res.data) {
              history.replace(`/trb/requests/${res.data.createTRBRequest.id}`);
            }
          });
        }
      }
      // Redirect to the start if there's no request type
      else history.replace('/trb/start');
    }
    // Fetch request data if not new
    else if (!request && !createResult.called && !getResult.called) {
      getRequest();
    }
    // Get or create request was successful
    // Continue any other effects with request data
    else if (request) {
      // Check step param, redirect to the first step if invalid
      if (!step || !formStepSlugs.includes(step)) {
        history.replace(`/trb/requests/${id}/${formStepSlugs[0]}`);
      }
    }
  }, [
    create,
    createResult,
    get,
    getRequest,
    getResult,
    history,
    id,
    request,
    requestType,
    step
  ]);

  const defaultBreadcrumbs = useMemo(
    () => (
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          { text: t('breadcrumbs.taskList'), url: '/trb/task-list' },
          { text: t('requestForm.heading') }
        ]}
      />
    ),
    [t]
  );

  if (!step) {
    return null;
  }

  // `Done` has a different layout and is handled seperately
  if (step === 'done') {
    return <Done breadcrumbBar={defaultBreadcrumbs} />;
  }

  if (getResult.error || createResult.error) {
    return (
      <GridContainer className="width-full">
        <NotFoundPartial />
      </GridContainer>
    );
  }

  const stepIdx = formStepSlugs.indexOf(step);
  const stepNum = stepIdx + 1;

  const FormStepComponent = formStepComponents[stepIdx].component;

  const loading = getResult.loading || createResult.loading;

  // console.log('render request form');

  return (
    <>
      {!view && (
        // Do not render the common header if a step subview is used
        <Header
          step={stepNum}
          breadcrumbBar={defaultBreadcrumbs}
          request={request}
          stepsCompleted={stepsCompleted}
        />
      )}
      {request ? (
        <GridContainer className="width-full">
          <FormStepComponent
            request={request}
            refreshRequest={getRequest}
            stepUrl={{
              current: `/trb/requests/${request.id}/${formStepSlugs[stepIdx]}`,
              // No bounds checking on steps since invalid ones are redirected earlier
              // and bad urls can be ignored
              next: `/trb/requests/${request.id}/${formStepSlugs[stepIdx + 1]}`,
              back: `/trb/requests/${request.id}/${formStepSlugs[stepIdx - 1]}`
            }}
          />
        </GridContainer>
      ) : (
        loading && <PageLoading />
      )}
    </>
  );
}

export default RequestForm;
