import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  ErrorMessage,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Label,
  Radio,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import FundingSources from 'features/TechnicalAssistance/Requester/RequestForm/FundingSources/FundingSources';
import {
  GetTRBRequestQuery,
  TRBCollabGroupOption,
  TrbRequestFormFieldsFragmentFragment,
  useDeleteTRBRequestFundingSourceMutation,
  useGetSystemIntakesWithLCIDSQuery,
  useUpdateTRBRequestAndFormMutation,
  useUpdateTRBRequestFundingSourcesMutation
} from 'gql/generated/graphql';
import { camelCase, lowerFirst, pick, upperFirst } from 'lodash';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import Divider from 'components/Divider';
import useEasiForm from 'components/EasiForm/useEasiForm';
import { ErrorAlertMessage } from 'components/ErrorAlert';
import HelpText from 'components/HelpText';
import MultiSelect from 'components/MultiSelect';
import RequiredAsterisk from 'components/RequiredAsterisk';
import Spinner from 'components/Spinner';
import TextAreaField from 'components/TextAreaField';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import { FormFieldProps } from 'types/util';
import nullFillObject from 'utils/nullFillObject';
import { basicSchema, TrbRequestFormBasic } from 'validations/trbRequestSchema';

import Pager from './Pager';
import { FormStepComponentProps, StepSubmit } from '.';

type FundingSourcesFormType = {
  fundingSources: GetTRBRequestQuery['trbRequest']['form']['fundingSources'];
};

export const basicBlankValues = {
  component: '',
  needsAssistanceWith: '',
  hasSolutionInMind: null,
  proposedSolution: '',
  whereInProcess: '',
  whereInProcessOther: '',
  hasExpectedStartEndDates: null,
  expectedStartDate: '',
  expectedEndDate: '',
  systemIntakes: [],
  collabGroups: [],
  collabDateSecurity: '',
  collabDateEnterpriseArchitecture: '',
  collabDateCloud: '',
  collabDatePrivacyAdvisor: '',
  collabDateGovernanceReviewBoard: '',
  collabDateOther: '',
  collabGroupOther: '',
  collabGRBConsultRequested: null
};

function Basic({
  request,
  stepUrl,
  taskListUrl,
  refetchRequest,
  setStepSubmit,
  setIsStepSubmitting,
  setFormAlert
}: FormStepComponentProps) {
  const history = useHistory();
  const { t } = useTranslation('technicalAssistance');

  const [fundingSourcesFormActive, setFundingSourcesFormActive] =
    useState(false);

  const { data, loading: intakesLoading } = useGetSystemIntakesWithLCIDSQuery();

  const systemIntakesWithLCIDs = useMemo(() => {
    const systemIntakes = data?.systemIntakesWithLcids
      ? [...data?.systemIntakesWithLcids]
      : [];
    return systemIntakes
      .sort((a, b) => Number(a.lcid) - Number(b.lcid))
      .map(intake => ({
        value: intake.id,
        label: `${intake.lcid} - ${intake.requestName}` || ''
      }));
  }, [data?.systemIntakesWithLcids]);

  const [updateForm] = useUpdateTRBRequestAndFormMutation();

  const [updatefundingSource] = useUpdateTRBRequestFundingSourcesMutation();

  const [deletefundingSource] = useDeleteTRBRequestFundingSourceMutation();

  const initialValues = nullFillObject(request.form, basicBlankValues);

  const {
    control,
    partialSubmit,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, dirtyFields }
  } = useEasiForm<FormFieldProps<TrbRequestFormBasic>>({
    resolver: yupResolver(basicSchema),
    defaultValues: {
      name: request.name || '',
      ...initialValues,
      // Mapping over intakes as mutation input only takes UUID
      systemIntakes: request.form.systemIntakes.map((intake: any) => intake.id)
    }
  });

  const { control: controlFundingSources, reset } = useForm<
    FormFieldProps<FundingSourcesFormType>
  >({
    defaultValues: {
      fundingSources: request.form.fundingSources ?? []
    }
  });

  // Using this instead of formState.isValid since it's not the same
  const hasErrors = Object.keys(errors).length > 0;

  // Scroll to the error summary when there are changes after submit
  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-basic-fields-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  const handleApolloError = useCallback(
    (err: any) => {
      if (err instanceof ApolloError) {
        setFormAlert({
          type: 'error',
          heading: t('errors.somethingWrong'),
          message: t('basic.errors.submit')
        });
      }
    },
    [setFormAlert, t]
  );

  const updateFields = useCallback(
    async (formData: Partial<FormFieldProps<TrbRequestFormBasic>>) => {
      const { id } = request;
      const { name } = formData;

      // Only send changed fields for a partial update to the input object
      const input: any = pick(formData, Object.keys(dirtyFields));

      // Convert '' back to null for the backend
      // so that cleared inputs on the client are actually removed
      Object.entries(input).forEach(([key, value]) => {
        if (value === '') input[key] = null;
      });

      // Handle the clearing out of toggled off fields.
      // Unmounted fields are removed from the form data and do not get marked
      // as dirty, so they need to be set to null to be cleared.
      if (input.hasSolutionInMind === false) {
        input.proposedSolution = null;
      }

      if (input?.whereInProcess && input.whereInProcess !== 'OTHER') {
        input.whereInProcessOther = null;
      }

      if (input.hasExpectedStartEndDates === false) {
        input.expectedStartDate = null;
        input.expectedEndDate = null;
      }

      Object.values(TRBCollabGroupOption).forEach(option => {
        if (!input.collabGroups?.includes(option)) {
          input[`collabDate${upperFirst(camelCase(option))}`] = null;
          if (option === 'OTHER') {
            input.collabGroupOther = null;
          }
        }
      });

      // Some object adjustments
      const variables: any = {};

      input.trbRequestId = id; // Use the id from the request object
      variables.id = id;

      // Move the name from the form fields object to changes
      if ('name' in input) {
        delete input.name;
        variables.changes = { name };
      }

      variables.input = input;

      await updateForm({ variables });

      // Refresh the RequestForm parent request query
      // to update things like `stepsCompleted`
      await refetchRequest();
    },
    [dirtyFields, refetchRequest, request, updateForm]
  );

  const submit = useCallback<StepSubmit>(
    (callback, shouldValidate = true) =>
      // Start the submit promise
      handleSubmit(
        // Validation passed
        async formData => {
          try {
            // Submit the input only if there are changes
            if (isDirty) {
              await updateFields(formData);
            }

            callback?.();
          } catch (e) {
            handleApolloError(e);
          }
        },
        async () => {
          if (!shouldValidate) {
            await partialSubmit({
              update: formData => updateFields(formData),
              callback
            });
          }
        }
      )(),
    [handleSubmit, isDirty, handleApolloError, updateFields, partialSubmit]
  );

  // Handling the funding sources update/delete sumbission outside the scope of RHF handler
  // Funding sources component has it's own validation
  const addOrUpdateFundingSource = ({
    fundingNumber,
    sources
  }: {
    fundingNumber: string;
    sources: string[];
  }) => {
    updatefundingSource({
      variables: {
        input: {
          trbRequestId: request.id,
          fundingNumber,
          sources
        }
      }
    })
      .then(() => {
        refetchRequest();
      })
      .catch(handleApolloError);
  };

  const deleteFundingSource = (fundingNumber: string) => {
    deletefundingSource({
      variables: {
        input: {
          trbRequestId: request.id,
          fundingNumber
        }
      }
    })
      .then(() => {
        refetchRequest();
      })
      .catch(handleApolloError);
  };

  useEffect(() => {
    setStepSubmit(() => submit);
  }, [setStepSubmit, submit]);

  useEffect(() => {
    setIsStepSubmitting(isSubmitting);
  }, [setIsStepSubmitting, isSubmitting]);

  // effect runs when funding sources are updated
  useEffect(() => {
    // reset form with updated fundingsources
    reset({ fundingSources: request.form.fundingSources || [] });
  }, [request.form.fundingSources, reset]);

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
          slim={false}
        >
          {Object.keys(errors).map(fieldName => {
            let msg: string;
            if (fieldName.startsWith('collabDate')) {
              // Error links to `collabDate` optional fields
              msg = `${t(
                `basic.options.collabGroups.${lowerFirst(
                  fieldName.replace('collabDate', '')
                )}`
              )}: ${t(`basic.labels.whenMeet`)}`;
            } else {
              msg = t(`basic.labels.${fieldName}`);
            }

            if (errors[fieldName as keyof typeof errors]?.message) {
              msg += `: ${errors[fieldName as keyof typeof errors]?.message}`;

              msg += msg?.replace(fieldName, ' This');
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
          {/* Required fields help text */}
          <HelpText className="margin-top-1 margin-bottom-1 text-base">
            <Trans
              i18nKey="technicalAssistance:requiredFields"
              components={{ red: <span className="text-red" /> }}
            />
          </HelpText>

          {/* Request name */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup className="margin-top-5" error={!!error}>
                <Label htmlFor="name" error={!!error}>
                  {t('basic.labels.name')}
                  <RequiredAsterisk />
                </Label>

                {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
                <TextInput
                  {...field}
                  ref={null}
                  id="name"
                  type="text"
                  validationStatus={error && 'error'}
                />
              </FormGroup>
            )}
          />

          {/* Request component */}
          <Controller
            name="component"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="component"
                  hint={<div>{t('basic.hint.component')}</div>}
                  error={!!error}
                >
                  {t('basic.labels.component')}
                  <RequiredAsterisk />
                </Label>
                {error && (
                  <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                )}
                <Select
                  id="component"
                  data-testid="component"
                  {...field}
                  ref={null}
                >
                  <option>- {t('basic.options.select')} -</option>
                  {cmsDivisionsAndOfficesOptions('component')}
                </Select>
              </FormGroup>
            )}
          />

          <Divider className="margin-top-6" />

          <h4 className="margin-top-1">
            {t('basic.labels.projectInformation')}
          </h4>

          {/* What do you need technical assistance with? */}
          <Controller
            name="needsAssistanceWith"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="needsAssistanceWith"
                  hint={<div>{t('basic.hint.needsAssistanceWith')}</div>}
                  error={!!error}
                >
                  {t('basic.labels.needsAssistanceWith')}
                  <RequiredAsterisk />
                </Label>
                {error && (
                  <ErrorMessage>{t('errors.includeExplanation')}</ErrorMessage>
                )}
                <TextAreaField
                  {...field}
                  ref={null}
                  id="needsAssistanceWith"
                  aria-describedby="needsAssistanceWith-info needsAssistanceWith-hint"
                  error={!!error}
                />
              </FormGroup>
            )}
          />

          {/* Do you have a solution in mind already? */}
          <Controller
            name="hasSolutionInMind"
            control={control}
            render={({ field, fieldState: { error }, formState }) => {
              return (
                <FormGroup error={!!error}>
                  <Fieldset legend={t('basic.labels.hasSolutionInMind')}>
                    <RequiredAsterisk className="text-bold" />
                    {error && (
                      <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                    )}
                    <Radio
                      {...field}
                      ref={null}
                      id="hasSolutionInMind-yes"
                      data-testid="hasSolutionInMind-yes"
                      label={t('basic.options.yes')}
                      onChange={() => field.onChange(true)}
                      value="true"
                      checked={field.value === true}
                    />

                    {/* Describe your proposed solution */}
                    {field.value === true && (
                      <Controller
                        name="proposedSolution"
                        control={control}
                        shouldUnregister
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        render={({ field, fieldState: { error } }) => (
                          <FormGroup error={!!error} className="margin-left-4">
                            <Label htmlFor="proposedSolution" error={!!error}>
                              {t('basic.labels.proposedSolution')}
                              <RequiredAsterisk />
                            </Label>
                            {error && (
                              <ErrorMessage>
                                {t('errors.includeExplanation')}
                              </ErrorMessage>
                            )}
                            <TextAreaField
                              {...field}
                              ref={null}
                              id="proposedSolution"
                              aria-describedby="proposedSolution-info proposedSolution-hint"
                              error={!!error}
                            />
                          </FormGroup>
                        )}
                      />
                    )}

                    <Radio
                      {...field}
                      ref={null}
                      id="hasSolutionInMind-no"
                      data-testid="hasSolutionInMind-no"
                      label={t('basic.options.no')}
                      onChange={() => field.onChange(false)}
                      value="false"
                      checked={field.value === false}
                    />
                  </Fieldset>
                </FormGroup>
              );
            }}
          />

          {/* Where are you in your process? */}
          <Controller
            name="whereInProcess"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Label
                  htmlFor="whereInProcess"
                  hint={t('basic.hint.whereInProcess')}
                  error={!!error}
                >
                  {t('basic.labels.whereInProcess')}
                  <RequiredAsterisk />
                </Label>
                {error && (
                  <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                )}
                <Select
                  id="whereInProcess"
                  data-testid="whereInProcess"
                  {...field}
                  ref={null}
                >
                  <option> </option>
                  {[
                    'I_HAVE_AN_IDEA_AND_WANT_TO_BRAINSTORM',
                    'CONTRACTING_WORK_HAS_STARTED',
                    'DEVELOPMENT_HAS_RECENTLY_STARTED',
                    'DEVELOPMENT_IS_SIGNIFICANTLY_UNDERWAY',
                    'THE_SYSTEM_IS_IN_OPERATION_AND_MAINTENANCE',
                    'OTHER'
                  ].map(val => {
                    return (
                      <option key={val} value={val}>
                        {t(`basic.options.whereInProcess.${camelCase(val)}`)}
                      </option>
                    );
                  })}
                </Select>
                {field.value === 'OTHER' && (
                  <Controller
                    name="whereInProcessOther"
                    control={control}
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    render={({ field, fieldState: { error } }) => (
                      <FormGroup error={!!error}>
                        <Label
                          htmlFor={field.name}
                          error={!!error}
                          className="text-normal"
                        >
                          {t('basic.labels.pleaseSpecify')}
                          <RequiredAsterisk className="text-bold" />
                        </Label>
                        {error && (
                          <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                        )}
                        <TextInput
                          {...field}
                          ref={null}
                          id={field.name}
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

          {/* Does your solution have an expected start and/or end date? */}
          <Controller
            name="hasExpectedStartEndDates"
            control={control}
            render={({ field, fieldState: { error: startOrEndError } }) => {
              return (
                <FormGroup error={!!startOrEndError}>
                  <Fieldset legend={t('basic.labels.hasExpectedStartEndDates')}>
                    <RequiredAsterisk className="text-bold" />
                    {startOrEndError && (
                      <ErrorMessage>
                        {startOrEndError.type === 'expected-start-or-end-date'
                          ? startOrEndError.message
                          : t('errors.makeSelection')}
                      </ErrorMessage>
                    )}
                    <Radio
                      {...field}
                      ref={null}
                      id="hasExpectedStartEndDates-yes"
                      data-testid="hasExpectedStartEndDates-yes"
                      onChange={() => field.onChange(true)}
                      value="true"
                      label={t('basic.options.yes')}
                      checked={field.value === true}
                    />

                    {field.value === true && (
                      <div className="margin-left-4">
                        {/* Expected start date */}
                        <Grid row gap>
                          <Grid tablet={{ col: 6 }}>
                            <Controller
                              name="expectedStartDate"
                              control={control}
                              shouldUnregister
                              // eslint-disable-next-line @typescript-eslint/no-shadow
                              render={({ field, fieldState: { error } }) => (
                                <FormGroup error={!!(error || startOrEndError)}>
                                  <Label
                                    htmlFor="expectedStartDate"
                                    hint="mm/dd/yyyy"
                                    error={!!error}
                                  >
                                    {t('basic.labels.expectedStartDate')}
                                    <RequiredAsterisk />
                                  </Label>
                                  <DatePickerFormatted
                                    id="expectedStartDate"
                                    {...field}
                                    defaultValue={field.value}
                                    ref={null}
                                  />
                                </FormGroup>
                              )}
                            />
                          </Grid>
                          {/* Expected end date */}
                          <Grid tablet={{ col: 6 }}>
                            <Controller
                              name="expectedEndDate"
                              control={control}
                              shouldUnregister
                              // eslint-disable-next-line @typescript-eslint/no-shadow
                              render={({ field, fieldState: { error } }) => (
                                <FormGroup error={!!(error || startOrEndError)}>
                                  <Label
                                    htmlFor="expectedEndDate"
                                    hint="mm/dd/yyyy"
                                    error={!!error}
                                  >
                                    {t('basic.labels.expectedEndDate')}
                                    <RequiredAsterisk />
                                  </Label>
                                  <DatePickerFormatted
                                    id="expectedEndDate"
                                    {...field}
                                    defaultValue={field.value}
                                    ref={null}
                                  />
                                </FormGroup>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    )}

                    <Radio
                      {...field}
                      ref={null}
                      id="hasExpectedStartEndDates-no"
                      data-testid="hasExpectedStartEndDates-no"
                      onChange={() => field.onChange(false)}
                      value="false"
                      label={t('basic.options.no')}
                      checked={field.value === false}
                    />
                  </Fieldset>
                </FormGroup>
              );
            }}
          />

          <Divider className="margin-top-6" />

          <h4 className="margin-top-1">
            {t('basic.labels.collabAndGovernance')}
          </h4>

          <Controller
            name="fundingSources"
            control={controlFundingSources}
            // eslint-disable-next-line @typescript-eslint/no-shadow
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error} className="margin-bottom-4">
                <Label
                  htmlFor={field.name}
                  error={!!error}
                  hint={t('basic.hint.fundingSources')}
                  className="text-normal"
                >
                  {t('basic.labels.fundingSources')}
                </Label>
                {error && <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>}
                <FundingSources
                  id="trb-funding-sources"
                  initialValues={field.value}
                  setFieldValue={value => {
                    if (value.delete) {
                      deleteFundingSource(value.delete);
                    } else {
                      addOrUpdateFundingSource(value);
                    }
                  }}
                  fundingSourceOptions={intakeFundingSources}
                  setFieldActive={setFundingSourcesFormActive}
                  combinedFields
                />
              </FormGroup>
            )}
          />

          <div className="display-flex flex-align-center">
            <Controller
              name="systemIntakes"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormGroup error={!!error || 'systemIntakes' in errors}>
                    <Label
                      htmlFor="systemIntakes"
                      hint={<div>{t(`basic.hint.relatedLCIDS`)}</div>}
                      error={!!error}
                    >
                      {t(`basic.labels.relatedLCIDS`)}
                    </Label>
                    {error && (
                      <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                    )}
                    <MultiSelect
                      inputId="systemIntakes"
                      name="systemIntakes"
                      options={systemIntakesWithLCIDs}
                      initialValues={initialValues.systemIntakes.map(
                        (intake: TrbRequestFormFieldsFragmentFragment) =>
                          intake.id
                      )}
                      onChange={values => {
                        field.onChange(values);
                      }}
                      selectedLabel={t('basic.labels.selectedLCIDs')}
                    />
                  </FormGroup>
                );
              }}
            />

            {intakesLoading && (
              <Spinner
                className="margin-left-2 intake-spinner"
                data-testid="spinner"
              />
            )}
          </div>

          {/* Select any other OIT groups that you have met with or collaborated with. */}
          <Controller
            name="collabGroups"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup error={!!error}>
                  <Fieldset legend={t('basic.labels.collabGroups')}>
                    {error && (
                      <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                    )}
                    {[
                      'SECURITY',
                      'ENTERPRISE_ARCHITECTURE',
                      'CLOUD',
                      'PRIVACY_ADVISOR',
                      'GOVERNANCE_REVIEW_BOARD',
                      'OTHER'
                    ].map((v, idx) => {
                      const val = v as TRBCollabGroupOption;
                      const optionKeyWordUpper = upperFirst(camelCase(v));

                      const collabDateKey =
                        `collabDate${optionKeyWordUpper}` as keyof Pick<
                          TrbRequestFormBasic,
                          | 'collabDateSecurity'
                          | 'collabDateEnterpriseArchitecture'
                          | 'collabDateCloud'
                          | 'collabDatePrivacyAdvisor'
                          | 'collabDateGovernanceReviewBoard'
                          | 'collabDateOther'
                        >;

                      return (
                        <React.Fragment key={v}>
                          <Checkbox
                            name={field.name}
                            id={`collabGroups-${optionKeyWordUpper}`}
                            label={t(
                              `basic.options.collabGroups.${camelCase(v)}`
                            )}
                            value={val}
                            checked={field.value.includes(val)}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              field.onChange(
                                e.target.checked
                                  ? [...field.value, e.target.value]
                                  : field.value.filter(
                                      (value: any) => value !== e.target.value
                                    )
                              );
                            }}
                          />
                          {/* Which other group(s)? */}
                          {v === 'OTHER' && field.value.includes(val) && (
                            <Controller
                              name="collabGroupOther"
                              control={control}
                              // eslint-disable-next-line @typescript-eslint/no-shadow
                              render={({ field, fieldState: { error } }) => (
                                <FormGroup
                                  error={!!error}
                                  className="margin-left-4"
                                >
                                  <Label
                                    htmlFor="collabGroupOther"
                                    error={!!error}
                                  >
                                    {t('basic.labels.collabGroupOther')}
                                  </Label>
                                  {error && (
                                    <ErrorMessage>
                                      {t('errors.fillBlank')}
                                    </ErrorMessage>
                                  )}

                                  <TextInput
                                    {...field}
                                    ref={null}
                                    id="collabGroupOther"
                                    type="text"
                                    validationStatus={error && 'error'}
                                  />
                                </FormGroup>
                              )}
                            />
                          )}
                          {/* When did you meet with them? */}
                          {field.value.includes(val) &&
                            (() => {
                              return (
                                <Controller
                                  name={collabDateKey}
                                  control={control}
                                  render={({
                                    // eslint-disable-next-line @typescript-eslint/no-shadow
                                    field,
                                    // eslint-disable-next-line @typescript-eslint/no-shadow
                                    fieldState: { error }
                                  }) => (
                                    <FormGroup
                                      error={!!error}
                                      className="margin-left-4"
                                    >
                                      <Label
                                        htmlFor={collabDateKey}
                                        hint={t('basic.hint.whenMeet')}
                                        error={!!error}
                                      >
                                        {t('basic.labels.whenMeet')}
                                      </Label>
                                      {error && (
                                        <ErrorMessage>
                                          {t('errors.fillBlank')}
                                        </ErrorMessage>
                                      )}

                                      <Grid row>
                                        <Grid tablet={{ col: 6 }}>
                                          <DatePickerFormatted
                                            id={collabDateKey}
                                            {...field}
                                            defaultValue={field.value}
                                            ref={null}
                                          />{' '}
                                        </Grid>
                                      </Grid>

                                      {val === 'GOVERNANCE_REVIEW_BOARD' && (
                                        <Controller
                                          name="collabGRBConsultRequested"
                                          control={control}
                                          render={({
                                            // eslint-disable-next-line @typescript-eslint/no-shadow
                                            field,
                                            // eslint-disable-next-line @typescript-eslint/no-shadow
                                            fieldState: { error }
                                          }) => (
                                            <FormGroup
                                              error={!!error}
                                              className="margin-bottom-1"
                                            >
                                              <Label
                                                htmlFor={collabDateKey}
                                                error={!!error}
                                              >
                                                {t(
                                                  'basic.labels.collabGRBConsultRequested'
                                                )}
                                                <RequiredAsterisk />
                                              </Label>
                                              {error && (
                                                <ErrorMessage>
                                                  {t('errors.fillBlank')}
                                                </ErrorMessage>
                                              )}
                                              <Radio
                                                {...field}
                                                ref={null}
                                                id="grt-brb-consult-yes"
                                                data-testid="grt-brb-consult-yes"
                                                label={t('basic.options.yes')}
                                                onChange={() =>
                                                  field.onChange(true)
                                                }
                                                value="true"
                                                checked={field.value === true}
                                              />

                                              <Radio
                                                {...field}
                                                ref={null}
                                                id="grt-brb-consult-no"
                                                data-testid="grt-brb-consult-no"
                                                label={t('basic.options.no')}
                                                onChange={() =>
                                                  field.onChange(false)
                                                }
                                                value="false"
                                                checked={field.value === false}
                                              />
                                            </FormGroup>
                                          )}
                                        />
                                      )}
                                    </FormGroup>
                                  )}
                                />
                              );
                            })()}
                        </React.Fragment>
                      );
                    })}
                  </Fieldset>
                </FormGroup>
              );
            }}
          />
        </Grid>
      </Grid>

      <Pager
        className="margin-top-5"
        next={{
          disabled: isSubmitting || fundingSourcesFormActive,
          onClick: () =>
            submit(() => {
              history.push(stepUrl.next);
            })
        }}
        saveExitDisabled={isSubmitting}
        submit={submit}
        taskListUrl={taskListUrl}
      />
    </Form>
  );
}

export default Basic;
