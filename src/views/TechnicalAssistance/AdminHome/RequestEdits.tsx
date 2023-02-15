import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  CharacterCount,
  ErrorMessage,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  Label
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import CreateTrbRequestFeedbackQuery from 'queries/CreateTrbRequestFeedbackQuery';
import {
  CreateTrbRequestFeedback,
  CreateTrbRequestFeedbackVariables
} from 'queries/types/CreateTrbRequestFeedback';
import { TRBFeedbackAction } from 'types/graphql-global-types';

function RequestEdits() {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage } = useParams<{ id: string; activePage: string }>();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      feedbackMessage: ''
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mutate, { loading, error, data }] = useMutation<
    CreateTrbRequestFeedback,
    CreateTrbRequestFeedbackVariables
  >(CreateTrbRequestFeedbackQuery);

  return (
    <GridContainer className="width-full">
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
              // console.log('submit', formData);
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
                  // eslint-disable-next-line no-console
                  console.log('success', result);
                })
                // eslint-disable-next-line no-shadow
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.log('error', error);
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
              // eslint-disable-next-line no-shadow
              render={({ field, fieldState: { error } }) => (
                <FormGroup error={!!error}>
                  <Label
                    htmlFor="feedbackMessage"
                    hint={<div>{t('actionRequestEdits.hint')}</div>}
                    error={!!error}
                  >
                    {t('actionRequestEdits.label')}
                  </Label>
                  {error && <ErrorMessage>error</ErrorMessage>}
                  <CharacterCount
                    {...field}
                    ref={null}
                    id="proposedSolution"
                    maxLength={2000}
                    isTextArea
                    rows={2}
                    aria-describedby="feedbackMessage-info feedbackMessage-hint"
                    error={!!error}
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
