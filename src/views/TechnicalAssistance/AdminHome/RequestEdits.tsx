import React, { useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';

import EmailRecipientFields from 'components/EmailRecipientFields';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import TextAreaField from 'components/shared/TextAreaField';
import useMessage from 'hooks/useMessage';
import useTRBAttendees from 'hooks/useTRBAttendees';
import CreateTrbRequestFeedbackQuery from 'queries/CreateTrbRequestFeedbackQuery';
import {
  CreateTrbRequestFeedback,
  CreateTrbRequestFeedbackVariables
} from 'queries/types/CreateTrbRequestFeedback';
import {
  CreateTRBRequestFeedbackInput,
  TRBFeedbackAction
} from 'types/graphql-global-types';

import Breadcrumbs from '../Breadcrumbs';

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
    data: { attendees, requester, loading }
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

  const defaultValues = useMemo(
    () => ({
      trbRequestId: id,
      action: feedbackAction,
      feedbackMessage: '',
      copyTrbMailbox: true,
      notifyEuaIds: requester?.userInfo?.euaUserId
        ? [requester?.userInfo?.euaUserId]
        : []
    }),
    [id, requester, feedbackAction]
  );

  const actionForm = useForm<CreateTRBRequestFeedbackInput>({
    defaultValues
  });

  const {
    control,
    handleSubmit,
    reset,
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

  const submitForm = (formData: CreateTRBRequestFeedbackInput) => {
    sendFeedback({
      variables: {
        input: formData
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

      <Grid row>
        <PageHeading className="margin-bottom-0">
          {t(`${actionText}.heading`)}
        </PageHeading>
        <div className="line-height-body-5 font-body-lg text-light">
          {t(`${actionText}.description`)}
        </div>
      </Grid>
      <Grid row gap>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Form
            onSubmit={handleSubmit(formData => submitForm(formData))}
            className="maxw-full"
          >
            <div className="margin-top-1 text-base">
              <Trans
                i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
                components={{ red: <span className="text-red" /> }}
              />
            </div>
            <Controller
              name="feedbackMessage"
              control={control}
              render={({ field }) => {
                return (
                  <FormGroup>
                    <Label
                      htmlFor="feedbackMessage"
                      hint={
                        <div className="margin-top-1">
                          {t('actionRequestEdits.hint')}
                        </div>
                      }
                      className="text-normal margin-top-6"
                    >
                      {t(`${actionText}.label`)}
                      {/* Show the required marker when the action is `request-edits` */}
                      {action === 'request-edits' && (
                        <>
                          {' '}
                          <span className="text-red">*</span>
                        </>
                      )}
                    </Label>
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
            <h3 className="margin-top-6">
              {t('actionRequestEdits.notificationTitle')}
            </h3>
            <div>{t('actionRequestEdits.notificationDescription')}</div>

            <FormProvider {...actionForm}>
              <EmailRecipientFields
                requester={requester}
                attendees={attendees}
              />
            </FormProvider>

            <div>
              <Button
                type="submit"
                className=""
                // `feedbackMessage` is required for `request-edits` action
                // Disable submit if request-edits feedbackMessage undefined
                disabled={
                  (action === 'request-edits' && !isDirty) || isSubmitting
                }
              >
                {t('actionRequestEdits.submit')}
              </Button>
            </div>
          </Form>
        </Grid>
      </Grid>
      <div className="margin-top-2">
        <UswdsReactLink to={requestUrl}>
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default RequestEdits;
