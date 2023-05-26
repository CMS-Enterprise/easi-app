import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  DatePicker,
  ErrorMessage,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  TimePicker
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import EmailRecipientFields from 'components/EmailRecipientFields';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import TextAreaField from 'components/shared/TextAreaField';
import Spinner from 'components/Spinner';
import useMessage from 'hooks/useMessage';
import useTRBAttendees from 'hooks/useTRBAttendees';
import {
  UpdateTrbRequestConsultMeeting,
  UpdateTrbRequestConsultMeetingVariables
} from 'queries/types/UpdateTrbRequestConsultMeeting';
import UpdateTrbRequestConsultMeetingQuery from 'queries/UpdateTrbRequestConsultMeetingQuery';
import { TrbRecipientFields } from 'types/technicalAssistance';
import { consultSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../Breadcrumbs';

interface ConsultFields extends TrbRecipientFields {
  notes: string;
  meetingDate: string;
  meetingTime: string;
}

function Consult() {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
    action: 'schedule-consult';
  }>();
  const history = useHistory();

  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const {
    data: { attendees, requester },
    createAttendee
  } = useTRBAttendees(id);

  const requestUrl = `/trb/${id}/request`;

  const [mutate, mutationResult] = useMutation<
    UpdateTrbRequestConsultMeeting,
    UpdateTrbRequestConsultMeetingVariables
  >(UpdateTrbRequestConsultMeetingQuery);

  const actionForm = useForm<ConsultFields>({
    resolver: yupResolver(consultSchema),
    defaultValues: {
      meetingDate: '',
      meetingTime: '',
      notes: '',
      copyTrbMailbox: true,
      notifyEuaIds: []
    }
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = actionForm;

  const formSubmitting: boolean = isSubmitting || mutationResult.loading;

  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-basic-fields-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: `/trb` },
          {
            text: t('adminHome.breadcrumb', { trbRequestId: id }),
            url: requestUrl
          },
          {
            text: t('actionScheduleConsult.breadcrumb')
          }
        ]}
      />

      {message}

      <Form
        onSubmit={handleSubmit(formData => {
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
        })}
        className="maxw-full"
      >
        <Grid row>
          <Grid col>
            <PageHeading className="margin-bottom-0">
              {t('actionScheduleConsult.heading')}
            </PageHeading>
            <div className="line-height-body-5 font-body-lg text-light">
              {t('actionScheduleConsult.description')}
            </div>
            <div className="margin-top-1 margin-bottom-4 text-base">
              <Trans
                i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
                components={{ red: <span className="text-red" /> }}
              />
            </div>

            {hasErrors && (
              <Alert
                heading={t('errors.checkFix')}
                type="error"
                className="trb-basic-fields-error"
                slim={false}
              >
                {Object.keys(errors).map(fieldName => {
                  const msg: string = t(
                    `actionScheduleConsult.labels.${fieldName}`
                  );
                  return (
                    <ErrorAlertMessage
                      key={fieldName}
                      errorKey={fieldName}
                      message={msg}
                    />
                  );
                })}
              </Alert>
            )}
          </Grid>
        </Grid>

        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            {/* Meeting date */}
            <div className="date-time-wrapper">
              <Controller
                name="meetingDate"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <FormGroup error={!!error}>
                    <Label
                      htmlFor="meetingDate"
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
                    {error && (
                      <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                    )}
                    <DatePicker
                      id="meetingDate"
                      name="meetingDate"
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
                      htmlFor="meetingTime"
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
                    {error && (
                      <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                    )}
                    <TimePicker
                      id="meetingTime"
                      name="meetingTime"
                      onChange={val => {
                        field.onChange(val);
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

            <h3 className="margin-top-6">
              {t('actionRequestEdits.notificationTitle')}
            </h3>
            <p className="margin-y-0">
              {t('actionRequestEdits.notificationDescription')}
            </p>

            <FormProvider<ConsultFields> {...actionForm}>
              <EmailRecipientFields
                requester={requester}
                contacts={attendees}
                mailboxes={[
                  {
                    key: 'copyTrbMailbox',
                    label: t('emailRecipientFields.copyTrbMailbox')
                  }
                ]}
                createContact={contact =>
                  createAttendee({ ...contact, trbRequestId: id })
                }
                className="margin-top-4 margin-bottom-3"
              />
            </FormProvider>

            <Alert type="warning" slim>
              {t('actionScheduleConsult.alert')}
            </Alert>
          </Grid>
        </Grid>

        <div className="display-flex flex-align-center margin-top-5">
          <Button
            type="submit"
            disabled={!isDirty || formSubmitting}
            className="margin-top-0 margin-right-105"
          >
            {t('actionRequestEdits.submit')}
          </Button>
          {formSubmitting && <Spinner />}
        </div>
      </Form>

      <div className="margin-top-2">
        <UswdsReactLink to={requestUrl}>
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default Consult;
