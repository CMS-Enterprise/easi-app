import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import {
  Button,
  ErrorMessage,
  Form,
  FormGroup,
  Icon,
  TextInput
} from '@trussworks/react-uswds';
import {
  GetTRBGuidanceLetterDocument,
  TRBGuidanceLetterRecommendationCategory,
  useCreateTRBGuidanceLetterInsightMutation,
  useUpdateTRBGuidanceLetterInsightMutation
} from 'gql/gen/graphql';

import RichTextEditor from 'components/RichTextEditor';
import Alert from 'components/shared/Alert';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import {
  FormAlertObject,
  GuidanceLetterRecommendationFields
} from 'types/technicalAssistance';
import formatUrl from 'utils/formatUrl';

import Breadcrumbs from '../../../components/shared/Breadcrumbs';
import { StepSubmit } from '../RequestForm';

import LinksArrayField from './LinksArrayField/Index';

type InsightsFormProps = {
  trbRequestId: string;
  /** Set a form level alert message from within step components */
  setFormAlert: React.Dispatch<React.SetStateAction<FormAlertObject | null>>;
};

const InsightsForm = ({ trbRequestId, setFormAlert }: InsightsFormProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();
  const { state } = useLocation<{
    recommendation: GuidanceLetterRecommendationFields;
  }>();

  const [showFormError, setShowFormError] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting, isDirty }
  } = useFormContext<GuidanceLetterRecommendationFields>();

  const [create] = useCreateTRBGuidanceLetterInsightMutation({
    refetchQueries: [
      {
        query: GetTRBGuidanceLetterDocument,
        variables: {
          id: trbRequestId
        }
      }
    ]
  });

  const [update] = useUpdateTRBGuidanceLetterInsightMutation({
    refetchQueries: [
      {
        query: GetTRBGuidanceLetterDocument,
        variables: {
          id: trbRequestId
        }
      }
    ]
  });

  const returnLink = useMemo(
    () =>
      state?.recommendation
        ? `/trb/${trbRequestId}/guidance/internal-review`
        : `/trb/${trbRequestId}/guidance/insights`,
    [state?.recommendation, trbRequestId]
  );

  // If editing from internal review step, set field values from location state
  useEffect(() => {
    if (state?.recommendation && !watch('id')) {
      reset(state?.recommendation);
    }
  }, [state?.recommendation, watch, reset]);

  /** Submits form and executes recommendation mutation */
  const submit = useCallback<StepSubmit>(
    callback =>
      handleSubmit(async formData => {
        try {
          if (isDirty) {
            /** Format links to array of strings */
            const links = (formData.links || []).map(({ link }) =>
              formatUrl(link)
            );

            const { id, title, recommendation } = formData;

            if (id) {
              await update({
                variables: {
                  input: {
                    id,
                    // TODO: Remove hard coded category
                    category:
                      TRBGuidanceLetterRecommendationCategory.REQUIREMENT,
                    title,
                    recommendation,
                    links
                  }
                }
              });
            } else {
              await create({
                variables: {
                  input: {
                    trbRequestId,
                    // TODO: Remove hard coded category
                    category:
                      TRBGuidanceLetterRecommendationCategory.REQUIREMENT,
                    title,
                    recommendation,
                    links
                  }
                }
              });
            }

            setShowFormError(false);

            setFormAlert({
              type: 'success',
              message: t(
                `guidanceLetterForm.${
                  watch('id') ? 'editGuidanceSuccess' : 'guidanceSuccess'
                }`
              )
            });
          }
          callback?.();
        } catch (e) {
          if (e instanceof ApolloError) {
            setShowFormError(true);
          }
        }
      })(),
    [
      t,
      handleSubmit,
      isDirty,
      trbRequestId,
      update,
      create,
      setFormAlert,
      watch
    ]
  );

  return (
    <div>
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/trb' },
          {
            text: t(`Request ${trbRequestId}`),
            url: `/trb/${trbRequestId}/guidance`
          },
          {
            text: t('guidanceLetterForm.heading'),
            url: `/trb/${trbRequestId}/guidance/insights`
          },
          {
            text: t(
              `guidanceLetterForm.${watch('id') ? 'edit' : 'add'}Guidance`
            )
          }
        ]}
      />

      {
        /* Error alert for gql errors */
        showFormError && (
          <Alert type="error" className="margin-bottom-5" slim>
            {t('guidanceLetterForm.error', {
              action: 'saving',
              type: 'guidance'
            })}
          </Alert>
        )
      }

      <h1 className="margin-bottom-0">
        {t(`guidanceLetterForm.${watch('id') ? 'edit' : 'add'}Guidance`)}
      </h1>
      {/* Required fields text */}
      <HelpText className="margin-top-1 margin-bottom-2 text-base">
        <Trans
          i18nKey="technicalAssistance:requiredFields"
          components={{ red: <span className="text-red" /> }}
        />
      </HelpText>

      <Form onSubmit={e => e.preventDefault()} className="maxw-tablet">
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup className="margin-top-3" error={!!error}>
                <Label className="text-normal" htmlFor="title" required>
                  {t('Title')}
                </Label>
                {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
                <TextInput type="text" id="title" {...field} ref={null} />
              </FormGroup>
            );
          }}
        />

        {/* Description */}
        <Controller
          name="recommendation"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <FormGroup className="margin-top-3" error={!!error}>
                <Label
                  className="text-normal"
                  id="recommendation-label"
                  htmlFor="recommendation"
                  required
                >
                  {t('Description')}
                </Label>
                {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
                <RichTextEditor
                  editableProps={{
                    id: 'recommendation',
                    'data-testid': 'recommendation',
                    'aria-describedby': 'recommendation-hint',
                    'aria-labelledby': 'recommendation-label'
                  }}
                  field={{ ...field, value: field.value || '' }}
                  required
                />
              </FormGroup>
            );
          }}
        />

        {/* Links */}
        <LinksArrayField />

        {/* Save */}
        <Button
          type="submit"
          className="margin-top-6"
          disabled={
            watch('title').length === 0 ||
            watch('recommendation').length === 0 ||
            isSubmitting
          }
          onClick={() => submit(() => history.push(returnLink))}
        >
          {t('button.save')}
        </Button>
      </Form>

      {/* Return without adding recommendation */}
      <Button
        className="margin-top-205 display-flex flex-align-center"
        type="button"
        unstyled
        onClick={() => history.push(returnLink)}
      >
        <Icon.ArrowBack className="margin-right-05" />
        {t(
          `guidanceLetterForm.${
            watch('id')
              ? 'editReturnToGuidanceLetter'
              : 'returnToGuidanceLetter'
          }`
        )}
      </Button>
    </div>
  );
};

export default InsightsForm;
