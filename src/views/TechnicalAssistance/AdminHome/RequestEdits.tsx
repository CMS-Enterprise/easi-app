import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  CharacterCount,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
import CreateTrbRequestFeedbackQuery from 'queries/CreateTrbRequestFeedbackQuery';
import {
  CreateTrbRequestFeedback,
  CreateTrbRequestFeedbackVariables
} from 'queries/types/CreateTrbRequestFeedback';
import { TRBFeedbackAction } from 'types/graphql-global-types';

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

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      feedbackMessage: ''
    }
  });

  const [mutate] = useMutation<
    CreateTrbRequestFeedback,
    CreateTrbRequestFeedbackVariables
  >(CreateTrbRequestFeedbackQuery);

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
            onSubmit={handleSubmit(formData => {
              mutate({
                variables: {
                  input: {
                    trbRequestId: id,
                    feedbackMessage: formData.feedbackMessage,
                    copyTrbMailbox: false, // todo
                    notifyEuaIds: ['ABCD'], // todo
                    action: feedbackAction
                  }
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
            })}
            className="maxw-full"
          >
            <div className="margin-top-1">
              {t('actionRequestEdits.fieldsMarkedRequired')}
            </div>
            <Controller
              name="feedbackMessage"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label
                    htmlFor="feedbackMessage"
                    hint={<div>{t('actionRequestEdits.hint')}</div>}
                  >
                    {t(`${actionText}.label`)}
                  </Label>
                  <CharacterCount
                    {...field}
                    ref={null}
                    id="feedbackMessage"
                    maxLength={2000}
                    isTextArea
                    rows={2}
                    aria-describedby="feedbackMessage-info feedbackMessage-hint"
                  />
                </FormGroup>
              )}
            />
            <h3>{t('actionRequestEdits.notificationTitle')}</h3>
            <div>{t('actionRequestEdits.notificationDescription')}</div>
            {/* todo cedar contacts */}
            <div>
              <Button
                type="submit"
                className=""
                disabled={!isDirty || isSubmitting}
              >
                {t('actionRequestEdits.submit')}
              </Button>
            </div>
          </Form>
        </Grid>
      </Grid>
      <div>
        <UswdsReactLink to={requestUrl}>
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default RequestEdits;
