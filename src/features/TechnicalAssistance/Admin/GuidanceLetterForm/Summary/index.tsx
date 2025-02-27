import React, { useCallback, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage, Form, FormGroup } from '@trussworks/react-uswds';
import {
  GetTRBGuidanceLetterDocument,
  useUpdateTRBGuidanceLetterMutation
} from 'gql/generated/graphql';

import useEasiForm from 'components/EasiForm/useEasiForm';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import RichTextEditor from 'components/RichTextEditor';
import {
  GuidanceLetterSummary,
  StepComponentProps
} from 'types/technicalAssistance';
import { meetingSummarySchema } from 'validations/trbRequestSchema';

import { StepSubmit } from '../../../Requester/RequestForm';
import Pager from '../../../Requester/RequestForm/Pager';

const Summary = ({
  trbRequestId,
  guidanceLetter,
  setFormAlert,
  setStepSubmit,
  setIsStepSubmitting
}: StepComponentProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const { meetingSummary } = guidanceLetter;

  const [update] = useUpdateTRBGuidanceLetterMutation({
    refetchQueries: [GetTRBGuidanceLetterDocument]
  });

  const {
    handleSubmit,
    control,
    watch,
    partialSubmit,
    formState: { isSubmitting, isDirty }
  } = useEasiForm<GuidanceLetterSummary>({
    resolver: yupResolver(meetingSummarySchema),
    defaultValues: {
      meetingSummary
    }
  });

  /** Submit meeting summary fields and update guidance letter */
  const submit = useCallback<StepSubmit>(
    (callback, shouldValidate = true) =>
      handleSubmit(
        async formData => {
          try {
            if (isDirty) {
              // UpdateTrbGuidanceLetter mutation
              await update({
                variables: {
                  input: {
                    trbRequestId,
                    ...formData
                  }
                }
              });
            }
            setFormAlert(null);
            callback?.();
          } catch (e) {
            if (e instanceof ApolloError) {
              setFormAlert({
                type: 'error',
                message: t('guidanceLetterForm.error', {
                  action: 'saving',
                  type: 'guidance letter'
                })
              });
            }
          }
        },
        async () => {
          // Save valid dirty fields on save and exit
          if (!shouldValidate) {
            await partialSubmit({
              update: formData =>
                update({
                  variables: {
                    input: {
                      trbRequestId,
                      ...formData
                    }
                  }
                }),
              callback
            });
          }
        }
      )(),
    [
      handleSubmit,
      isDirty,
      trbRequestId,
      update,
      setFormAlert,
      t,
      partialSubmit
    ]
  );

  useEffect(() => {
    setStepSubmit(() => submit);
  }, [setStepSubmit, submit]);

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  return (
    <Form
      onSubmit={e => e.preventDefault()}
      id="trbGuidanceSummary"
      className="maxw-tablet"
    >
      {/* Required fields help text */}
      <HelpText className="margin-top-1 margin-bottom-1 text-base">
        <Trans
          i18nKey="technicalAssistance:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>

      {/* Meeting summary field */}

      <Controller
        name="meetingSummary"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Label
                className="text-normal"
                id="meetingSummary-label"
                htmlFor="meetingSummary"
                required
              >
                {t('guidanceLetterForm.meetingSummary')}{' '}
              </Label>
              {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
              <RichTextEditor
                editableProps={{
                  id: 'meetingSummary',
                  'data-testid': 'meetingSummary',
                  'aria-describedby': 'meetingSummary-hint',
                  'aria-labelledby': 'meetingSummary-label'
                }}
                field={{ ...field, value: field.value || '' }}
                required
              />
            </FormGroup>
          );
        }}
      />

      {/* Form pager buttons */}
      <Pager
        className="margin-top-4"
        back={{
          outline: true,
          text: t('button.cancel'),
          onClick: () => history.push(`/trb/${trbRequestId}/guidance`)
        }}
        next={{
          disabled: isSubmitting || !watch('meetingSummary'),
          onClick: () =>
            submit(() => history.push(`/trb/${trbRequestId}/guidance/insights`))
        }}
        taskListUrl={`/trb/${trbRequestId}/guidance`}
        saveExitText={t('guidanceLetterForm.returnToRequest')}
        submit={submit}
        border={false}
      />
    </Form>
  );
};

export default Summary;
