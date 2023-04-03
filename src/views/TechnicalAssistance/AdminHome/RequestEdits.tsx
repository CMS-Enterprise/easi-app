import React, { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  ErrorMessage,
  Form,
  FormGroup,
  GridContainer,
  IconArrowBack
} from '@trussworks/react-uswds';

import EmailRecipientFields from 'components/EmailRecipientFields';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useMessage from 'hooks/useMessage';
import useTRBAttendees from 'hooks/useTRBAttendees';
import CreateTrbRequestFeedbackQuery from 'queries/CreateTrbRequestFeedbackQuery';
import {
  CreateTrbRequestFeedback,
  CreateTrbRequestFeedbackVariables
} from 'queries/types/CreateTrbRequestFeedback';
import { TRBFeedbackAction } from 'types/graphql-global-types';
import { TrbRecipientFields } from 'types/technicalAssistance';
import { trbFeedbackSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../Breadcrumbs';

interface RequestEditsFields extends TrbRecipientFields {
  feedbackMessage: string;
}

function RequestEdits() {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage, action } = useParams<{
    id: string;
    activePage: string;
    action: 'request-edits' | 'ready-for-consult';
  }>();
  const history = useHistory();

  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const {
    data: { attendees, requester, loading },
    createAttendee
  } = useTRBAttendees(id);

  const requestUrl = `/trb/${id}/${activePage}`;

  let actionText: 'actionRequestEdits' | 'actionReadyForConsult';
  let feedbackAction: TRBFeedbackAction;

  if (action === 'request-edits') {
    actionText = 'actionRequestEdits';
    feedbackAction = TRBFeedbackAction.REQUEST_EDITS;
  } else {
    actionText = 'actionReadyForConsult';
    feedbackAction = TRBFeedbackAction.READY_FOR_CONSULT;
  }

  const defaultValues: RequestEditsFields = useMemo(
    () => ({
      feedbackMessage: '',
      copyTrbMailbox: true,
      notifyEuaIds: requester?.userInfo?.euaUserId
        ? [requester?.userInfo?.euaUserId]
        : []
    }),
    [requester]
  );

  const actionForm = useForm<RequestEditsFields>({
    resolver: yupResolver(trbFeedbackSchema),
    defaultValues
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isDirty, isSubmitting }
  } = actionForm;

  const [sendFeedback] = useMutation<
    CreateTrbRequestFeedback,
    CreateTrbRequestFeedbackVariables
  >(CreateTrbRequestFeedbackQuery);

  useEffect(() => {
    if (!isDirty && !loading) {
      reset(defaultValues);
    }
  }, [isDirty, loading, reset, defaultValues]);

  const submitForm = (formData: RequestEditsFields) => {
    sendFeedback({
      variables: {
        input: { ...formData, trbRequestId: id, action: feedbackAction }
      }
    })
      .then(result => {
        showMessageOnNextPage(
          <Alert type="success" slim className="margin-top-3">
            {t(`${actionText}.success`)}
          </Alert>
        );
        history.push(requestUrl);
      })
      .catch(err => {
        showMessage(
          <Alert type="error" slim className="margin-top-3">
            {t(`${actionText}.error`)}
          </Alert>
        );
      });
  };

  if (loading) return null;

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
            text: t(
              'adminHome.taskStatuses.attendConsultStatus.READY_TO_SCHEDULE'
            )
          }
        ]}
      />

      {message}

      <PageHeading className="margin-bottom-0">
        {t(`${actionText}.heading`)}
      </PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {t(`${actionText}.description`)}
      </p>

      <Form
        onSubmit={handleSubmit(formData => submitForm(formData))}
        className="maxw-full margin-bottom-205 tablet:grid-col-12 desktop:grid-col-6"
      >
        <p className="margin-top-1 text-base">
          <Trans
            i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
            components={{ red: <span className="text-red" /> }}
          />
        </p>
        <Controller
          name="feedbackMessage"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="feedbackMessage"
                  className="text-normal margin-top-6"
                  required
                >
                  {t(`${actionText}.label`)}
                </Label>
                <HelpText id="feedbackmessage-hint">
                  {t('actionRequestEdits.hint')}
                </HelpText>
                {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
                <TextAreaField
                  id="feedbackMessage"
                  {...field}
                  ref={null}
                  aria-describedby="feedbackMessage-info feedbackMessage-hint"
                />
              </FormGroup>
            );
          }}
        />
        <h3 className="margin-top-6 margin-bottom-0">
          {t('actionRequestEdits.notificationTitle')}
        </h3>
        <p className="margin-0 line-height-body-5">
          {t('actionRequestEdits.notificationDescription')}
        </p>

        <FormProvider {...actionForm}>
          <EmailRecipientFields
            requester={requester}
            attendees={attendees}
            createAttendee={input =>
              createAttendee({ variables: { input } }).then(result =>
                setValue('notifyEuaIds', [
                  ...getValues('notifyEuaIds'),
                  input.euaUserId
                ])
              )
            }
            className="margin-top-4 margin-bottom-3"
          />
        </FormProvider>

        <Button type="submit" disabled={isSubmitting}>
          {t('actionRequestEdits.submit')}
        </Button>
      </Form>

      <UswdsReactLink
        to={requestUrl}
        className="display-flex flex-align-center"
      >
        <IconArrowBack className="margin-right-05" />
        {t('actionRequestEdits.cancelAndReturn')}
      </UswdsReactLink>
    </GridContainer>
  );
}

export default RequestEdits;
