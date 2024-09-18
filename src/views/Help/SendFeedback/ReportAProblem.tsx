/**
 * @file "Report A Problem" help form.
 * Modified from `./index.tsx`.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  Fieldset,
  FormGroup,
  Grid,
  Label,
  Radio,
  Textarea
} from '@trussworks/react-uswds';
import { Field, Form, Formik } from 'formik';

import MainContent from 'components/MainContent';
import {
  ADDITIONAL_TEXT_INPUT_SUFFIX,
  ReportOptionFieldForTextInputKey,
  reportOptionFields,
  reportOptionFieldsForTextInput,
  SendFeedbackOptionKey,
  sendFeedbackOptions,
  SendReportAProblemEmailForm
} from 'constants/helpFeedback';
import SendReportAProblemEmailQuery from 'queries/SendReportAProblemEmailQuery';
import {
  SendReportAProblemEmail,
  SendReportAProblemEmailVariables
} from 'queries/types/SendReportAProblemEmail';
import { SendReportAProblemEmailInput } from 'types/graphql-global-types';
import {
  sendReportAProblemEmailFormSchema,
  sendReportAProblemEmailInputSchema
} from 'validations/helpSchema';

import {
  CanBeContactedField,
  EasiServicesUsedField,
  ErrorMessage,
  HelpFormDone,
  HelpFormHeading,
  HelpFormSubmitFooter,
  RadioOptionGroupWithAdditionalText
} from '.';

import './index.scss';

/**
 * Return form data for the email form submission by converting
 * `SendReportAProblemEmailForm` to `SendReportAProblemEmailInput`.
 * Modified from `src/views/Help/Sendfeedback/index.tsx#parseFeedbackForm()`.
 */
export async function parseReportForm(
  values: SendReportAProblemEmailForm
): Promise<SendReportAProblemEmailInput> {
  const parsedValues: any = {};

  // Map ui fields to backend fields
  Object.entries(values).forEach(([field, value]) => {
    // Parse fields of option groups with optional additional text
    if (field in reportOptionFieldsForTextInput) {
      const additional =
        `${field}${ADDITIONAL_TEXT_INPUT_SUFFIX}` as keyof SendReportAProblemEmailForm;

      const optionForTextInput =
        reportOptionFieldsForTextInput[
          field as ReportOptionFieldForTextInputKey
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

  const typedValues = sendReportAProblemEmailInputSchema.cast(parsedValues);

  // `canBeContacted` is false when `isAnonymous` is true
  if (typedValues.isAnonymous) typedValues.canBeContacted = false;

  // Make sure everything fits into the original backend type
  const parsed = await sendReportAProblemEmailInputSchema.validate(
    typedValues,
    {
      strict: true
    }
  );

  return parsed;
}

/**
 * This "Report A Problem" help form is similar to "Send Feedback"
 * Modified from `src/views/Help/Sendfeedback/index.tsx#SendFeedback()`.
 */
const ReportAProblem = () => {
  const { t } = useTranslation('help');
  const [isDone, setIsDone] = useState<boolean>(false);

  const [send] = useMutation<
    SendReportAProblemEmail,
    SendReportAProblemEmailVariables
  >(SendReportAProblemEmailQuery);

  const onSubmit = async (values: SendReportAProblemEmailForm) => {
    const input = await parseReportForm(values);
    await send({ variables: { input } });
    setIsDone(true);
  };

  return (
    <MainContent className="grid-container help-send-feedback">
      <HelpFormHeading
        title={t('reportAProblem.title')}
        description={t('reportAProblem.description')}
        isDone={isDone}
      />
      <Formik
        initialValues={
          sendReportAProblemEmailFormSchema.getDefaultFromShape() as unknown as SendReportAProblemEmailForm
        }
        validationSchema={sendReportAProblemEmailFormSchema}
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
                      name="easiService"
                      label={t('sendFeedback.labels.easiServicesUsed')}
                      as={Radio}
                    />
                    <FormGroup>
                      <Label htmlFor="whatWereYouDoing">
                        {t('reportAProblem.labels.whatWereYouDoing')}
                      </Label>
                      <ErrorMessage name="whatWereYouDoing" />
                      <Field
                        className="height-card"
                        as={Textarea}
                        id="whatWereYouDoing"
                        name="whatWereYouDoing"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="whatWentWrong">
                        {t('reportAProblem.labels.whatWentWrong')}
                      </Label>
                      <ErrorMessage name="whatWentWrong" />
                      <Field
                        className="height-card"
                        as={Textarea}
                        id="whatWentWrong"
                        name="whatWentWrong"
                      />
                    </FormGroup>
                    <RadioOptionGroupWithAdditionalText
                      name="howSevereWasTheProblem"
                      fieldsetLegend={t(
                        'reportAProblem.labels.howSevereWasTheProblem'
                      )}
                      options={reportOptionFields.howSevereWasTheProblem.map(
                        key => ({
                          key,
                          value: sendFeedbackOptions[key],
                          text: t(`sendFeedback.options.${key}`)
                        })
                      )}
                      optionKeyForTextInput={
                        reportOptionFieldsForTextInput.howSevereWasTheProblem
                      }
                    />
                    <HelpFormSubmitFooter submit={t('reportAProblem.submit')} />
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

export default ReportAProblem;
