import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError, useMutation } from '@apollo/client';
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
import { isEqual, pick, zipObject } from 'lodash';

import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import MultiSelect from 'components/shared/MultiSelect';
import {
  UpdateTrbForm,
  UpdateTrbFormVariables
} from 'queries/types/UpdateTrbForm';
import UpdateTrbFormQuery from 'queries/UpdateTrbFormQuery';
import {
  TRBApplicationDevelopmentOption,
  TRBCloudAndInfrastructureOption,
  TRBDataAndDataManagementOption,
  TRBGovernmentProcessesAndPoliciesOption,
  TRBNetworkAndSecurityOption,
  TRBOtherTechnicalTopicsOption,
  TRBTechnicalReferenceArchitectureOption
} from 'types/graphql-global-types';
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
  subjectAreaOtherTechnicalTopics: [],
  subjectAreaTechnicalReferenceArchitectureOther: '',
  subjectAreaNetworkAndSecurityOther: '',
  subjectAreaCloudAndInfrastructureOther: '',
  subjectAreaApplicationDevelopmentOther: '',
  subjectAreaDataAndDataManagementOther: '',
  subjectAreaGovernmentProcessesAndPoliciesOther: '',
  subjectAreaOtherTechnicalTopicsOther: ''
};

/**
 * Field `name`s with their associated `otherText` field.
 * "OTHER" is always the last item of `options`.
 */
const fields = [
  // const fields: Array<{
  //   name:
  //     | 'subjectAreaTechnicalReferenceArchitecture'
  //     | 'subjectAreaNetworkAndSecurity'
  //     | 'subjectAreaCloudAndInfrastructure'
  //     | 'subjectAreaApplicationDevelopment'
  //     | 'subjectAreaDataAndDataManagement'
  //     | 'subjectAreaGovernmentProcessesAndPolicies'
  //     | 'subjectAreaOtherTechnicalTopics';
  //   otherText:
  //     | 'subjectAreaTechnicalReferenceArchitectureOther'
  //     | 'subjectAreaNetworkAndSecurityOther'
  //     | 'subjectAreaCloudAndInfrastructureOther'
  //     | 'subjectAreaApplicationDevelopmentOther'
  //     | 'subjectAreaDataAndDataManagementOther'
  //     | 'subjectAreaGovernmentProcessesAndPoliciesOther'
  //     | 'subjectAreaOtherTechnicalTopicsOther';
  //   // options: Array<
  //   //   | TRBTechnicalReferenceArchitectureOption
  //   //   | TRBNetworkAndSecurityOption
  //   //   | TRBCloudAndInfrastructureOption
  //   //   | TRBApplicationDevelopmentOption
  //   //   | TRBDataAndDataManagementOption
  //   //   | TRBGovernmentProcessesAndPoliciesOption
  //   //   | TRBOtherTechnicalTopicsOption
  //   // >;
  //   options:
  //     | TRBTechnicalReferenceArchitectureOption[]
  //     | TRBNetworkAndSecurityOption[]
  //     | TRBCloudAndInfrastructureOption[]
  //     | TRBApplicationDevelopmentOption[]
  //     | TRBDataAndDataManagementOption[]
  //     | TRBGovernmentProcessesAndPoliciesOption[]
  //     | TRBOtherTechnicalTopicsOption[];
  // }> = [
  {
    name: 'subjectAreaTechnicalReferenceArchitecture',
    otherText: 'subjectAreaTechnicalReferenceArchitectureOther',
    options: [
      TRBTechnicalReferenceArchitectureOption.GENERAL_TRA_INFORMATION,
      TRBTechnicalReferenceArchitectureOption.TRA_GUIDING_PRINCIPLES,
      TRBTechnicalReferenceArchitectureOption.CMS_PROCESSING_ENVIRONMENTS,
      TRBTechnicalReferenceArchitectureOption.CMS_TRA_MULTI_ZONE_ARCHITECTURE,
      TRBTechnicalReferenceArchitectureOption.CMS_TRA_BUSINESS_RULES,
      TRBTechnicalReferenceArchitectureOption.ABOUT_THE_TRB,
      TRBTechnicalReferenceArchitectureOption.ARCHITECTURE_CHANGE_REQUEST_PROCESS_FOR_THE_TRA,
      TRBTechnicalReferenceArchitectureOption.OTHER
    ]
  },
  {
    name: 'subjectAreaNetworkAndSecurity',
    otherText: 'subjectAreaNetworkAndSecurityOther',
    options: [
      TRBNetworkAndSecurityOption.GENERAL_NETWORK_AND_SECURITY_SERVICES_INFORMATION,
      TRBNetworkAndSecurityOption.SECURITY_SERVICES,
      TRBNetworkAndSecurityOption.CMS_CYBERSECURITY_INTEGRATION_CENTER_INTEGRATION,
      TRBNetworkAndSecurityOption.WIDE_AREA_NETWORK_SERVICES,
      TRBNetworkAndSecurityOption.ACCESS_CONTROL_AND_IDENTITY_MANAGEMENT,
      TRBNetworkAndSecurityOption.DOMAIN_NAME_SYSTEM_SERVICES,
      TRBNetworkAndSecurityOption.OTHER
    ]
  },
  {
    name: 'subjectAreaCloudAndInfrastructure',
    otherText: 'subjectAreaCloudAndInfrastructureOther',
    options: [
      TRBCloudAndInfrastructureOption.GENERAL_CLOUD_AND_INFRASTRUCTURE_SERVICES_INFORMATION,
      TRBCloudAndInfrastructureOption.VIRTUALIZATION,
      TRBCloudAndInfrastructureOption.CLOUD_IAAS_AND_PAAS_INFRASTRUCTURE,
      TRBCloudAndInfrastructureOption.IT_PERFORMANCE_MANAGEMENT,
      TRBCloudAndInfrastructureOption.FILE_TRANSFER,
      TRBCloudAndInfrastructureOption.DATA_STORAGE_SERVICES,
      TRBCloudAndInfrastructureOption.SOFTWARE_AS_A_SERVICE,
      TRBCloudAndInfrastructureOption.KEYS_AND_SECRETS_MANAGEMENT,
      TRBCloudAndInfrastructureOption.MOBILE_DEVICES_AND_APPLICATIONS,
      TRBCloudAndInfrastructureOption.CLOUD_MIGRATION,
      TRBCloudAndInfrastructureOption.DISASTER_RECOVERY,
      TRBCloudAndInfrastructureOption.OTHER
    ]
  },
  {
    name: 'subjectAreaApplicationDevelopment',
    otherText: 'subjectAreaApplicationDevelopmentOther',
    options: [
      TRBApplicationDevelopmentOption.GENERAL_APPLICATION_DEVELOPMENT_SERVICES_INFORMATION,
      TRBApplicationDevelopmentOption.APPLICATION_DEVELOPMENT,
      TRBApplicationDevelopmentOption.WEB_SERVICES_AND_WEB_APIS,
      TRBApplicationDevelopmentOption.WEB_BASED_UI_SERVICES,
      TRBApplicationDevelopmentOption.OPEN_SOURCE_SOFTWARE,
      TRBApplicationDevelopmentOption.PORTAL_INTEGRATION,
      TRBApplicationDevelopmentOption.ACCESSIBILITY_COMPLIANCE,
      TRBApplicationDevelopmentOption.BUSINESS_INTELLIGENCE,
      TRBApplicationDevelopmentOption.CONTAINERS_AND_MICROSERVICES,
      TRBApplicationDevelopmentOption.ROBOTIC_PROCESS_AUTOMATION,
      TRBApplicationDevelopmentOption.SYSTEM_ARCHITECTURE_REVIEW,
      TRBApplicationDevelopmentOption.EMAIL_INTEGRATION,
      TRBApplicationDevelopmentOption.CONFIGURATION_MANAGEMENT,
      TRBApplicationDevelopmentOption.OTHER
    ]
  },
  {
    name: 'subjectAreaDataAndDataManagement',
    otherText: 'subjectAreaDataAndDataManagementOther',
    options: [
      TRBDataAndDataManagementOption.GENERAL_DATA_AND_DATA_MANAGEMENT_INFORMATION,
      TRBDataAndDataManagementOption.ENTERPRISE_DATA_ENVIRONMENT_REVIEW,
      TRBDataAndDataManagementOption.DATA_MART,
      TRBDataAndDataManagementOption.DATA_WAREHOUSING,
      TRBDataAndDataManagementOption.ANALYTIC_SANDBOXES,
      TRBDataAndDataManagementOption.APIS_AND_DATA_EXCHANGES,
      TRBDataAndDataManagementOption.FHIR,
      TRBDataAndDataManagementOption.OTHER
    ]
  },
  {
    name: 'subjectAreaGovernmentProcessesAndPolicies',
    otherText: 'subjectAreaGovernmentProcessesAndPoliciesOther',
    options: [
      TRBGovernmentProcessesAndPoliciesOption.GENERAL_INFORMATION_ABOUT_CMS_PROCESSES_AND_POLICIES,
      TRBGovernmentProcessesAndPoliciesOption.OTHER_AVAILABLE_TRB_SERVICES,
      TRBGovernmentProcessesAndPoliciesOption.SECTION_508_AND_ACCESSIBILITY_TESTING,
      TRBGovernmentProcessesAndPoliciesOption.TARGET_LIFE_CYCLE,
      TRBGovernmentProcessesAndPoliciesOption.SYSTEM_DISPOSITION_PLANNING,
      TRBGovernmentProcessesAndPoliciesOption.INVESTMENT_AND_BUDGET_PLANNING,
      TRBGovernmentProcessesAndPoliciesOption.LIFECYCLE_IDS,
      TRBGovernmentProcessesAndPoliciesOption.CONTRACTING_AND_PROCUREMENT,
      TRBGovernmentProcessesAndPoliciesOption.SECURITY_ASSESSMENTS,
      TRBGovernmentProcessesAndPoliciesOption.INFRASTRUCTURE_AS_A_SERVICE,
      TRBGovernmentProcessesAndPoliciesOption.OTHER
    ]
  },
  {
    name: 'subjectAreaOtherTechnicalTopics',
    otherText: 'subjectAreaOtherTechnicalTopicsOther',
    options: [
      TRBOtherTechnicalTopicsOption.ARTIFICIAL_INTELLIGENCE,
      TRBOtherTechnicalTopicsOption.MACHINE_LEARNING,
      TRBOtherTechnicalTopicsOption.ASSISTANCE_WITH_SYSTEM_CONCEPT_DEVELOPMENT,
      TRBOtherTechnicalTopicsOption.OTHER
    ]
  }
] as const;
// ];

const primaryFields = fields.map(f => f.name);

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

  const [updateForm] = useMutation<UpdateTrbForm, UpdateTrbFormVariables>(
    UpdateTrbFormQuery
  );

  // todo undefined instead of []
  const initialValues = nullFillObject(request.form, subjectAreasBlankValues);

  // console.log('initalValues', initialValues);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, dirtyFields },
    watch
  } = useForm<FormFieldProps<TrbFormInputSubjectAreas>>({
    resolver: yupResolver(subjectAreasSchema),
    defaultValues: initialValues
  });

  const hasErrors = Object.keys(errors).length > 0;

  // Disregard "other" fields when determining form `unfilled`
  const primaryData = zipObject(primaryFields, watch(primaryFields));

  /**
   * Switch submit button between next (true) and continue (false)
   */
  const unfilled: boolean = useMemo(
    () => isEqual(primaryData, pick(subjectAreasBlankValues, primaryFields)),
    [primaryData]
  );

  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-fields-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  const submit = useCallback<StepSubmit>(
    callback =>
      handleSubmit(
        async formData => {
          if (isDirty) {
            const input: any = pick(formData, Object.keys(dirtyFields));

            Object.entries(input).forEach(([key, value]) => {
              if (value === '') input[key] = null;
            });

            // Clear out "other" text fields if the option isn't selected from the main field
            fields.forEach(({ name, otherText, options }) => {
              if (
                name in input &&
                !input[name].includes(options[options.length - 1])
              ) {
                input[otherText] = null;
              }
            });

            await updateForm({
              variables: {
                input: {
                  trbRequestId: request.id,
                  ...input
                }
              }
            });

            await refetchRequest();
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
    [
      dirtyFields,
      handleSubmit,
      isDirty,
      refetchRequest,
      request.id,
      setFormError,
      t,
      updateForm
    ]
  );

  useEffect(() => {
    setStepSubmit(() => submit);
  }, [setStepSubmit, submit]);

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  // console.log('watch', watch());
  // console.log('primaryValues', JSON.stringify(primaryData, null, 2));
  // console.log('values', JSON.stringify(getValues(), null, 2));
  // console.log('isDirty', isDirty);
  // console.log('errors', errors);

  return (
    <Form
      className="trb-form-subject maxw-full"
      onSubmit={e => e.preventDefault()}
    >
      {/* Validation errors summary */}
      {hasErrors && (
        <Alert
          heading={t('errors.checkFix')}
          type="error"
          className="trb-fields-error margin-bottom-2"
        >
          {Object.keys(errors).map(fieldName => {
            let msg: string;
            if (fieldName.endsWith('Other')) {
              msg = `${t(
                `subject.labels.${fieldName.replace(/Other$/, '')}`
              )}: ${t('subject.labels.other')}`;
            } else {
              msg = t(`subject.labels.${fieldName}`);
            }
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
          {/* Technical Reference Architecture (TRA) */}
          {/*
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
          */}

          {fields.map(({ name, otherText, options }) => {
            return (
              <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <FormGroup
                      className="margin-top-5"
                      // Use the same FormGroup error indicator for the related nested "other" field
                      error={!!error || `${name}Other` in errors}
                    >
                      <Label
                        htmlFor={name}
                        hint={<div>{t(`subject.hint.${name}`)}</div>}
                        error={!!error}
                      >
                        {t(`subject.labels.${name}`)}
                      </Label>
                      {error && (
                        <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                      )}
                      <MultiSelect
                        id={name}
                        name={field.name}
                        options={options.map(value => ({
                          label: t(`subject.options.${name}.${value}`),
                          value
                        }))}
                        initialValues={field.value}
                        onChange={field.onChange}
                        selectedLabel={t('subject.labels.selectedTopics')}
                      />
                      {Array.isArray(field.value) &&
                        field.value.includes(options[options.length - 1]) && (
                          <Controller
                            name={otherText}
                            control={control}
                            // eslint-disable-next-line no-shadow
                            render={({ field, fieldState: { error } }) => (
                              <FormGroup>
                                <Label
                                  htmlFor={otherText}
                                  hint={<div>{t('subject.hint.other')}</div>}
                                  error={!!error}
                                  className="text-normal"
                                >
                                  {t('subject.labels.other')}
                                </Label>
                                {error && (
                                  <ErrorMessage>
                                    {t('errors.fillBlank')}
                                  </ErrorMessage>
                                )}
                                <TextInput
                                  {...field}
                                  ref={null}
                                  id={otherText}
                                  type="text"
                                  validationStatus={error && 'error'}
                                />
                              </FormGroup>
                            )}
                          />
                        )}
                    </FormGroup>
                  );
                }}
              />
            );
          })}
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
          },
          text: unfilled ? t('subject.continueWithoutAdding') : undefined,
          outline: unfilled
        }}
        saveExitDisabled={isSubmitting}
        submit={submit}
        taskListUrl={taskListUrl}
      />
    </Form>
  );
}

export default SubjectAreas;
