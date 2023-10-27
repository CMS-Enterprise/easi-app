import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  Dropdown,
  ErrorMessage,
  FormGroup,
  Label
} from '@trussworks/react-uswds';

import RichTextEditor from 'components/RichTextEditor';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import CreateSystemIntakeActionRequestEditsQuery from 'queries/CreateSystemIntakeActionRequestEditsQuery';
import {
  CreateSystemIntakeActionRequestEdits,
  CreateSystemIntakeActionRequestEditsVariables
} from 'queries/types/CreateSystemIntakeActionRequestEdits';
import { SystemIntakeFormStep } from 'types/graphql-global-types';

import ActionForm, { SystemIntakeActionFields } from './components/ActionForm';

interface RequestEditsFields extends SystemIntakeActionFields {
  intakeFormStep: SystemIntakeFormStep;
  emailFeedback: string;
}

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation(['action', 'form']);

  const form = useForm<RequestEditsFields>();

  const { watch, control } = form;

  const submit = async (formData: RequestEditsFields) => {
    await mutate({
      variables: { input: { systemIntakeID: systemIntakeId, ...formData } }
    });
  };

  const [mutate] = useMutation<
    CreateSystemIntakeActionRequestEdits,
    CreateSystemIntakeActionRequestEditsVariables
  >(CreateSystemIntakeActionRequestEditsQuery);

  const intakeFormStepName = t(
    `requestEdits.option.intakeFormStep.${watch('intakeFormStep')}`
  );

  return (
    <>
      <FormProvider<RequestEditsFields> {...form}>
        <ActionForm
          systemIntakeId={systemIntakeId}
          title={t('requestEdits.title')}
          description={t('requestEdits.description')}
          breadcrumb={t('requestEdits.breadcrumb')}
          successMessage={t('requestEdits.success', {
            formName: intakeFormStepName
          })}
          modal={{
            title: t('requestEdits.modal.title'),
            content: (
              <Trans
                i18nKey="action:requestEdits.modal.content"
                values={{
                  formName: intakeFormStepName
                }}
              />
            )
          }}
          onSubmit={submit}
        >
          <Controller
            name="intakeFormStep"
            control={control}
            rules={{ required: t<string>('form:inputError.makeSelection') }}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="intakeFormStep"
                  hint=""
                  error={!!error}
                  className="text-normal"
                >
                  {t('requestEdits.label.intakeFormStep')}
                  <RequiredAsterisk />
                </Label>
                {error && (
                  <ErrorMessage>
                    {t('form:inputError.makeSelection')}
                  </ErrorMessage>
                )}
                <Dropdown
                  id="intakeFormStep"
                  data-testid="intakeFormStep"
                  {...field}
                  ref={null}
                >
                  <option value="">{t('form:dropdownInitialSelect')}</option>
                  {[
                    SystemIntakeFormStep.INITIAL_REQUEST_FORM,
                    SystemIntakeFormStep.DRAFT_BUSINESS_CASE,
                    SystemIntakeFormStep.FINAL_BUSINESS_CASE
                  ].map(val => (
                    <option key={val} value={val}>
                      {t(`requestEdits.option.intakeFormStep.${val}`)}
                    </option>
                  ))}
                </Dropdown>
              </FormGroup>
            )}
          />
          <Controller
            name="emailFeedback"
            control={control}
            rules={{ required: t<string>('form:inputError.fillBlank') }}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  id={`${field.name}-label`}
                  htmlFor={field.name}
                  error={!!error}
                  className="text-normal"
                >
                  {t('requestEdits.label.emailFeedback')}
                  <RequiredAsterisk />
                </Label>
                {error && (
                  <ErrorMessage>{t('form:inputError.fillBlank')}</ErrorMessage>
                )}
                <RichTextEditor
                  editableProps={{
                    id: field.name,
                    'data-testid': field.name,
                    'aria-describedby': `${field.name}-hint`,
                    'aria-labelledby': `${field.name}-label`
                  }}
                  field={{ ...field, value: field.value || '' }}
                  required
                />
              </FormGroup>
            )}
          />
        </ActionForm>
      </FormProvider>
    </>
  );
};

export default RequestEdits;
