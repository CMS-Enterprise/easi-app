import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { ApolloError, FetchResult } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { PersonRole } from 'types/graphql-global-types';
import {
  AttendeeFieldLabels,
  TRBAttendeeData,
  TRBAttendeeFields
} from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

import { AttendeeFields, AttendeesList } from './AttendeesForm/components';
import AttendeesForm from './AttendeesForm';
import Pager from './Pager';
import { FormStepComponentProps, StepSubmit } from '.';

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

function Attendees({
  request,
  stepUrl,
  setFormAlert,
  refetchRequest,
  setIsStepSubmitting,
  setStepSubmit,
  taskListUrl
}: FormStepComponentProps) {
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
  const submitAttendee = useCallback(
    (formData: TRBAttendeeFields): Promise<FetchResult> => {
      const { component, role, euaUserId } = formData;
      // If attendee object has ID, update attendee
      if (requester.id) {
        return updateAttendee({
          variables: {
            input: {
              id: requester.id,
              component,
              role: role as PersonRole
            }
          }
        });
      }
      // If no ID is present, create new attendee
      return createAttendee({
        variables: {
          input: {
            trbRequestId: request.id,
            euaUserId,
            component,
            role: role as PersonRole
          }
        }
      });
    },
    [createAttendee, updateAttendee, request.id, requester.id]
  );

  /** Submit requester as attendee */
  const submitForm = useCallback<StepSubmit>(
    callback =>
      // Start the submit promise
      handleSubmit(
        // Validation passed
        async formData => {
          // Submit the input only if there are changes
          if (isDirty) {
            // Submit requester fields
            await submitAttendee(formData)
              // Refresh the RequestForm parent request query
              // to update things like `stepsCompleted`
              .then(() => refetchRequest())
              .catch(() => {
                throw new Error('Error saving attendee');
              });
          }
        },
        // Validation did not pass
        () => {
          // Need to throw from this error handler so that the promise is rejected
          throw new Error('invalid attendees form');
        }
      )()
        // Wait for submit to finish before continuing.
        // This essentially makes sure any effects like
        // `setIsStepSubmitting` are called before unmount.
        .then(
          () => {
            callback?.();
          },
          err => {
            if (err instanceof ApolloError) {
              setFormAlert({
                type: 'error',
                message: t<string>('attendees.alerts.error')
              });
            }
          }
        ),
    [t, handleSubmit, isDirty, refetchRequest, setFormAlert, submitAttendee]
  );

  useEffect(() => {
    setStepSubmit(() => submitForm);
  }, [setStepSubmit, submitForm]);

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <div className="trb-attendees margin-top-2">
      <Switch>
        <Route exact path={`${path}/list`}>
          <AttendeesForm
            backToFormUrl={stepUrl.current}
            activeAttendee={activeAttendee}
            trbRequestId={request.id}
            setFormAlert={setFormAlert}
            taskListUrl={taskListUrl}
          />
        </Route>

        <Route exact path={`${path}`}>
          <Form
            data-testid="trb-attendees-form"
            className="margin-bottom-4 maxw-full"
            onSubmit={e => e.preventDefault()}
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
                // Save requester when navigating to additional attendees form
                onClick={() => {
                  // Check that all requester fields are filled out
                  // This submission should not throw errors if missing fields
                  if (
                    getValues().euaUserId &&
                    getValues().component &&
                    getValues().role
                  ) {
                    submitForm(() => history.push(`${url}/list`));
                  }
                }}
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
                deleteAttendee={(id: string) =>
                  deleteAttendee({ variables: { id } })
                }
              />
            </div>

            <Pager
              className="margin-top-5"
              next={{
                disabled: isSubmitting,
                onClick: () => {
                  submitForm(() => {
                    history.push(stepUrl.next);
                  });
                },
                text: t(
                  attendees.length > 0
                    ? 'Next'
                    : 'attendees.continueWithoutAdding'
                )
              }}
              back={{
                disabled: isSubmitting,
                onClick: () => {
                  submitForm(() => {
                    history.push(stepUrl.back);
                  });
                }
              }}
              saveExitDisabled={isSubmitting}
              submit={submitForm}
              taskListUrl={taskListUrl}
            />
          </Form>
        </Route>
      </Switch>
    </div>
  );
}

export default Attendees;
