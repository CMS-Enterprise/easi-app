import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  DatePicker,
  ErrorMessage,
  FormGroup,
  Label,
  TimePicker
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import Alert from 'components/shared/Alert';
import TextAreaField from 'components/shared/TextAreaField';
import useMessage from 'hooks/useMessage';
import {
  UpdateTrbRequestConsultMeeting,
  UpdateTrbRequestConsultMeetingVariables
} from 'queries/types/UpdateTrbRequestConsultMeeting';
import UpdateTrbRequestConsultMeetingQuery from 'queries/UpdateTrbRequestConsultMeetingQuery';
import { TrbRecipientFields } from 'types/technicalAssistance';
import { consultSchema } from 'validations/trbRequestSchema';

import useActionForm from './components/ActionFormWrapper/useActionForm';

interface ConsultFields extends TrbRecipientFields {
  notes: string;
  meetingDate: string;
  meetingTime: string;
}

function Consult() {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage } = useParams<{
    id: string;
    activePage: string;
    action: 'schedule-consult';
  }>();
  const history = useHistory();

  const { showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl = `/trb/${id}/${activePage}`;

  const [mutate, mutationResult] = useMutation<
    UpdateTrbRequestConsultMeeting,
    UpdateTrbRequestConsultMeetingVariables
  >(UpdateTrbRequestConsultMeetingQuery);

  const {
    ActionForm,
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting }
  } = useActionForm<ConsultFields>({
    trbRequestId: id,
    resolver: yupResolver(consultSchema),
    defaultValues: {
      meetingDate: '',
      meetingTime: '',
      notes: '',
      copyTrbMailbox: true,
      notifyEuaIds: []
    }
  });

  const submitForm = (formData: ConsultFields) => {
    // Format the time as utc iso from the components' default local format
    const consultMeetingTime = DateTime.fromFormat(
      `${formData.meetingDate} ${formData.meetingTime}`,
      'MM/dd/yyyy HH:mm'
    )
      .toUTC()
      .toISO();

    mutate({
      variables: {
        input: {
          trbRequestId: id,
          consultMeetingTime,
          notes: formData.notes,
          copyTrbMailbox: formData.copyTrbMailbox,
          notifyEuaIds: formData.notifyEuaIds
        }
      }
    })
      .then(result => {
        showMessageOnNextPage(
          <Alert type="success" className="margin-top-3">
            {t('actionScheduleConsult.success', {
              date: formData.meetingDate,
              time: DateTime.fromFormat(formData.meetingTime, 'HH:mm')
                .toFormat('t')
                .toLowerCase(),
              interpolation: {
                escapeValue: false
              }
            })}
          </Alert>
        );
        history.push(requestUrl);
      })
      .catch(err => {
        showMessage(
          <Alert type="error" className="margin-top-3">
            {t('actionScheduleConsult.error')}
          </Alert>
        );
      });
  };

  return (
    <ActionForm
      title={t('actionScheduleConsult.heading')}
      description={t('actionScheduleConsult.description')}
      onSubmit={handleSubmit(formData => submitForm(formData))}
      breadcrumbItems={[
        {
          text: t('actionScheduleConsult.breadcrumb')
        }
      ]}
      buttonProps={{
        next: {
          text: t('actionRequestEdits.submit'),
          disabled: mutationResult.loading || !isDirty,
          loading: isSubmitting || mutationResult.loading
        },
        taskListUrl: requestUrl,
        saveExitText: t('actionRequestEdits.cancelAndReturn')
      }}
      submitWarning={t('actionScheduleConsult.alert')}
    >
      {/* Meeting date */}
      <div className="date-time-wrapper">
        <Controller
          name="meetingDate"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                htmlFor={field.name}
                hint={
                  <div className="margin-top-1">
                    {t('actionScheduleConsult.hints.meetingDate')}
                  </div>
                }
                className="text-normal"
                error={!!error}
              >
                {t('actionScheduleConsult.labels.meetingDate')}{' '}
                <span className="text-red">*</span>
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <DatePicker
                id={field.name}
                name={field.name}
                className="margin-top-1"
                onChange={val => {
                  field.onChange(val);
                }}
              />
            </FormGroup>
          )}
        />
        {/* Meeting time */}
        <Controller
          name="meetingTime"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                htmlFor={field.name}
                hint={
                  <div className="margin-top-1">
                    {t('actionScheduleConsult.hints.meetingTime')}
                  </div>
                }
                className="text-normal"
                error={!!error}
              >
                {t('actionScheduleConsult.labels.meetingTime')}{' '}
                <span className="text-red">*</span>
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <TimePicker
                id={field.name}
                name={field.name}
                onChange={val => {
                  if (val) field.onChange(val);
                }}
                step={5}
              />
            </FormGroup>
          )}
        />
      </div>
      {/* Notes */}
      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormGroup>
            <Label htmlFor="notes" className="text-normal">
              {t('actionScheduleConsult.labels.notes')}
            </Label>
            <TextAreaField
              {...field}
              ref={null}
              id={field.name}
              aria-describedby="notes-info notes-hint"
              error={!!error}
            />
          </FormGroup>
        )}
      />
    </ActionForm>
  );
}

export default Consult;
