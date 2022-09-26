import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams /* , useRouteMatch */ } from 'react-router-dom';
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

import Attendees from './Attendees';
import Basic from './Basic';
import Check from './Check';
import Documents from './Documents';
import FormHeader from './FormHeader';
import SubjectAreas from './SubjectAreas';

export interface FormStepComponentProps {
  // eslint-disable-next-line camelcase
  request: CreateTrbRequest_createTRBRequest;
  step: number;
}

/** Form view components for each form request step */
const formStepComponents: ((props: FormStepComponentProps) => JSX.Element)[] = [
  Basic,
  SubjectAreas,
  Attendees,
  Documents,
  Check
];

/**
 * This is a component base for the TRB request form.
 * There are multiple query types handled: create, get, update.
 */
function RequestForm() {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();
  // const { path, url } = useRouteMatch();
  // console.log(path, url);

  const { id, step, view } = useParams<{
    id: string;
    step?: string;
    view?: string;
  }>();

  const requestType: TRBRequestType = TRBRequestType.FOLLOWUP; // temp

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
      else history.push(`/trb`);
    }
    // Fetch request data if not new
    else if (!request && !createResult.called && !getResult.called) {
      get({ variables: { id } });
    }
    // Get or create request was successful
    // Continue any other effects with request data
    else if (request) {
      // Check step param, redirect to step 1 if invalid
      if (!step?.match(RegExp(`[1-${formStepComponents.length}]|(done)`))) {
        history.push(`/trb/requests/${id}/1`);
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

  if (getResult.loading || createResult.loading) {
    return <PageLoading />;
  }

  if (getResult.error || createResult.error) {
    return <NotFoundPartial />;
  }

  // If form steps completed
  if (step === 'done') {
    return <>Done</>;
  }

  const stepNum = Number(step);

  const FormStepComponent = formStepComponents[stepNum - 1];

  const breadcrumbItems = [
    { text: t('heading'), url: '/trb' },
    { text: 'Task List', url: '/trb/task-list' },
    { text: 'TRB Request' }
  ];

  if (FormStepComponent && request) {
    return (
      <>
        {!view && (
          <FormHeader step={stepNum} breadcrumbItems={breadcrumbItems} />
        )}
        <GridContainer className="width-full margin-bottom-10">
          <FormStepComponent step={stepNum} request={request} />
        </GridContainer>
      </>
    );
  }

  return null;
}

export default RequestForm;
