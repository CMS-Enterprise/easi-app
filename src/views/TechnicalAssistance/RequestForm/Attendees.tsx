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
  AttendeeFieldLabels,
  SubmitFormType,
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

  /** Field labels object from translation file */
  const fieldLabels: AttendeeFieldLabels = t(
    'attendees.fieldLabels.requester',
    {
      returnObjects: true
    }
  );

  /**
   * Active attendee for form fields
   *
   * Used to set field values when creating or editing attendee
   */
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

  /**
   * Get TRB attendees data and mutations
   */
  const {
    data: { attendees, requester, loading },
    createAttendee,
    updateAttendee,
    deleteAttendee
  } = useTRBAttendees(request.id);

  /**
   * Reset form with default values after useTRBAttendees query returns requester
   */
  useEffect(() => {
    /** Default reqiester values */
    const defaultValues: TRBAttendeeFields = {
      euaUserId: requester.userInfo?.euaUserId || '',
      component: requester.component,
      role: requester.role
    };
    // Reset form
    reset(defaultValues);
  }, [requester, reset]);

  /**
   * Create or update requester as attendee
   */
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

  /**
   * Function to submit TRB attendee form
   *
   * Used for both requester and additional attendees
   */
  const submitForm: SubmitFormType = (mutate, formData, successUrl) => {
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
            submitForm={submitForm}
          />
        </Route>

        <Route exact path={`${path}`}>
          <Form
            className="margin-bottom-4"
            onSubmit={handleSubmit(formData => {
              submitForm(submitRequesterAttendee, formData, stepUrl.next);
            })}
          >
            {/* Requester Fields */}
            <AttendeeFields
              type="requester"
              defaultValues={requester}
              fieldLabels={fieldLabels}
              errors={errors}
              setValue={setValue}
              control={control}
            />

            <Divider className="margin-top-4" />

            <h4>{t('attendees.additionalAttendees')}</h4>

            {/* Button to add additional attendee */}
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

            {/* List of additional attendees */}
            <AttendeesList
              attendees={attendees}
              setActiveAttendee={setActiveAttendee}
              trbRequestId={request.id}
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
