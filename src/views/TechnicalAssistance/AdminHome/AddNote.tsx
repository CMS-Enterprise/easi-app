import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  CharacterCount,
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

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useMessage from 'hooks/useMessage';
import {
  UpdateTrbRequestConsultMeeting,
  UpdateTrbRequestConsultMeetingVariables
} from 'queries/types/UpdateTrbRequestConsultMeeting';
import UpdateTrbRequestConsultMeetingQuery from 'queries/UpdateTrbRequestConsultMeetingQuery';

import Breadcrumbs from '../Breadcrumbs';

import { ModalViewType } from './components/NoteModal';

const AddNote = ({
  setModalView
}: {
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
}) => {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage } = useParams<{
    id: string;
    activePage: string;
    action: 'schedule-consult';
  }>();
  const history = useHistory();

  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl = `/trb/${id}/${activePage}`;

  const [mutate] = useMutation<
    UpdateTrbRequestConsultMeeting,
    UpdateTrbRequestConsultMeetingVariables
  >(UpdateTrbRequestConsultMeetingQuery);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      meetingDate: '',
      meetingTime: '',
      notes: ''
    }
  });

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
                copyTrbMailbox: false,
                notifyEuaIds: ['ABCD']
              }
            }
          })
            .then(result => {
              showMessageOnNextPage(
                <Alert type="success" slim className="margin-top-3">
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
                <Alert type="error" slim className="margin-top-3">
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
                  <CharacterCount
                    {...field}
                    ref={null}
                    id="notes"
                    maxLength={2000}
                    isTextArea
                    rows={2}
                    aria-describedby="notes-info notes-hint"
                    error={!!error}
                  />
                </FormGroup>
              )}
            />

            <h3 className="margin-top-6">
              {t('actionRequestEdits.notificationTitle')}
            </h3>
            <div>{t('actionRequestEdits.notificationDescription')}</div>
            {/* todo cedar contacts */}

            <Alert type="warning" slim>
              {t('actionScheduleConsult.alert')}
            </Alert>
          </Grid>
        </Grid>

        <div>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {t('actionRequestEdits.submit')}
          </Button>
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
};

export default AddNote;
