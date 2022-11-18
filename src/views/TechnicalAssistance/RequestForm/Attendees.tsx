import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { FetchResult } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { PersonRole } from 'types/graphql-global-types';
import {
  AttendeeFieldLabelsObject,
  TRBAttendeeData,
  TRBAttendeeFields
} from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

import { AttendeeFields, AttendeesList } from './AttendeesForm/components';
import AttendeesForm from './AttendeesForm';
import Pager from './Pager';
import { FormStepComponentProps } from '.';

/** Initial blank attendee object */
export const initialAttendee: TRBAttendeeData = {
  trbRequestId: '',
  userInfo: {
    commonName: '',
    euaUserId: ''
  },
  component: '',
  role: null
};

function Attendees({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  const fieldLabels: AttendeeFieldLabelsObject = t('attendees.fieldLabels', {
    returnObjects: true
  });

  // Active attendee for form fields
  const [activeAttendee, setActiveAttendee] = useState<TRBAttendeeData>({
    ...initialAttendee,
    trbRequestId: request.id
  });

  // Initialize form
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<TRBAttendeeFields>({
    resolver: yupResolver(trbAttendeeSchema)
  });

  // Get TRB attendees
  const {
    data: { attendees, requester, loading },
    createAttendee,
    updateAttendee,
    deleteAttendee
  } = useTRBAttendees({
    trbRequestId: request.id,
    requesterId: request.createdBy
  });

  // Reset form with default values after useTRBAttendees query returns requester
  useEffect(() => {
    const defaultValues: TRBAttendeeFields = {
      euaUserId: requester.userInfo?.euaUserId || '',
      component: requester.component,
      role: requester.role
    };
    reset(defaultValues);
  }, [requester, reset]);

  /** Create or update requester as attendee */
  const submitRequesterAttendee = async (
    formData: TRBAttendeeFields
  ): Promise<FetchResult> => {
    const { component, role, euaUserId } = formData;
    // If requester object has ID, update attendee
    if (requester.id) {
      return updateAttendee({
        id: requester.id,
        component,
        role: role as PersonRole
      });
    }
    // If no ID is present, create new attendee
    return createAttendee({
      trbRequestId: request.id,
      euaUserId,
      component,
      role: role as PersonRole
    });
  };

  /** Function to submit attendee form, used for both requester and additional attendees */
  // Split into separate function so that error handling can be handled in one place
  const submitForm = (
    /** Attendee mutation, either create or update */
    mutate: (
      /** Updated attendee field values */
      attendeeFields: TRBAttendeeFields
    ) => Promise<FetchResult>,
    /** Updated attendee field values */
    formData: TRBAttendeeFields,
    /** URL to send user if successful */
    successUrl: string
  ): void => {
    // Check if values have changed
    if (isDirty) {
      // Execute mutation
      mutate(formData)
        // If successful, send user to next step
        .then(() => history.push(successUrl))
        .catch(() => {
          // If mutation returns error, set custom error message
          setError('euaUserId', {
            type: 'custom',
            // TODO: Update error message
            message: 'Error message here'
          });
        });
    } else {
      // If data has not changed, send user to next step without executing mutation
      history.push(successUrl);
    }
  };

  if (loading) return null;

  return (
    <div className="trb-attendees">
      <Switch>
        <Route exact path={`${path}/list`}>
          <AttendeesForm
            request={request}
            backToFormUrl={stepUrl.current}
            activeAttendee={activeAttendee}
            setActiveAttendee={setActiveAttendee}
          />
        </Route>

        <Route exact path={`${path}`}>
          <Form
            className="margin-bottom-4"
            onSubmit={handleSubmit(formData => {
              submitForm(submitRequesterAttendee, formData, stepUrl.next);
            })}
          >
            <AttendeeFields
              defaultValues={requester}
              fieldLabels={fieldLabels.requester}
              errors={errors}
              setValue={setValue}
              control={control}
            />

            <Divider className="margin-top-4" />

            <h4>{t('attendees.additionalAttendees')}</h4>

            <div className="margin-y-2">
              <UswdsReactLink
                variant="unstyled"
                className="usa-button"
                to={`${url}/list`}
              >
                {t(
                  attendees.length > 0
                    ? 'attendees.addAnotherAttendee'
                    : 'attendees.addAnAttendee'
                )}
              </UswdsReactLink>
            </div>

            <AttendeesList
              attendees={attendees}
              setActiveAttendee={setActiveAttendee}
              id={request.id}
              deleteAttendee={deleteAttendee}
            />

            <Pager
              back={{
                disabled: isSubmitting,
                onClick: () => {
                  submitForm(
                    submitRequesterAttendee,
                    getValues(),
                    stepUrl.back
                  );
                }
              }}
              next={{
                disabled: isSubmitting
                // TODO: Button style / text based on attendees count
                // // Demo next button based on attendees
                // ...(numExample === 0
                //   ? {
                //       text: t('attendees.continueWithoutAdding'),
                //       outline: true
                //     }
                //   : {})
              }}
            />
          </Form>
        </Route>
      </Switch>
    </div>
  );
}

export default Attendees;
