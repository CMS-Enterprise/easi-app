import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError /* , useMutation */ } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  ErrorMessage,
  Form,
  FormGroup,
  Grid,
  Label,
  TextInput
} from '@trussworks/react-uswds';

import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import MultiSelect from 'components/shared/MultiSelect';
// import {
//   UpdateTrbForm,
//   UpdateTrbFormVariables
// } from 'queries/types/UpdateTrbForm';
// import UpdateTrbFormQuery from 'queries/UpdateTrbFormQuery';
import { TRBTechnicalReferenceArchitectureOption } from 'types/graphql-global-types';
import { FormFieldProps } from 'types/util';
import nullFillObject from 'utils/nullFillObject';
import {
  subjectAreasSchema,
  TrbFormInputSubjectAreas
} from 'validations/trbRequestSchema';

import Pager from './Pager';
import { FormStepComponentProps, StepSubmit } from '.';

export const subjectAreasBlankValues = {
  subjectAreaTechnicalReferenceArchitecture: [],
  subjectAreaNetworkAndSecurity: [],
  subjectAreaCloudAndInfrastructure: [],
  subjectAreaApplicationDevelopment: [],
  subjectAreaDataAndDataManagement: [],
  subjectAreaGovernmentProcessesAndPolicies: [],
  subjectAreaOtherTechnicalTopics: []
};

function SubjectAreas({
  request,
  stepUrl,
  taskListUrl,
  refetchRequest,
  setStepSubmit,
  setIsStepSubmitting,
  setFormError
}: FormStepComponentProps) {
  const history = useHistory();

  const { t } = useTranslation('technicalAssistance');

  // const [updateForm] = useMutation<UpdateTrbForm, UpdateTrbFormVariables>(
  //   UpdateTrbFormQuery
  // );

  // todo undefined instead of []
  const initialValues = nullFillObject(request.form, subjectAreasBlankValues);

  // console.log('initalValues', initialValues);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty /* dirtyFields */ }
    // watch
  } = useForm<FormFieldProps<TrbFormInputSubjectAreas>>({
    resolver: yupResolver(subjectAreasSchema),
    defaultValues: initialValues
  });

  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-basic-fields-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  const submit = useCallback<StepSubmit>(
    callback =>
      handleSubmit(
        async formData => {
          if (isDirty) {
            // todo
          }
        },
        () => {
          throw new Error('invalid subject areas form');
        }
      )().then(
        () => {
          callback?.();
        },
        err => {
          if (err instanceof ApolloError) {
            setFormError(t<string>('subject.errors.submit'));
          }
        }
      ),
    [handleSubmit, isDirty, setFormError, t]
  );

  useEffect(() => {
    setStepSubmit(() => submit);
  }, [setStepSubmit, submit]);

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  // console.log('values', watch());

  return (
    <Form
      className="trb-form-basic maxw-full"
      onSubmit={e => e.preventDefault()}
    >
      {/* Validation errors summary */}
      {hasErrors && (
        <Alert
          heading={t('errors.checkFix')}
          type="error"
          className="trb-basic-fields-error margin-bottom-2"
        >
          {Object.keys(errors).map(fieldName => {
            const msg = t(`subject.labels.${fieldName}`);
            return (
              <ErrorAlertMessage
                key={fieldName}
                errorKey={fieldName}
                message={msg}
              />
            );
          })}
        </Alert>
      )}

      <Grid row>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Alert type="info" slim>
            {t('subject.pleaseSelectOne')}
          </Alert>

          {/* Technical Reference Architecture (TRA) */}
          <Controller
            name="subjectAreaTechnicalReferenceArchitecture"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup className="margin-top-5" error={!!error}>
                <Label
                  htmlFor="subjectAreaTechnicalReferenceArchitecture"
                  hint={
                    <div>
                      {t(
                        'subject.hint.subjectAreaTechnicalReferenceArchitecture'
                      )}
                    </div>
                  }
                  error={!!error}
                >
                  {t(
                    'subject.labels.subjectAreaTechnicalReferenceArchitecture'
                  )}
                </Label>
                {error && (
                  <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                )}
                <MultiSelect
                  id="subjectAreaTechnicalReferenceArchitecture"
                  name={field.name}
                  options={[
                    TRBTechnicalReferenceArchitectureOption.GENERAL_TRA_INFORMATION,
                    TRBTechnicalReferenceArchitectureOption.TRA_GUIDING_PRINCIPLES,
                    TRBTechnicalReferenceArchitectureOption.CMS_PROCESSING_ENVIRONMENTS,
                    TRBTechnicalReferenceArchitectureOption.CMS_TRA_MULTI_ZONE_ARCHITECTURE,
                    TRBTechnicalReferenceArchitectureOption.CMS_TRA_BUSINESS_RULES,
                    TRBTechnicalReferenceArchitectureOption.ABOUT_THE_TRB,
                    TRBTechnicalReferenceArchitectureOption.ARCHITECTURE_CHANGE_REQUEST_PROCESS_FOR_THE_TRA,
                    TRBTechnicalReferenceArchitectureOption.OTHER
                  ].map(value => ({
                    label: t(
                      `subject.options.subjectAreaTechnicalReferenceArchitecture.${value}`
                    ),
                    value
                  }))}
                  initialValues={field.value}
                  onChange={field.onChange}
                  selectedLabel={t('subject.labels.selectedTopics')}
                />
                {Array.isArray(field.value) &&
                  field.value.includes(
                    'OTHER' as TRBTechnicalReferenceArchitectureOption
                  ) && (
                    <Controller
                      name="subjectAreaTechnicalReferenceArchitectureOther"
                      control={control}
                      // eslint-disable-next-line no-shadow
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup error={!!error}>
                          <Label
                            htmlFor="subjectAreaTechnicalReferenceArchitectureOther"
                            hint={<div>{t('subject.hint.other')}</div>}
                            error={!!error}
                            className="text-normal"
                          >
                            {t('subject.labels.other')}
                          </Label>
                          {error && (
                            <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                          )}
                          <TextInput
                            {...field}
                            ref={null}
                            id="subjectAreaTechnicalReferenceArchitectureOther"
                            type="text"
                            validationStatus={error && 'error'}
                          />
                        </FormGroup>
                      )}
                    />
                  )}
              </FormGroup>
            )}
          />
        </Grid>
      </Grid>

      <Pager
        className="margin-top-5"
        back={{
          onClick: () => {
            history.push(stepUrl.back);
          }
        }}
        next={{
          disabled: isSubmitting,
          onClick: () => {
            submit(() => {
              history.push(stepUrl.next);
            });
          }
        }}
        saveExitDisabled={isSubmitting}
        submit={submit}
        taskListUrl={taskListUrl}
      />
    </Form>
  );
}

export default SubjectAreas;
