import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { FetchResult } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@trussworks/react-uswds';
import classNames from 'classnames';

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
    clearErrors,
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
    data: { attendees, requester },
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
   * Create or update  attendee
   */
  const submitAttendee = async (
    formData: TRBAttendeeFields,
    id?: string
  ): Promise<FetchResult> => {
    const { component, role, euaUserId } = formData;
    // If attendee object has ID, update attendee
    if (id) {
      return updateAttendee({
        id,
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
   */
  const submitForm: SubmitFormType = (formData, successUrl, id) => {
    // Execute mutation
    submitAttendee(formData, id)
      // If successful, send user to next step
      .then(() => {
        history.push(successUrl);
        clearErrors();
      })
      .catch(() => {
        // If mutation returns error, set custom error message
        setError('euaUserId', {
          type: 'custom',
          // TODO: Update error message
          message: 'Error message here'
        });
      });
  };

  return (
    <div className="trb-attendees">
      <Switch>
        <Route exact path={`${path}/list`}>
          <AttendeesForm
            backToFormUrl={stepUrl.current}
            activeAttendee={activeAttendee}
            submitForm={submitForm}
            trbRequestId={request.id}
          />
        </Route>

        <Route exact path={`${path}`}>
          <Form
            className="margin-bottom-4 maxw-full"
            onSubmit={handleSubmit(formData => {
              if (isDirty) {
                submitForm(formData, stepUrl.next, requester.id);
              } else {
                history.push(stepUrl.next);
              }
            })}
          >
            {/* Requester Fields */}
            <AttendeeFields
              type="requester"
              activeAttendee={requester}
              fieldLabels={fieldLabels}
              errors={errors}
              clearErrors={clearErrors}
              setValue={setValue}
              control={control}
            />

            <Divider />

            <div className="margin-bottom-6">
              <h4 className="margin-bottom-2">
                {t('attendees.additionalAttendees')}
              </h4>

              {/* Button to add additional attendee */}
              <UswdsReactLink
                variant="unstyled"
                className={classNames('usa-button', 'margin-top-0', {
                  'usa-button--outline': attendees.length > 0
                })}
                to={`${url}/list`}
              >
                {t(
                  attendees.length > 0
                    ? 'attendees.addAnotherAttendee'
                    : 'attendees.addAnAttendee'
                )}
              </UswdsReactLink>

              {/* List of additional attendees */}
              <AttendeesList
                attendees={attendees}
                setActiveAttendee={setActiveAttendee}
                trbRequestId={request.id}
                deleteAttendee={deleteAttendee}
              />
            </div>

            <Pager
              back={{
                disabled: isSubmitting,
                onClick: () => {
                  submitForm(getValues(), stepUrl.back, requester.id);
                }
              }}
              next={{
                disabled: isSubmitting,
                text:
                  attendees.length > 0
                    ? t('Next')
                    : t('attendees.continueWithoutAdding')
              }}
            />
          </Form>
        </Route>
      </Switch>
    </div>
  );
}

export default Attendees;
