import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import {
  ADDITIONAL_TEXT_INPUT_SUFFIX,
  easiServiceOptionKeys,
  sendFeedbackOptionFields,
  sendFeedbackOptionFieldsForTextInput,
  SendFeedbackOptionKey,
  sendFeedbackOptions
} from 'constants/helpFeedback';
import SendFeedbackEmailQuery from 'queries/SendFeedbackEmailQuery';
import {
  SendFeedbackEmail,
  SendFeedbackEmailVariables
} from 'queries/types/SendFeedbackEmail';
import { SendFeedbackEmailInput } from 'types/graphql-global-types';
import {
  SendFeedbackEmailForm,
  SendFeedbackOptionFieldForTextInputKey,
  SendFeedbackOptionFieldsWithTextInput
} from 'types/helpFeedback';
import {
  sendFeedbackEmailFormSchema,
  sendFeedbackEmailInputSchema
} from 'validations/helpSchema';

import './index.scss';

type FormMode = 'sendFeedback' | 'reportAProblem';

const ErrorMessage = ({ name }: ErrorMessageProps) => (
  <FormikErrorMessage
    name={name}
    component={TrussErrorMessage as React.ComponentType}
  />
);

/**
 * The `canBeContacted` field depends on `isAnonymous`.
 * Show the field if `isAnonymous` is false.
 */
const CanBeContactedField = () => {
  const name = 'canBeContacted';
  const { t } = useTranslation('help');
  const {
    values: { isAnonymous },
    touched: { isAnonymous: isAnonymousTouched },
    setFieldValue
  } = useFormikContext<SendFeedbackEmailForm>();

  // Formik field attribute values are cast to strings
  // while the schema recognizes the boolean
  const isAnonymousString = String(isAnonymous);

  React.useEffect(() => {
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
            name={name}
            label={t('sendFeedback.options.yes')}
            value
          />
          <Field
            as={Radio}
            id={`${name}-no`}
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
 */
const RadioOptionGroupWithAdditionalText = ({
  name,
  options,
  optionForTextInput
}: {
  name: keyof SendFeedbackEmailInput;
  options: Readonly<SendFeedbackOptionKey[]>;
  optionForTextInput?: SendFeedbackOptionKey;
}) => {
  const { t } = useTranslation('help');
  const { values } = useFormikContext<SendFeedbackEmailForm>();

  // Setup the additional text field
  const textField: string | undefined = useMemo(
    () =>
      optionForTextInput ? `${name}${ADDITIONAL_TEXT_INPUT_SUFFIX}` : undefined,
    [optionForTextInput, name]
  );

  return (
    <FormGroup>
      <Fieldset legend={t(`sendFeedback.labels.${name}`)}>
        <ErrorMessage name={name} />
        {options.map(option => {
          const optionText = t(`sendFeedback.options.${option}`);
          const optionValue = sendFeedbackOptions[option];
          const checked = values[name] === optionValue;
          return (
            <React.Fragment key={option}>
              <Field
                as={Radio}
                id={`${name}-${option}`}
                name={name}
                label={optionText}
                value={optionValue}
                checked={checked}
              />
              {
                // Toggle the additional text field when the option is selected
                // Matches option name and value
                optionForTextInput === option && checked && textField && (
                  <div className="margin-left-4">
                    <Label htmlFor={textField}>
                      {t('sendFeedback.labels.pleaseExplain')}
                    </Label>
                    <ErrorMessage name={textField} />
                    <Field as={TextInput} id={textField} name={textField} />
                  </div>
                )
              }
            </React.Fragment>
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
 */
const EasiServicesUsedField = ({ mode }: { mode: FormMode }) => {
  const { t } = useTranslation('help');
  const { values } = useFormikContext<SendFeedbackEmailForm>();

  const name: keyof SendFeedbackEmailInput = 'easiServicesUsed';
  const optionTextFieldName: keyof SendFeedbackOptionFieldsWithTextInput = `${name}${ADDITIONAL_TEXT_INPUT_SUFFIX}`;

  /**
   * Report a problem uses a radio group,
   * Send feedback uses a checkbox group.
   */
  let fieldComponent: typeof Radio | typeof Checkbox;
  if (mode === 'reportAProblem') fieldComponent = Radio;
  else fieldComponent = Checkbox;

  return (
    <FormGroup>
      <Fieldset legend={t(`sendFeedback.labels.${name}`)}>
        <ErrorMessage name={name} />
        {easiServiceOptionKeys.map(option => {
          return (
            <Field
              key={option}
              as={fieldComponent}
              id={`${name}-${option}`}
              name={name}
              label={t(`sendFeedback.options.${option}`)}
              value={sendFeedbackOptions[option]}
              checked={values[name].includes(sendFeedbackOptions[option])}
            />
          );
        })}
        {values[name].includes(sendFeedbackOptions.other) && (
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
export async function parseForm(
  values: SendFeedbackEmailForm
): Promise<SendFeedbackEmailInput> {
  const parsedValues: any = {};

  // Map ui fields to backend fields
  Object.entries(values).forEach(([field, value]) => {
    // Handle easiServicesUsed separate from the rest since it is a list of options
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

    // Parse additional text fields for option groups with one selection
    else if (field in sendFeedbackOptionFieldsForTextInput) {
      const additional: keyof SendFeedbackOptionFieldsWithTextInput = `${
        field as SendFeedbackOptionFieldForTextInputKey
      }${ADDITIONAL_TEXT_INPUT_SUFFIX}`;

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

  return parsed;
}

/**
 * This formik form uses type `SendFeedbackEmailForm`, which is an extension
 * of the original backend type `SendFeedbackEmailInput`.
 */
const SendFeedback = () => {
  const { t } = useTranslation('help');

  const [send] = useMutation<SendFeedbackEmail, SendFeedbackEmailVariables>(
    SendFeedbackEmailQuery
  );

  const onSubmit = async (values: SendFeedbackEmailForm) => {
    const input = await parseForm(values);
    await send({ variables: { input } });
  };

  return (
    <MainContent className="grid-container help-send-feedback">
      <HelpBreadcrumb type={t('sendFeedback.closeTab')} />
      <h1 className="margin-top-2 margin-bottom-1">
        {t('sendFeedback.title')}
      </h1>
      <div className="font-body-lg line-height-body-2 line-height-body-5 text-light">
        {t('sendFeedback.description')}
      </div>
      <Grid row>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Formik
            initialValues={
              (sendFeedbackEmailFormSchema.getDefaultFromShape() as unknown) as SendFeedbackEmailForm
            }
            validationSchema={sendFeedbackEmailFormSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={onSubmit}
          >
            {({
              errors,
              isSubmitting,
              resetForm,
              setErrors,
              submitCount,
              submitForm,
              validateForm,
              values
            }) => {
              // console.log('errors', JSON.stringify(errors, null, 2));
              // console.log('form values', JSON.stringify(values, null, 2));
              // console.log('submitting', isSubmitting, submitCount);
              return (
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
                        name="isAnonymous"
                        label={t('sendFeedback.options.yes')}
                        value
                        checked={String(values.isAnonymous) === 'true'}
                      />
                      <Field
                        as={Radio}
                        id="isAnonymous-no"
                        name="isAnonymous"
                        label={t('sendFeedback.options.no')}
                        value={false}
                        checked={String(values.isAnonymous) === 'false'}
                      />
                    </Fieldset>
                  </FormGroup>
                  <CanBeContactedField />
                  <EasiServicesUsedField mode="sendFeedback" />
                  <FormGroup>
                    <Label htmlFor="cmsRole">
                      {t('sendFeedback.labels.cmsRole')}
                    </Label>
                    <ErrorMessage name="cmsRole" />
                    <Field as={TextInput} id="cmsRole" name="cmsRole" />
                  </FormGroup>
                  <RadioOptionGroupWithAdditionalText
                    name="systemEasyToUse"
                    options={sendFeedbackOptionFields.systemEasyToUse}
                    optionForTextInput={
                      sendFeedbackOptionFieldsForTextInput.systemEasyToUse
                    }
                  />
                  <RadioOptionGroupWithAdditionalText
                    name="didntNeedHelpAnswering"
                    options={sendFeedbackOptionFields.didntNeedHelpAnswering}
                    optionForTextInput={
                      sendFeedbackOptionFieldsForTextInput.didntNeedHelpAnswering
                    }
                  />
                  <RadioOptionGroupWithAdditionalText
                    name="questionsWereRelevant"
                    options={sendFeedbackOptionFields.questionsWereRelevant}
                    optionForTextInput={
                      sendFeedbackOptionFieldsForTextInput.questionsWereRelevant
                    }
                  />
                  <RadioOptionGroupWithAdditionalText
                    name="hadAccessToInformation"
                    options={sendFeedbackOptionFields.hadAccessToInformation}
                    optionForTextInput={
                      sendFeedbackOptionFieldsForTextInput.hadAccessToInformation
                    }
                  />
                  <RadioOptionGroupWithAdditionalText
                    name="howSatisfied"
                    options={sendFeedbackOptionFields.howSatisfied}
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
                  <div className="margin-top-4 margin-bottom-9">
                    <Button
                      type="submit"
                      inverse
                      disabled={isSubmitting}
                      className="margin-bottom-1 tablet:margin-bottom-0"
                    >
                      {t('sendFeedback.submit')}
                    </Button>
                    <Button
                      type="button"
                      outline
                      disabled={isSubmitting}
                      onClick={async () => {
                        // Manually validate and submit before reset
                        await submitForm();
                        const errs = await validateForm();
                        if (Object.keys(errs).length > 0) {
                          setErrors(errs);
                        } else {
                          resetForm();
                        }
                      }}
                    >
                      {t('sendFeedback.submitAndRestart')}
                    </Button>
                    {Object.keys(errors).length > 0 && submitCount > 0 && (
                      <TrussErrorMessage className="padding-top-1">
                        {t('sendFeedback.errorMessage.form')}
                      </TrussErrorMessage>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </MainContent>
  );
};

export default SendFeedback;
