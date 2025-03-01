import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import {
  Fieldset,
  Form,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import {
  GetTRBGuidanceLetterDocument,
  TRBGuidanceLetterInsightCategory,
  useCreateTRBGuidanceLetterInsightMutation,
  useUpdateTRBGuidanceLetterInsightMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { useEasiFormContext } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import RichTextEditor from 'components/RichTextEditor';
import {
  FormAlertObject,
  GuidanceLetterInsightFields
} from 'types/technicalAssistance';
import formatUrl from 'utils/formatUrl';

import Breadcrumbs from '../../../../../components/Breadcrumbs';
import { StepSubmit } from '../../../Requester/RequestForm';
import Pager from '../../../Requester/RequestForm/Pager';
import LinksArrayField from '../LinksArrayField/Index';

type InsightsFormProps = {
  trbRequestId: string;
  /** Set a form level alert message from within step components */
  setFormAlert: React.Dispatch<React.SetStateAction<FormAlertObject | null>>;
};

/**
 * Insights form for TRB Guidance Letter
 */
const InsightsForm = ({ trbRequestId, setFormAlert }: InsightsFormProps) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();
  const { state } = useLocation<{
    insight: GuidanceLetterInsightFields;
  }>();

  const [showFormError, setShowFormError] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    register,
    formState: { isSubmitting, isDirty, errors }
  } = useEasiFormContext<GuidanceLetterInsightFields>();

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

  const formType = watch('id') ? 'edit' : 'add';

  const returnLink = useMemo(
    () =>
      state?.insight
        ? `/trb/${trbRequestId}/guidance/internal-review`
        : `/trb/${trbRequestId}/guidance/insights`,
    [state?.insight, trbRequestId]
  );

  // If editing from internal review step, set field values from location state
  useEffect(() => {
    if (state?.insight && !watch('id')) {
      reset(state?.insight);
    }
  }, [state?.insight, watch, reset]);

  /** Submits form and executes insight mutation */
  const submit = useCallback<StepSubmit>(
    callback =>
      handleSubmit(async formData => {
        try {
          if (isDirty) {
            /** Format links to array of strings */
            const links = (formData.links || []).map(({ link }) =>
              formatUrl(link)
            );

            const { id, title, insight, category } = formData;

            if (id) {
              await update({
                variables: {
                  input: {
                    id,
                    category,
                    title,
                    insight,
                    links
                  }
                }
              });
            } else {
              await create({
                variables: {
                  input: {
                    trbRequestId,
                    category,
                    title,
                    insight,
                    links
                  }
                }
              });
            }

            setShowFormError(false);

            setFormAlert({
              type: 'success',
              message: t(`guidanceLetterForm.guidanceSuccess`, {
                context: formType
              })
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
      formType
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
            text: t(`guidanceLetterForm.${formType}Guidance`)
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
        {t(`guidanceLetterForm.${formType}Guidance`)}
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
        <FormGroup className="margin-top-3" error={!!errors?.title}>
          <Label className="text-normal" htmlFor="title" required>
            {t('Title')}
          </Label>
          <ErrorMessage
            errors={errors}
            name="title"
            render={() => (
              <FieldErrorMsg>{t('errors.fillBlank')}</FieldErrorMsg>
            )}
          />
          <TextInput type="text" id="title" {...register('title')} ref={null} />
        </FormGroup>

        {/* Category */}
        <FormGroup error={!!errors?.category}>
          <Controller
            control={control}
            name="category"
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <Fieldset>
                <legend className="usa-legend text-normal">
                  {t('guidanceLetterForm.priorityCategory')}{' '}
                  <span className="text-red">*</span>
                </legend>
                <ErrorMessage
                  errors={errors}
                  name="category"
                  render={() => (
                    <FieldErrorMsg>{t('errors.makeSelection')}</FieldErrorMsg>
                  )}
                />
                <Radio
                  {...field}
                  inputRef={ref}
                  id="requirement"
                  label={t('guidanceLetterForm.requirement')}
                  labelDescription={t(
                    'guidanceLetterForm.requirementDescription'
                  )}
                  value={TRBGuidanceLetterInsightCategory.REQUIREMENT}
                  checked={
                    field.value === TRBGuidanceLetterInsightCategory.REQUIREMENT
                  }
                />
                <Radio
                  {...field}
                  inputRef={ref}
                  id="recommendation"
                  label={t('guidanceLetterForm.recommendation')}
                  labelDescription={t(
                    'guidanceLetterForm.recommendationDescription'
                  )}
                  value={TRBGuidanceLetterInsightCategory.RECOMMENDATION}
                  checked={
                    field.value ===
                    TRBGuidanceLetterInsightCategory.RECOMMENDATION
                  }
                />
                <Radio
                  {...field}
                  inputRef={ref}
                  id="consideration"
                  label={t('guidanceLetterForm.consideration')}
                  labelDescription={t(
                    'guidanceLetterForm.considerationDescription'
                  )}
                  value={TRBGuidanceLetterInsightCategory.CONSIDERATION}
                  checked={
                    field.value ===
                    TRBGuidanceLetterInsightCategory.CONSIDERATION
                  }
                />
              </Fieldset>
            )}
          />
        </FormGroup>

        {/* Description */}
        <FormGroup className="margin-top-3" error={!!errors?.insight}>
          <Label
            className="text-normal"
            id="insight-label"
            htmlFor="insight"
            required
          >
            {t('Description')}
          </Label>
          <ErrorMessage
            errors={errors}
            name="insight"
            render={() => (
              <FieldErrorMsg>{t('errors.fillBlank')}</FieldErrorMsg>
            )}
          />
          <Controller
            name="insight"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <RichTextEditor
                editableProps={{
                  id: 'insight',
                  'data-testid': 'insight',
                  'aria-labelledby': 'insight-label'
                }}
                field={{ ...field, value: field.value || '' }}
                required
              />
            )}
          />
        </FormGroup>

        {/* Links */}
        <LinksArrayField />

        <Pager
          className="margin-top-6"
          next={{
            text: t('button.save'),
            onClick: () => submit(() => history.push(returnLink)),
            disabled:
              watch('title').length === 0 ||
              watch('insight').length === 0 ||
              !watch('category') ||
              watch('category') ===
                TRBGuidanceLetterInsightCategory.UNCATEGORIZED ||
              isSubmitting
          }}
          saveExitText={t(`guidanceLetterForm.returnToGuidanceLetter`, {
            formType
          })}
          taskListUrl={returnLink}
          border={false}
          submitDisabled
        />
      </Form>
    </div>
  );
};

export default InsightsForm;
