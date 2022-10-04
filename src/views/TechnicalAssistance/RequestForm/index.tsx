import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GridContainer } from '@trussworks/react-uswds';

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
// import {
//   UpdateTrbRequest,
//   UpdateTrbRequestVariables
// } from 'queries/types/UpdateTrbRequest';
// import UpdateTrbRequestQuery from 'queries/UpdateTrbRequestQuery';
import { TRBRequestType } from 'types/graphql-global-types';
import { NotFoundPartial } from 'views/NotFound';

import Breadcrumbs from '../Breadcrumbs';

import Attendees from './Attendees';
import Basic from './Basic';
import Check from './Check';
import Documents from './Documents';
import Done from './Done';
import FormStepHeader from './FormStepHeader';
import SubjectAreas from './SubjectAreas';

export interface FormStepComponentProps {
  // eslint-disable-next-line camelcase
  request: CreateTrbRequest_createTRBRequest;
  stepUrl: {
    current: string;
    next: string;
    back: string;
  };
  breadcrumbs?: JSX.Element;
}

/** Form view components with step url slugs for each form request step */
export const formStepComponents: Readonly<
  {
    component: (props: FormStepComponentProps) => JSX.Element;
    step: string;
  }[]
> = [
  { component: Basic, step: 'basic' },
  { component: SubjectAreas, step: 'subject' },
  { component: Attendees, step: 'attendees' },
  { component: Documents, step: 'documents' },
  { component: Check, step: 'check' },
  { component: Done, step: 'done' }
] as const;

/** Mapped form step slugs from `formStepComponents` */
const formSteps = formStepComponents.map(f => f.step);

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
    /** Form step slug */
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

  // const [update, updateResult] = useMutation<
  //   UpdateTrbRequest,
  //   UpdateTrbRequestVariables
  // >(UpdateTrbRequestQuery);
  // todo update, updateResult

  // Assign request data from the first available query response
  // Prioritize by latest type: update, get, create
  // eslint-disable-next-line camelcase
  const request: CreateTrbRequest_createTRBRequest | undefined =
    getResult.data?.trbRequest || createResult.data?.createTRBRequest;
  // const data = useMemo(() => {
  //   if (getResult.data) {
  //     return getResult.data.trbRequest;
  //   }
  //   if (createResult.data) {
  //     return createResult.data.createTRBRequest;
  //   }
  //   return undefined;
  // }, [getResult, createResult]);
  // console.log('data', request);

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
              history.push(`/trb/requests/${res.data.createTRBRequest.id}`);
            }
          });
        }
      }
      // Redirect to the start if there's no request type
      else history.push('/trb/start');
    }
    // Fetch request data if not new
    else if (!request && !createResult.called && !getResult.called) {
      get({ variables: { id } });
    }
    // Get or create request was successful
    // Continue any other effects with request data
    else if (request) {
      // Check step param, redirect to the first step if invalid
      if (!step || !formSteps.includes(step)) {
        history.push(`/trb/requests/${id}/${formSteps[0]}`);
      }
    }
  }, [
    create,
    createResult,
    get,
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

  if (getResult.loading || createResult.loading) {
    return <PageLoading />;
  }

  if (!step || getResult.error || createResult.error) {
    return <NotFoundPartial />;
  }

  const stepIdx = formSteps.indexOf(step);
  const stepNum = stepIdx + 1;

  const FormStepComponent = formStepComponents[stepIdx].component;

  if (FormStepComponent && request) {
    const formProps = {
      request,
      stepUrl: {
        current: `/trb/requests/${request.id}/${formSteps[stepIdx]}`,
        // No bounds checking on formSteps since invalid views are redirected earlier
        // and bad urls can be ignored
        next: `/trb/requests/${request.id}/${formSteps[stepIdx + 1]}`,
        back: `/trb/requests/${request.id}/${formSteps[stepIdx - 1]}`
      }
    };

    // `Done` does not use `FormStepHeader` and is handled seperately
    if (step === 'done') {
      return (
        <FormStepComponent {...formProps} breadcrumbs={defaultBreadcrumbs} />
      );
    }

    return (
      <>
        {!view && (
          // Do not render the common header if a step subview is used
          <FormStepHeader step={stepNum} breadcrumbs={defaultBreadcrumbs} />
        )}
        <GridContainer className="width-full">
          <FormStepComponent {...formProps} />
        </GridContainer>
      </>
    );
  }

  return null;
}

export default RequestForm;
