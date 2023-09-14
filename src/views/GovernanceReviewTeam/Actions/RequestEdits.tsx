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

import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionRequestEditsQuery from 'queries/CreateSystemIntakeActionRequestEditsQuery';
import {
  CreateSystemIntakeActionRequestEdits,
  CreateSystemIntakeActionRequestEditsVariables
} from 'queries/types/CreateSystemIntakeActionRequestEdits';
import { SystemIntakeFormStep } from 'types/graphql-global-types';

import ActionForm, { SystemIntakeActionFields } from './ActionForm';

interface RequestEditsFields extends SystemIntakeActionFields {
  intakeFormStep: SystemIntakeFormStep;
  emailFeedback: string;
}

const RequestEdits = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  const form = useForm<RequestEditsFields>();

  const {
    watch,
    control
    // formState: { errors }
  } = form;

  const submit = async (formData: RequestEditsFields) => {
    // const checkEmptyFields: Array<keyof RequestEditsFields> = [
    //   'adminNotes',
    //   'additionalInfo'
    // ];
    // checkEmptyFields.forEach(fieldKey => {
    //   // eslint-disable-next-line no-param-reassign
    //   if (formData[fieldKey] === '') delete formData[fieldKey];
    // });

    await mutate({
      variables: { input: { systemIntakeID: systemIntakeId, ...formData } }
    });
  };

  const [mutate] = useMutation<
    CreateSystemIntakeActionRequestEdits,
    CreateSystemIntakeActionRequestEditsVariables
  >(CreateSystemIntakeActionRequestEditsQuery);

  return (
    <>
      <FormProvider<RequestEditsFields> {...form}>
        <ActionForm
          systemIntakeId={systemIntakeId}
          title={t('requestEdits.title')}
          description={t('requestEdits.description')}
          breadcrumb={t('requestEdits.breadcrumb')}
          successMessage={t('requestEdits.success')}
          modal={{
            title: t('requestEdits.modal.title'),
            content: (
              <Trans
                i18nKey="action:requestEdits.modal.content"
                values={{
                  formName: t(
                    `requestEdits.option.intakeFormStep.${watch(
                      'intakeFormStep'
                    )}`
                  )
                }}
              />
            )
          }}
          onSubmit={submit}
        >
          <Controller
            name="intakeFormStep"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label htmlFor="intakeFormStep" hint="" error={!!error}>
                  {t('requestEdits.label.intakeFormStep')}
                  <RequiredAsterisk />
                </Label>
                {error && (
                  <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                )}
                <Dropdown
                  id="intakeFormStep"
                  data-testid="intakeFormStep"
                  {...field}
                  ref={null}
                >
                  <option>- Select -</option>
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
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label htmlFor="emailFeedback" error={!!error}>
                  {t('requestEdits.label.emailFeedback')}
                  <RequiredAsterisk />
                </Label>
                {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
                <TextAreaField
                  {...field}
                  ref={null}
                  id="emailFeedback"
                  aria-describedby="emailFeedback-info"
                  error={!!error}
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
