/**
 * @file "Send Feedback" help form.
 * There is a similar form called "Report a Problem" (`./ReportAProblem.tsx`)
 * which uses some functions and components from this file.
 */

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Checkbox,
  ErrorMessage as TrussErrorMessage,
  Fieldset,
  FormGroup,
  Grid,
  Label,
  Radio,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import {
  ErrorMessage as FormikErrorMessage,
  ErrorMessageProps,
  Field,
  Form,
  Formik,
  useFormikContext
} from 'formik';
import SendFeedbackEmailQuery from 'gql/legacyGQL/SendFeedbackEmailQuery';
import {
  SendFeedbackEmail,
  SendFeedbackEmailVariables
} from 'gql/legacyGQL/types/SendFeedbackEmail';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import {
  ADDITIONAL_TEXT_INPUT_SUFFIX,
  easiServiceOptionKeys,
  SendFeedbackEmailForm,
  SendFeedbackOptionFieldForTextInputKey,
  sendFeedbackOptionFields,
  sendFeedbackOptionFieldsForTextInput,
  SendFeedbackOptionKey,
  sendFeedbackOptions
} from 'constants/helpFeedback';
import { SendFeedbackEmailInput } from 'types/graphql-global-types';
import {
  sendFeedbackEmailFormSchema,
  sendFeedbackEmailInputSchema
} from 'validations/helpSchema';

import './index.scss';

export const ErrorMessage = ({ name }: ErrorMessageProps) => (
  <FormikErrorMessage
    name={name}
    component={TrussErrorMessage as React.ComponentType}
  />
);

/**
 * The `canBeContacted` field depends on `isAnonymous`.
 * Show the field if `isAnonymous` is false.
 */
export const CanBeContactedField = () => {
  const name = 'canBeContacted';
  const { t } = useTranslation('help');
  const {
    values: { isAnonymous },
    touched: { isAnonymous: isAnonymousTouched },
    setFieldValue
  } = useFormikContext<any>();

  // Formik field attribute values are cast to strings
  // while the schema recognizes the boolean
  const isAnonymousString = String(isAnonymous);

  useEffect(() => {
    if (isAnonymousString !== null && isAnonymousTouched) {
      setFieldValue(name, isAnonymousString === 'true' ? false : null, false);
    }
  }, [isAnonymousString, isAnonymousTouched, setFieldValue, name]);

  if (isAnonymousString === 'false') {
    return (
      <FormGroup>
        <Fieldset legend={t(`sendFeedback.labels.${name}`)}>
          <ErrorMessage name={name} />
          <Field
            as={Radio}
            id={`${name}-yes`}
            data-testid={`${name}-yes`}
            name={name}
            label={t('sendFeedback.options.yes')}
            value
          />
          <Field
            as={Radio}
            id={`${name}-no`}
            data-testid={`${name}-no`}
            name={name}
            label={t('sendFeedback.options.no')}
            value={false}
          />
        </Fieldset>
      </FormGroup>
    );
  }
  return null;
};

/**
 * A radio group of options, with an optional additional related text field.
 * A group typically has a set a values where one option
 * can toggle additional input text, as set by `optionForTextInput`.
 * Uses `ADDITIONAL_TEXT_INPUT_SUFFIX`.
 */
export const RadioOptionGroupWithAdditionalText = ({
  name,
  fieldsetLegend,
  options,
  optionKeyForTextInput,
  textInputLabel
}: {
  name: string;
  fieldsetLegend: string;
  options: { key: string; value: string; text: string }[];
  optionKeyForTextInput?: string;
  textInputLabel?: string;
}) => {
  const { values } = useFormikContext<any>();

  const additionalTextFieldName: string | undefined = useMemo(
    () =>
      optionKeyForTextInput
        ? `${name}${ADDITIONAL_TEXT_INPUT_SUFFIX}`
        : undefined,
    [optionKeyForTextInput, name]
  );

  return (
    <FormGroup>
      <Fieldset legend={fieldsetLegend}>
        <ErrorMessage name={name} />
        {options.map(({ key, value, text }) => {
          const checked = values[name] === value;
          return (
            <Fragment key={key}>
              <Field
                as={Radio}
                id={`${name}-${key}`}
                data-testid={`${name}-${key}`}
                name={name}
                label={text}
                value={value}
                checked={checked}
              />
              {
                // Toggle the additional text field when the option is selected
                // Matches option name and value
                optionKeyForTextInput === key &&
                  checked &&
                  additionalTextFieldName && (
                    <div className="margin-left-4">
                      {textInputLabel && (
                        <Label htmlFor={additionalTextFieldName}>
                          {textInputLabel}
                        </Label>
                      )}
                      <ErrorMessage name={additionalTextFieldName} />
                      <Field
                        as={TextInput}
                        id={additionalTextFieldName}
                        name={additionalTextFieldName}
                      />
                    </div>
                  )
              }
            </Fragment>
          );
        })}
      </Fieldset>
    </FormGroup>
  );
};

/**
 * This component for the `easiServicesUsed` field is similar to
 * `RadioOptionGroupWithAdditionalText` except that group elements
 * can be radios or checkboxes depending on mode.
 * Uses `sendFeedbackOptions`, `easyServiceOptionKeys`, `ADDITIONAL_TEXT_INPUT_SUFFIX`.
 */
export const EasiServicesUsedField = ({
  name,
  label,
  as
}: {
  name: string;
  label: string;
  as: typeof Radio | typeof Checkbox;
}) => {
  const { t } = useTranslation('help');
  const { values } = useFormikContext<any>();

  const optionTextFieldName = `${name}${ADDITIONAL_TEXT_INPUT_SUFFIX}`;

  let optionTextFieldToggled = false;
  if (as === Checkbox)
    optionTextFieldToggled = values[name].includes(sendFeedbackOptions.other);
  if (as === Radio)
    optionTextFieldToggled = values[name] === sendFeedbackOptions.other;

  return (
    <FormGroup>
      <Fieldset legend={label}>
        <ErrorMessage name={name} />
        {easiServiceOptionKeys.map(option => {
          let checked = false;
          if (as === Checkbox)
            checked = values[name].includes(sendFeedbackOptions[option]);
          else if (as === Radio)
            checked = values[name] === sendFeedbackOptions[option];

          return (
            <Field
              key={option}
              as={as}
              id={`${name}-${option}`}
              data-testid={`${name}-${option}`}
              name={name}
              label={t(`sendFeedback.options.${option}`)}
              value={sendFeedbackOptions[option]}
              checked={checked}
            />
          );
        })}
        {optionTextFieldToggled && (
          <div className="margin-left-4">
            <ErrorMessage name={optionTextFieldName} />
            <Field
              as={TextInput}
              id={optionTextFieldName}
              name={optionTextFieldName}
            />
          </div>
        )}
      </Fieldset>
    </FormGroup>
  );
};

/**
 * Return form data for the email form submission by converting
 * `SendFeedbackEmailForm` to `SendFeedbackEmailInput`.
 * Handles fields with `ADDITIONAL_TEXT_INPUT_SUFFIX`.
 * Ensures `canBeContacted` is false when `isAnonymous` is true.
 */
export async function parseFeedbackForm(
  values: SendFeedbackEmailForm
): Promise<SendFeedbackEmailInput> {
  const parsedValues: any = {};

  // Map ui fields to backend fields
  Object.entries(values).forEach(([field, value]) => {
    // Handle easiServicesUsed separate from the rest since it is a list of multiple options
    if (field === 'easiServicesUsed') {
      const easiServicesUsed = value as string[];

      const easiServicesUsedOptionValue =
        sendFeedbackOptions[
          sendFeedbackOptionFieldsForTextInput.easiServicesUsed
        ];

      // Check the selected options list to see if the additional text is enabled
      if (easiServicesUsed.includes(easiServicesUsedOptionValue)) {
        parsedValues.easiServicesUsed = easiServicesUsed
          .filter(optionValue => optionValue !== easiServicesUsedOptionValue)
          .concat(
            `${easiServicesUsedOptionValue}: ${values.easiServicesUsedAdditionalText}`
          );
      } else {
        parsedValues.easiServicesUsed = easiServicesUsed;
      }
    }

    // Parse fields of option groups with optional additional text
    else if (field in sendFeedbackOptionFieldsForTextInput) {
      const additional =
        `${field}${ADDITIONAL_TEXT_INPUT_SUFFIX}` as keyof SendFeedbackEmailForm;

      const optionForTextInput =
        sendFeedbackOptionFieldsForTextInput[
          field as SendFeedbackOptionFieldForTextInputKey
        ];

      // Combine the original option value with additional text if
      // the field group option for the additional text is selected
      parsedValues[field] =
        value ===
        sendFeedbackOptions[optionForTextInput as SendFeedbackOptionKey]
          ? `${value}: ${values[additional]}`
          : value;
    }

    // Assign the remaining regular fields
    else if (!field.endsWith(ADDITIONAL_TEXT_INPUT_SUFFIX)) {
      parsedValues[field] = value;
    }
  });

  const typedValues = sendFeedbackEmailInputSchema.cast(parsedValues);

  // `canBeContacted` is false when `isAnonymous` is true
  if (typedValues.isAnonymous) typedValues.canBeContacted = false;

  // Make sure everything fits into the original backend type
  const parsed = await sendFeedbackEmailInputSchema.validate(typedValues, {
    strict: true
  });

  // Yup cast method is returning easiServicesUsed string[] | undefined instead of string[]
  // @ts-ignore
  return parsed;
}

/**
 * Successful form submission notice.
 * Link options to start a new form of the same kind, or start the other one.
 */
export const HelpFormDone = ({
  setIsDone
}: {
  setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation('help');
  const { resetForm } = useFormikContext<any>();
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <div className="margin-top-3 height-card-lg">
      <Button type="button" onClick={window.close}>
        {t('sendFeedback.done.closeTab')}
      </Button>
      <div className="margin-top-5">
        <div className="text-bold">{t('sendFeedback.done.sendAnother')}</div>
        <div className="margin-top-1">
          <Button
            type="button"
            unstyled
            onClick={() => {
              if (pathname.endsWith('/help/report-a-problem')) {
                // Restart Report form if already there
                resetForm();
                setIsDone(false);
              } else history.push('/help/report-a-problem');
            }}
          >
            {t('sendFeedback.done.reportProblem')}
          </Button>
        </div>
        <div className="margin-top-05">
          <Button
            type="button"
            unstyled
            onClick={() => {
              resetForm();
              setIsDone(false);
              if (pathname.endsWith('/help/send-feedback')) {
                // Restart Feedback form if already there
                resetForm();
                setIsDone(false);
              } else history.push('/help/send-feedback');
            }}
          >
            {t('sendFeedback.done.sendFeedback')}
          </Button>
        </div>
      </div>
    </div>
  );
};

/** Shared Help form header */
export const HelpFormHeading = ({
  isDone,
  title,
  description
}: {
  isDone: boolean;
  title: string;
  description: string;
}) => {
  const { t } = useTranslation('help');
  return (
    <>
      <HelpBreadcrumb
        type="close"
        text={!isDone ? t('sendFeedback.closeTab') : undefined}
      />
      <h1 className="margin-top-2 margin-bottom-1">
        {!isDone ? title : t('sendFeedback.done.thankYou')}
      </h1>
      <div className="font-body-lg line-height-body-2 line-height-body-5 text-light">
        {!isDone ? description : t('sendFeedback.done.willReview')}
      </div>
    </>
  );
};

/** Submit button form ui with a a general form error message  */
export const HelpFormSubmitFooter = ({ submit }: { submit: string }) => {
  const { t } = useTranslation('help');
  const { isSubmitting, errors, submitCount } = useFormikContext<any>();
  return (
    <div className="margin-top-4 margin-bottom-9">
      <Button
        type="submit"
        inverse
        disabled={isSubmitting}
        className="margin-bottom-1 tablet:margin-bottom-0"
      >
        {submit}
      </Button>
      {Object.keys(errors).length > 0 && submitCount > 0 && (
        <TrussErrorMessage className="padding-top-1">
          {t('sendFeedback.errorMessage.form')}
        </TrussErrorMessage>
      )}
    </div>
  );
};

/**
 * This formik form uses type `SendFeedbackEmailForm`, which is an extension
 * of the original backend type `SendFeedbackEmailInput`.
 * When the form successfully completes the user can choose to start over again.
 */
const SendFeedback = () => {
  const { t } = useTranslation('help');
  const [isDone, setIsDone] = useState<boolean>(false);

  const [send] = useMutation<SendFeedbackEmail, SendFeedbackEmailVariables>(
    SendFeedbackEmailQuery
  );

  const onSubmit = async (values: SendFeedbackEmailForm) => {
    const input = await parseFeedbackForm(values);
    await send({ variables: { input } });
    setIsDone(true);
  };

  return (
    <MainContent className="grid-container help-send-feedback">
      <HelpFormHeading
        title={t('sendFeedback.title')}
        description={t('sendFeedback.description')}
        isDone={isDone}
      />
      <Formik
        initialValues={
          sendFeedbackEmailFormSchema.getDefaultFromShape() as unknown as SendFeedbackEmailForm
        }
        validationSchema={sendFeedbackEmailFormSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={onSubmit}
      >
        {({ values }) => {
          if (!isDone) {
            return (
              <Grid row>
                <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                  <Form>
                    <FormGroup>
                      <Fieldset
                        legend={
                          <>
                            <div>{t('sendFeedback.labels.isAnonymous')}</div>
                            <div className="line-height-body-5 text-base text-normal text-ls-neg-1">
                              {t('sendFeedback.descriptions.isAnonymous')}
                            </div>
                          </>
                        }
                      >
                        <ErrorMessage name="isAnonymous" />
                        <Field
                          as={Radio}
                          id="isAnonymous-yes"
                          data-testid="isAnonymous-yes"
                          name="isAnonymous"
                          label={t('sendFeedback.options.yes')}
                          value
                          checked={String(values.isAnonymous) === 'true'}
                        />
                        <Field
                          as={Radio}
                          id="isAnonymous-no"
                          data-testid="isAnonymous-no"
                          name="isAnonymous"
                          label={t('sendFeedback.options.no')}
                          value={false}
                          checked={String(values.isAnonymous) === 'false'}
                        />
                      </Fieldset>
                    </FormGroup>
                    <CanBeContactedField />
                    <EasiServicesUsedField
                      label={t('sendFeedback.labels.easiServicesUsed')}
                      name="easiServicesUsed"
                      as={Checkbox}
                    />
                    <FormGroup>
                      <Label htmlFor="cmsRole">
                        {t('sendFeedback.labels.cmsRole')}
                      </Label>
                      <ErrorMessage name="cmsRole" />
                      <Field as={TextInput} id="cmsRole" name="cmsRole" />
                    </FormGroup>
                    <RadioOptionGroupWithAdditionalText
                      name="systemEasyToUse"
                      fieldsetLegend={t('sendFeedback.labels.systemEasyToUse')}
                      options={sendFeedbackOptionFields.systemEasyToUse.map(
                        key => ({
                          key,
                          value: sendFeedbackOptions[key],
                          text: t(`sendFeedback.options.${key}`)
                        })
                      )}
                      optionKeyForTextInput={
                        sendFeedbackOptionFieldsForTextInput.systemEasyToUse
                      }
                      textInputLabel={t('sendFeedback.labels.pleaseExplain')}
                    />
                    <RadioOptionGroupWithAdditionalText
                      name="didntNeedHelpAnswering"
                      fieldsetLegend={t(
                        'sendFeedback.labels.didntNeedHelpAnswering'
                      )}
                      options={sendFeedbackOptionFields.didntNeedHelpAnswering.map(
                        key => ({
                          key,
                          value: sendFeedbackOptions[key],
                          text: t(`sendFeedback.options.${key}`)
                        })
                      )}
                      optionKeyForTextInput={
                        sendFeedbackOptionFieldsForTextInput.didntNeedHelpAnswering
                      }
                      textInputLabel={t('sendFeedback.labels.pleaseExplain')}
                    />
                    <RadioOptionGroupWithAdditionalText
                      name="questionsWereRelevant"
                      fieldsetLegend={t(
                        'sendFeedback.labels.questionsWereRelevant'
                      )}
                      options={sendFeedbackOptionFields.questionsWereRelevant.map(
                        key => ({
                          key,
                          value: sendFeedbackOptions[key],
                          text: t(`sendFeedback.options.${key}`)
                        })
                      )}
                      optionKeyForTextInput={
                        sendFeedbackOptionFieldsForTextInput.questionsWereRelevant
                      }
                      textInputLabel={t('sendFeedback.labels.pleaseExplain')}
                    />
                    <RadioOptionGroupWithAdditionalText
                      name="hadAccessToInformation"
                      fieldsetLegend={t(
                        'sendFeedback.labels.hadAccessToInformation'
                      )}
                      options={sendFeedbackOptionFields.hadAccessToInformation.map(
                        key => ({
                          key,
                          value: sendFeedbackOptions[key],
                          text: t(`sendFeedback.options.${key}`)
                        })
                      )}
                      optionKeyForTextInput={
                        sendFeedbackOptionFieldsForTextInput.hadAccessToInformation
                      }
                      textInputLabel={t('sendFeedback.labels.pleaseExplain')}
                    />
                    <RadioOptionGroupWithAdditionalText
                      name="howSatisfied"
                      fieldsetLegend={t('sendFeedback.labels.howSatisfied')}
                      options={sendFeedbackOptionFields.howSatisfied.map(
                        key => ({
                          key,
                          value: sendFeedbackOptions[key],
                          text: t(`sendFeedback.options.${key}`)
                        })
                      )}
                    />
                    <FormGroup>
                      <Label htmlFor="howCanWeImprove">
                        {t('sendFeedback.labels.howCanWeImprove')}
                      </Label>
                      <ErrorMessage name="howCanWeImprove" />
                      <Field
                        className="height-card"
                        as={Textarea}
                        id="howCanWeImprove"
                        name="howCanWeImprove"
                      />
                    </FormGroup>
                    <HelpFormSubmitFooter submit={t('sendFeedback.submit')} />
                  </Form>
                </Grid>
              </Grid>
            );
          }

          // Form submisson complete
          return <HelpFormDone setIsDone={setIsDone} />;
        }}
      </Formik>
    </MainContent>
  );
};

export default SendFeedback;
