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

function RequestEdits() {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage } = useParams<{ id: string; activePage: string }>();
  const history = useHistory();

  const { message, showMessage, showMessageOnNextPage } = useMessage();

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
      {message}
      <Grid row>
        <PageHeading className="margin-bottom-0">
          {t('actionRequestEdits.heading')}
        </PageHeading>
        <div className="line-height-body-5 font-body-lg text-light">
          {t('actionRequestEdits.description')}
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
                    action: TRBFeedbackAction.REQUEST_EDITS
                  }
                }
              })
                .then(result => {
                  showMessageOnNextPage(
                    <Alert type="success" slim className="margin-top-3">
                      {t('actionRequestEdits.success')}
                    </Alert>
                  );
                  history.push(`/trb/${id}/${activePage}`);
                })
                .catch(err => {
                  showMessage(
                    <Alert type="error" slim className="margin-top-3">
                      {t('actionRequestEdits.error')}
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
                    {t('actionRequestEdits.label')}
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
        <UswdsReactLink to={`/trb/${id}/${activePage}`}>
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default RequestEdits;
