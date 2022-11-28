import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, IconArrowBack } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import useTRBAttendees from 'hooks/useTRBAttendees';
import {
  AttendeeFieldLabels,
  SubmitFormType,
  TRBAttendeeData,
  TRBAttendeeFields
} from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../../Breadcrumbs';
import Pager from '../Pager';

import { AttendeeFields } from './components';

interface AttendeesFormProps {
  backToFormUrl?: string;
  activeAttendee: TRBAttendeeData;
  submitForm: SubmitFormType;
  trbRequestId: string;
}

function AttendeesForm({
  backToFormUrl,
  activeAttendee,
  submitForm,
  trbRequestId
}: AttendeesFormProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  // Attendee data
  const {
    data: { attendees, requester }
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

  const validateUniqueEuaUserId = (euaUserId: string): boolean => {
    /** Whether EUA ID is unique compared to attendees and requester */
    return [
      // If editing, filter out default euaUserId value
      ...attendees.filter(
        attendee => attendee.userInfo?.euaUserId !== defaultValues.euaUserId
      ),
      requester
    ].every(attendee => attendee.userInfo?.euaUserId !== euaUserId);
  };

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
        <PageHeading className="margin-bottom-1">
          {t(
            activeAttendee.id
              ? 'attendees.editAttendee'
              : 'attendees.addAnAttendee'
          )}
        </PageHeading>
        <p className="font-body-md">{t('attendees.attendeeHelpText')}</p>

        <Form
          onSubmit={handleSubmit(formData => {
            // Check if field values have changed
            if (isDirty) {
              // Check whether EUA ID is unique
              if (validateUniqueEuaUserId(formData.euaUserId)) {
                // Submit form
                submitForm(formData, backToFormUrl, activeAttendee.id);
              } else {
                // If EUA ID is not unique, set field error
                setError('euaUserId', {
                  message: 'Attendee name must be unique'
                });
              }
            } else {
              // If field values have not been changed, return to TRB form without submitting
              history.push(backToFormUrl);
            }
          })}
          className="maxw-full"
        >
          <AttendeeFields
            type="attendee"
            activeAttendee={activeAttendee}
            errors={errors}
            clearErrors={clearErrors}
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
