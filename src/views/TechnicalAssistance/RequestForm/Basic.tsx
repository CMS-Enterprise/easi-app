import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  CharacterCount,
  Checkbox,
  Dropdown,
  ErrorMessage,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { camelCase, lowerFirst, upperFirst } from 'lodash';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import {
  UpdateTrbRequestForm,
  UpdateTrbRequestFormVariables
} from 'queries/types/UpdateTrbRequestForm';
import UpdateTrbRequestFormQuery from 'queries/UpdateTrbRequestFormQuery';
import { TRBCollabGroupOption } from 'types/graphql-global-types';
import nullFillObject from 'utils/nullFillObject';
import { basicSchema, TrbRequestFormBasic } from 'validations/trbRequestSchema';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

export const basicBlankValues = {
  component: '',
  needsAssistanceWith: '',
  hasSolutionInMind: null,
  proposedSolution: '',
  whereInProcess: '',
  hasExpectedStartEndDates: null,
  expectedStartDate: '',
  expectedEndDate: '',
  collabGroups: [],
  collabDateSecurity: '',
  collabDateEnterpriseArchitecture: '',
  collabDateCloud: '',
  collabDatePrivacyAdvisor: '',
  collabDateGovernanceReviewBoard: '',
  collabDateOther: '',
  collabGroupOther: ''
};

function Basic({ request, refreshRequest, stepUrl }: FormStepComponentProps) {
  const history = useHistory();
  const { t } = useTranslation('technicalAssistance');

  const [updateForm] = useMutation<
    UpdateTrbRequestForm,
    UpdateTrbRequestFormVariables
  >(UpdateTrbRequestFormQuery);

  const initialValues = nullFillObject(request.form, basicBlankValues);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
    unregister
  } = useForm<TrbRequestFormBasic>({
    resolver: yupResolver(basicSchema),
    defaultValues: {
      name: request.name,
      ...initialValues
    }
  });

  // console.log('values', watch());
  // console.log('values', watch('selectOitGroups'));
  // console.log('result', JSON.stringify(result.data));
  // console.log('errors', errors);
  // console.log('isdirty', isDirty);

  // Scroll to the error summary when there are changes after submit
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const err = document.querySelector('.usa-alert--error');
      err?.scrollIntoView();
    }
  }, [errors]);

  // Unbind fields that are toggled off

  const hasSolutionInMind = watch('hasSolutionInMind');
  useEffect(() => {
    if (hasSolutionInMind === false) {
      unregister('proposedSolution');
    }
  }, [hasSolutionInMind, unregister]);

  const hasExpectedStartEndDates = watch('hasExpectedStartEndDates');
  useEffect(() => {
    if (hasExpectedStartEndDates === false) {
      unregister('expectedStartDate');
      unregister('expectedEndDate');
    }
  }, [hasExpectedStartEndDates, unregister]);

  const collabGroups = watch('collabGroups');
  useEffect(() => {
    if (!collabGroups.includes(TRBCollabGroupOption.SECURITY)) {
      unregister('collabDateSecurity');
    } else if (
      !collabGroups.includes(TRBCollabGroupOption.ENTERPRISE_ARCHITECTURE)
    ) {
      unregister('collabDateEnterpriseArchitecture');
    } else if (!collabGroups.includes(TRBCollabGroupOption.CLOUD)) {
      unregister('collabDateCloud');
    } else if (!collabGroups.includes(TRBCollabGroupOption.PRIVACY_ADVISOR)) {
      unregister('collabDatePrivacyAdvisor');
    } else if (
      !collabGroups.includes(TRBCollabGroupOption.GOVERNANCE_REVIEW_BOARD)
    ) {
      unregister('collabDateGovernanceReviewBoard');
    } else if (!collabGroups.includes(TRBCollabGroupOption.OTHER)) {
      unregister('collabDateOther');
      unregister('collabGroupOther');
    }
  }, [collabGroups, unregister]);

  // console.log('render basic form');

  return (
    <Form
      className="trb-form-basic maxw-full"
      onSubmit={handleSubmit(formData => {
        console.log(formData);
        if (isDirty) {
          const { id } = request;
          const { name } = formData;

          const data: any = { ...formData };
          data.trbRequestId = id;
          delete data.name;

          updateForm({
            variables: { input: data, id, name }
          }).then(() => {
            refreshRequest();
            history.push(stepUrl.next);
          });
        } else {
          history.push(stepUrl.next);
        }
      })}
    >
      {/* Validation errors summary */}
      {Object.keys(errors).length > 0 && (
        <Alert
          heading={t('basic.errors.checkFix')}
          type="error"
          className="margin-bottom-2"
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
            {t('basic.allFieldsMandatory')}
          </Alert>

          {/* Request name */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup className="margin-top-5" error={!!error}>
                <Label htmlFor="name" error={!!error}>
                  {t('basic.labels.name')}
                </Label>
                {error && (
                  <ErrorMessage>{t('basic.errors.fillBlank')}</ErrorMessage>
                )}
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
                </Label>
                {error && (
                  <ErrorMessage>{t('basic.errors.makeSelection')}</ErrorMessage>
                )}
                <Dropdown
                  id="component"
                  data-testid="component"
                  {...field}
                  ref={null}
                >
                  <option>- {t('basic.options.select')} -</option>
                  {cmsDivisionsAndOfficesOptions('component')}
                </Dropdown>
              </FormGroup>
            )}
          />

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
                </Label>
                {error && (
                  <ErrorMessage>
                    {t('basic.errors.includeExplanation')}
                  </ErrorMessage>
                )}
                <CharacterCount
                  {...field}
                  ref={null}
                  id="needsAssistanceWith"
                  maxLength={2000}
                  isTextArea
                  rows={2}
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
                    {error && (
                      <ErrorMessage>
                        {t('basic.errors.makeSelection')}
                      </ErrorMessage>
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
                        // eslint-disable-next-line no-shadow
                        render={({ field, fieldState: { error } }) => (
                          <FormGroup error={!!error} className="margin-left-4">
                            <Label htmlFor="proposedSolution" error={!!error}>
                              {t('basic.labels.proposedSolution')}
                            </Label>
                            {error && (
                              <ErrorMessage>
                                {t('basic.errors.includeExplanation')}
                              </ErrorMessage>
                            )}
                            <CharacterCount
                              {...field}
                              ref={null}
                              id="proposedSolution"
                              maxLength={2000}
                              isTextArea
                              rows={2}
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
                </Label>
                {error && (
                  <ErrorMessage>{t('basic.errors.makeSelection')}</ErrorMessage>
                )}
                <Dropdown
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
                </Dropdown>
              </FormGroup>
            )}
          />

          {/* Does your solution have an expected start and/or end date? */}
          <Controller
            name="hasExpectedStartEndDates"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Fieldset legend={t('basic.labels.hasExpectedStartEndDates')}>
                  {error && (
                    <ErrorMessage>
                      {t('basic.errors.makeSelection')}
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
                    // <div className="margin-left-4 mobile-lg:display-flex">
                    <div className="margin-left-4">
                      {/* Expected start date */}
                      <Controller
                        name="expectedStartDate"
                        control={control}
                        // eslint-disable-next-line no-shadow
                        render={({ field, fieldState: { error } }) => (
                          <FormGroup error={!!error} className="flex-1">
                            <Label
                              htmlFor="expectedStartDate"
                              hint="mm/dd/yyyy"
                              error={!!error}
                            >
                              {t('basic.labels.expectedStartDate')}
                            </Label>
                            {error && (
                              <ErrorMessage>
                                {t('basic.errors.fillDate')}
                              </ErrorMessage>
                            )}
                            <DatePickerFormatted
                              id="expectedStartDate"
                              {...field}
                              ref={null}
                              defaultValue={field.value}
                            />
                          </FormGroup>
                        )}
                      />
                      {/* Expected go live date */}
                      <Controller
                        name="expectedEndDate"
                        control={control}
                        // eslint-disable-next-line no-shadow
                        render={({ field, fieldState: { error } }) => (
                          <FormGroup error={!!error}>
                            <Label
                              htmlFor="expectedEndDate"
                              hint="mm/dd/yyyy"
                              error={!!error}
                            >
                              {t('basic.labels.expectedEndDate')}
                            </Label>
                            {error && (
                              <ErrorMessage>
                                {t('basic.errors.fillDate')}
                              </ErrorMessage>
                            )}
                            <DatePickerFormatted
                              id="expectedEndDate"
                              {...field}
                              ref={null}
                              defaultValue={field.value}
                            />
                          </FormGroup>
                        )}
                      />
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
            )}
          />

          {/* Select any other OIT groups that you have met with or collaborated with. */}
          <Controller
            name="collabGroups"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup error={!!error}>
                  <Fieldset legend={t('basic.labels.collabGroups')}>
                    {error && (
                      <ErrorMessage>
                        {t('basic.errors.makeSelection')}
                      </ErrorMessage>
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
                                      value => value !== e.target.value
                                    )
                              );
                            }}
                          />
                          {/* Which other group(s)? */}
                          {v === 'OTHER' && field.value.includes(val) && (
                            <Controller
                              name="collabGroupOther"
                              control={control}
                              // eslint-disable-next-line no-shadow
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
                                      {t('basic.errors.fillBlank')}
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
                              const collabDateKey = `collabDate${optionKeyWordUpper}` as keyof Pick<
                                TrbRequestFormBasic,
                                | 'collabDateSecurity'
                                | 'collabDateEnterpriseArchitecture'
                                | 'collabDateCloud'
                                | 'collabDatePrivacyAdvisor'
                                | 'collabDateGovernanceReviewBoard'
                                | 'collabDateOther'
                              >;
                              return (
                                <Controller
                                  name={collabDateKey}
                                  control={control}
                                  render={({
                                    // eslint-disable-next-line no-shadow
                                    field,
                                    // eslint-disable-next-line no-shadow
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
                                          {t('basic.errors.fillDate')}
                                        </ErrorMessage>
                                      )}
                                      <TextInput
                                        {...field}
                                        ref={null}
                                        id={collabDateKey}
                                        type="text"
                                        validationStatus={error && 'error'}
                                      />
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
          disabled: isSubmitting
        }}
      />
    </Form>
  );
}

export default Basic;
