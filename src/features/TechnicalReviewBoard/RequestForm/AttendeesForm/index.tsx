import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, FetchResult } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Icon } from '@trussworks/react-uswds';
import { TRBAttendee } from 'gql/legacyGQL/types/TRBAttendee';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Spinner from 'components/Spinner';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { PersonRole } from 'types/graphql-global-types';
import {
  AttendeeFieldLabels,
  TRBAttendeeFields
} from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../../../../components/Breadcrumbs';
import { initialAttendee } from '../Attendees';
import Pager from '../Pager';
import { TrbFormAlert } from '..';

import { AttendeeFields } from './components';

interface AttendeesFormBaseProps {
  backToFormUrl?: string;
  activeAttendee: TRBAttendee;
  /** Set active attendee - used to edit attendee */
  setActiveAttendee: (activeAttendee: TRBAttendee) => void;
  trbRequestId: string;
  setFormAlert: React.Dispatch<React.SetStateAction<TrbFormAlert>>;
  taskListUrl: string;
}

// Make FormStepComponentProps conditionally required on the presence of fromTaskList
// Used to render Attendees/form from task list outside the scope of initial request form
type AttendeesFormProps =
  | {
      fromTaskList?: true;
      backToFormUrl?: string;
      activeAttendee: TRBAttendee;
      /** Set active attendee - used to edit attendee */
      setActiveAttendee: (activeAttendee: TRBAttendee) => void;
      trbRequestId: string;
      setFormAlert: React.Dispatch<React.SetStateAction<TrbFormAlert>>;
      taskListUrl: string;
    }
  | ({ fromTaskList?: false } & AttendeesFormBaseProps);

function AttendeesForm({
  backToFormUrl,
  activeAttendee,
  setActiveAttendee,
  trbRequestId,
  setFormAlert,
  taskListUrl,
  fromTaskList
}: AttendeesFormProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const [mutationLoading, setMutationLoading] = useState<boolean>(false);

  // Attendee data
  const {
    data: { attendees, requester },
    createAttendee,
    updateAttendee
  } = useTRBAttendees(trbRequestId);

  /** Field labels object from translation file */
  const fieldLabels: {
    create: AttendeeFieldLabels;
    edit: AttendeeFieldLabels;
  } = t('attendees.fieldLabels.attendee', {
    returnObjects: true
  });

  /** Initial attendee values before form values are updated */
  const defaultValues: TRBAttendeeFields = useRef({
    euaUserId: activeAttendee.userInfo?.euaUserId || '',
    component: activeAttendee.component,
    role: activeAttendee.role
  }).current;

  /** Type of form - edit or create */
  const formType = activeAttendee.id ? 'edit' : 'create';

  // Initialize form
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TRBAttendeeFields>({
    resolver: yupResolver(trbAttendeeSchema),
    defaultValues
  });

  // Field values
  const values = watch();

  /** Whether or not the submitted attendee EUA ID is unique compared to the requester and additional attendees */
  const euaUserIdIsUnique = useCallback(
    euaUserId => {
      return [
        // If editing, filter out default euaUserId value
        ...attendees.filter(
          attendee => attendee.userInfo?.euaUserId !== defaultValues.euaUserId
        ),
        requester
      ].every(attendee => attendee.userInfo?.euaUserId !== euaUserId);
    },
    [defaultValues.euaUserId, requester, attendees]
  );

  /** Execute attendee mutation */
  const submitAttendee = (
    formData: TRBAttendeeFields
  ): Promise<FetchResult> => {
    const { component, role, euaUserId } = formData;
    const { id } = activeAttendee;

    setMutationLoading(true);

    // If attendee object has ID, update attendee
    if (id) {
      return updateAttendee({
        id,
        component: component || '',
        role: role as PersonRole
      });
    }
    // If no ID is present, create new attendee
    return createAttendee({
      trbRequestId,
      euaUserId: euaUserId || '',
      component: component || '',
      role: role as PersonRole
    });
  };

  if (backToFormUrl) {
    /** Submit additional attendee fields and return to main attendees form */
    const submitForm = (formData: TRBAttendeeFields) => {
      // If euaUserId is not unique, set field error
      if (!euaUserIdIsUnique(formData.euaUserId)) {
        setError('euaUserId', {
          message: 'Attendee has already been added'
        });
      } else {
        // Submit attendee fields
        submitAttendee(formData)
          .then(() => {
            // Clear errors
            clearErrors('euaUserId');

            setMutationLoading(false);

            // Set active attendee to initial
            setActiveAttendee({ ...initialAttendee, trbRequestId });

            setFormAlert({
              type: 'success',
              message: t<string>(
                `${
                  activeAttendee.id
                    ? 'attendees.alerts.successEdit'
                    : 'attendees.alerts.success'
                }`
              )
            });
            // Return to attendees form
            history.push(backToFormUrl);
          })
          .catch(err => {
            if (err instanceof ApolloError) {
              setMutationLoading(false);

              // Set form error
              setFormAlert({
                type: 'error',
                message: t<string>('attendees.alerts.error')
              });
              // Return to attendees form
              history.push(backToFormUrl);
            }
          });
      }
    };

    return (
      <div className="trb-attendees-list">
        <Breadcrumbs
          items={[
            { text: t('heading'), url: '/trb' },
            { text: t('taskList.heading'), url: '/trb/task-list' },
            {
              text: fromTaskList
                ? t('attendees.heading')
                : t('requestForm.heading'),
              url: backToFormUrl
            },
            {
              text: t(
                activeAttendee.id
                  ? 'attendees.editAttendee'
                  : 'attendees.addAnAttendee'
              )
            }
          ]}
        />
        <PageHeading className="margin-bottom-1 margin-top-5">
          {t(
            activeAttendee.id
              ? 'attendees.editAttendee'
              : 'attendees.addAnAttendee'
          )}
        </PageHeading>
        <p className="font-body-md">{t('attendees.attendeeHelpText')}</p>

        <Form onSubmit={handleSubmit(submitForm)} className="maxw-full">
          <AttendeeFields
            type="attendee"
            activeAttendee={activeAttendee}
            errors={errors}
            clearErrors={clearErrors}
            control={control}
            setValue={setValue}
            fieldLabels={fieldLabels[formType]}
          />

          <div className="display-flex flex-align-center">
            <Pager
              next={{
                text: t(
                  fieldLabels[formType as keyof typeof fieldLabels].submit || ''
                ),
                disabled: isSubmitting || !values.euaUserId || !values.role
              }}
              back={{
                text: t('Cancel'),
                onClick: () => {
                  setActiveAttendee({ ...initialAttendee, trbRequestId });
                  history.push(backToFormUrl);
                },
                disabled: isSubmitting
              }}
              className="border-top-0"
              saveExitHidden
              taskListUrl={taskListUrl}
            />

            {mutationLoading && (
              <Spinner className="margin-left-2 margin-top-2" />
            )}
          </div>
          <div className="margin-top-2">
            <UswdsReactLink
              to={backToFormUrl}
              onClick={() =>
                setActiveAttendee({ ...initialAttendee, trbRequestId })
              }
            >
              <Icon.ArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
              {t(
                activeAttendee.id
                  ? 'attendees.dontEditAndReturn'
                  : 'attendees.dontAddAndReturn'
              )}
            </UswdsReactLink>
          </div>
        </Form>
      </div>
    );
  }

  return null;
}

export default AttendeesForm;
