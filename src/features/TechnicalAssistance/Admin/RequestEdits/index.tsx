import React, { useContext, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage, FormGroup } from '@trussworks/react-uswds';
import {
  TRBFeedbackAction,
  TRBFeedbackStatus,
  TRBFormStatus,
  useCreateTRBRequestFeedbackMutation
} from 'gql/generated/graphql';

import HelpText from 'components/HelpText';
import Label from 'components/Label';
import PageLoading from 'components/PageLoading';
import RichTextEditor from 'components/RichTextEditor';
import toastSuccess from 'components/ToastSuccess';
import { TrbRecipientFields } from 'types/technicalAssistance';
import { trbActionSchema } from 'validations/trbRequestSchema';

import useActionForm from '../_components/ActionFormWrapper/useActionForm';
import { TRBRequestContext } from '../_components/RequestContext';

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

  const requestUrl = `/trb/${id}/${activePage}`;

  const formContext = useContext(TRBRequestContext);
  const { loading: contextLoading } = formContext;

  const { formStatus, feedbackStatus } =
    formContext?.data?.trbRequest?.taskStatuses || {};

  let actionText: 'actionRequestEdits' | 'actionReadyForConsult';
  let feedbackAction: TRBFeedbackAction;

  if (action === 'request-edits') {
    actionText = 'actionRequestEdits';
    feedbackAction = TRBFeedbackAction.REQUEST_EDITS;
  } else {
    actionText = 'actionReadyForConsult';
    feedbackAction = TRBFeedbackAction.READY_FOR_CONSULT;
  }

  const {
    control,
    ActionForm,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = useActionForm<RequestEditsFields>({
    trbRequestId: id,
    resolver: yupResolver(
      trbActionSchema(
        'feedbackMessage',
        feedbackAction === TRBFeedbackAction.REQUEST_EDITS
      )
    ),
    defaultValues: {
      feedbackMessage: '',
      copyTrbMailbox: true
    }
  });

  const [sendFeedback, feedbackResult] = useCreateTRBRequestFeedbackMutation();

  const submitForm = (formData: RequestEditsFields) => {
    // Filter out fields that don't belong in the TRB feedback input
    const { copyITGovMailbox, ...trbFeedbackData } = formData;

    sendFeedback({
      variables: {
        input: { ...trbFeedbackData, trbRequestId: id, action: feedbackAction }
      }
    }).then(result => {
      toastSuccess(t(`${actionText}.success`));
      history.push(requestUrl);
    });
  };

  const disableFormText = useMemo(() => {
    // Form is still in draft
    if (formStatus !== TRBFormStatus.COMPLETED)
      return t('adminHome.requestInDraftAlt');

    // Form has already been marked as ready for consult
    if (feedbackStatus === TRBFeedbackStatus.COMPLETED)
      return t('actionRequestEdits.formDisabled');

    return undefined;
  }, [feedbackStatus, formStatus, t]);

  if (contextLoading) return <PageLoading />;

  return (
    <ActionForm
      title={t(`${actionText}.heading`)}
      description={t(`${actionText}.description`)}
      onSubmit={handleSubmit(formData => submitForm(formData))}
      buttonProps={{
        next: {
          text: t('actionRequestEdits.submit'),
          disabled:
            feedbackAction === TRBFeedbackAction.REQUEST_EDITS &&
            !watch('feedbackMessage'),
          loading: isSubmitting || feedbackResult.loading
        },
        taskListUrl: requestUrl,
        saveExitText: t('actionRequestEdits.cancelAndReturn')
      }}
      breadcrumbItems={[
        {
          text: t(`${actionText}.breadcrumb`)
        }
      ]}
      disableFormText={disableFormText}
    >
      <Controller
        name="feedbackMessage"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Label
                id="feedbackMessage-label"
                htmlFor="feedbackMessage"
                className="text-normal margin-top-6"
                required={feedbackAction === TRBFeedbackAction.REQUEST_EDITS}
              >
                {t(`${actionText}.label`)}
              </Label>
              <HelpText id="feedbackmessage-hint">
                {t('actionRequestEdits.hint')}
              </HelpText>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <RichTextEditor
                className="margin-top-1"
                editableProps={{
                  id: 'feedbackMessage',
                  'data-testid': 'feedbackMessage',
                  'aria-describedby': 'feedbackMessage-hint',
                  'aria-labelledby': 'feedbackMessage-label'
                }}
                field={{ ...field, value: field.value || '' }}
                required={feedbackAction === TRBFeedbackAction.REQUEST_EDITS}
              />
            </FormGroup>
          );
        }}
      />
    </ActionForm>
  );
}

export default RequestEdits;
