import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, IconArrowBack } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { CreateTrbRequest_createTRBRequest as TRBRequest } from 'queries/types/CreateTrbRequest';
import { PersonRole } from 'types/graphql-global-types';
import {
  AttendeeFieldLabels,
  SubmitFormType,
  TRBAttendeeData,
  TRBAttendeeFields
} from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../../Breadcrumbs';
import { initialAttendee } from '../Attendees';
import Pager from '../Pager';

import { AttendeeFields } from './components';

interface AttendeesFormProps {
  request: TRBRequest;
  backToFormUrl?: string;
  activeAttendee: TRBAttendeeData;
  setActiveAttendee: (value: TRBAttendeeData) => void;
  submitForm: SubmitFormType;
}

function AttendeesForm({
  request,
  backToFormUrl,
  activeAttendee,
  setActiveAttendee,
  submitForm
}: AttendeesFormProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  /** Field labels object from translation file */
  const fieldLabels: {
    create: AttendeeFieldLabels;
    edit: AttendeeFieldLabels;
  } = t('attendees.fieldLabels.attendee', {
    returnObjects: true
  });

  /** Initial attendee values before form values are updated */
  const defaultValues: TRBAttendeeData = useRef(activeAttendee).current;

  // Attendee mutations
  const { createAttendee, updateAttendee } = useTRBAttendees(request.id);

  /** Type of form - edit or create */
  const formType = activeAttendee.id ? 'edit' : 'create';

  // Initialize form
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<TRBAttendeeFields>({
    resolver: yupResolver(trbAttendeeSchema),
    defaultValues
  });

  if (backToFormUrl) {
    /** Create or update attendee with field values */
    const submitAttendee = (formData: TRBAttendeeFields) => {
      /** Attendee component and role */
      const input = {
        component: formData.component,
        role: formData.role as PersonRole
      };
      // If editing attendee, add ID to input and update attendee
      if (activeAttendee.id) {
        updateAttendee({
          ...input,
          id: activeAttendee.id
        })
          .catch(e => setError('euaUserId', { type: 'custom', message: e }))
          // If no errors, return to previous page
          .then(response => {
            if (response && response.data) {
              history.push(backToFormUrl);
              // Clear errors
              clearErrors();
              // Reset active attendee
              setActiveAttendee(initialAttendee);
            } else {
              setError('euaUserId', {
                type: 'custom',
                message: 'TODO: ERROR MESSAGE HERE'
              });
            }
          });
      } else {
        // If creating attendee, add EUA and TRB request id and create attendee
        createAttendee({
          ...input,
          trbRequestId: request.id,
          euaUserId: formData.euaUserId
        })
          .catch(e => null)
          // If no errors, return to previous page
          .then(response => {
            if (response) {
              history.push(backToFormUrl);
              // Reset active attendee
              setActiveAttendee(initialAttendee);
            }
          });
      }
    };

    return (
      <div className="trb-attendees-list">
        <Breadcrumbs
          items={[
            { text: t('heading'), url: '/trb' },
            { text: t('breadcrumbs.taskList'), url: '/trb/task-list' },
            {
              text: t('requestForm.heading'),
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
        <PageHeading>
          {t(
            activeAttendee.id
              ? 'attendees.editAttendee'
              : 'attendees.addAnAttendee'
          )}
        </PageHeading>

        <Form
          onSubmit={handleSubmit(formData => {
            if (isDirty) {
              submitAttendee(formData);
            } else {
              history.push(backToFormUrl);
            }
          })}
        >
          <AttendeeFields
            type="attendee"
            defaultValues={defaultValues}
            errors={errors}
            control={control}
            setValue={setValue}
            fieldLabels={fieldLabels[formType]}
          />
          <Pager
            next={{
              text: t(
                fieldLabels[formType as keyof typeof fieldLabels].submit || ''
              ),
              disabled: isSubmitting
            }}
            back={{
              text: t('Cancel'),
              onClick: () => history.push(backToFormUrl),
              disabled: isSubmitting
            }}
            className="border-top-0"
            saveExitDisabled
          />
          <div className="margin-top-2">
            <UswdsReactLink to={backToFormUrl}>
              <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
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
