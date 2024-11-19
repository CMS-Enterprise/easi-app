import React, { useEffect, useMemo } from 'react';
import { Controller, FieldPath } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  Dropdown,
  Fieldset,
  Form,
  FormGroup,
  Link as UswdsLink,
  Radio,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';

import { useEasiForm } from 'components/EasiForm';
import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import AutoSave from 'components/shared/AutoSave';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import processStages from 'constants/enums/processStages';
import {
  CMS_AI_EMAIL,
  CMS_DVSM_EMAIL,
  CMS_TRB_EMAIL
} from 'constants/externalUrls';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeRequestDetails as UpdateSystemIntakeRequestDetailsQuery } from 'queries/SystemIntakeQueries';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  UpdateSystemIntakeRequestDetails,
  UpdateSystemIntakeRequestDetailsVariables
} from 'queries/types/UpdateSystemIntakeRequestDetails';
import {
  SystemIntakeFormState,
  SystemIntakeSoftwareAcquisitionMethods
} from 'types/graphql-global-types';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

type RequestDetailsForm = {
  requestName: string;
  businessNeed: string;
  businessSolution: string;
  currentStage: string;
  needsEaSupport: boolean | null;
  hasUiChanges: boolean | null;
  usesAiTech: boolean | null;
  usingSoftware: string | null;
  acquisitionMethods: SystemIntakeSoftwareAcquisitionMethods[];
};

type RequestDetailsProps = {
  systemIntake: SystemIntake;
};

const RequestDetails = ({ systemIntake }: RequestDetailsProps) => {
  const { t } = useTranslation('intake');

  const {
    id,
    requestName,
    businessNeed,
    businessSolution,
    currentStage,
    needsEaSupport,
    hasUiChanges,
    usesAiTech,
    usingSoftware,
    acquisitionMethods
  } = systemIntake;

  const history = useHistory();

  const {
    control,
    register,
    setFocus,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty }
  } = useEasiForm<RequestDetailsForm>({
    resolver: yupResolver(SystemIntakeValidationSchema.requestDetails),
    defaultValues: {
      requestName: requestName || '',
      businessNeed: businessNeed || '',
      businessSolution: businessSolution || '',
      currentStage: currentStage || '',
      needsEaSupport,
      hasUiChanges,
      usesAiTech,
      usingSoftware,
      acquisitionMethods
    }
  });

  const [mutate] = useMutation<
    UpdateSystemIntakeRequestDetails,
    UpdateSystemIntakeRequestDetailsVariables
  >(UpdateSystemIntakeRequestDetailsQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id
        }
      }
    ]
  });

  const submit = async (
    callback: () => void = () => {},
    validate: boolean = false
  ) => {
    if (!isDirty) return callback();

    const values = watch();

    const result = await mutate({
      variables: {
        input: { id, ...values }
      }
    });

    if (!result?.errors) return callback();

    // If validating form, show error on server error
    if (validate) {
      return setError('root', {
        message: t('error:encounteredIssueTryAgain')
      });
    }

    // If skipping errors, return callback
    return callback();
  };

  const saveExitLink = (() => {
    let link = '';
    if (systemIntake.requestType === 'SHUTDOWN') {
      link = '/';
    } else {
      link = `/governance-task-list/${systemIntake.id}`;
    }
    return link;
  })();

  const hasErrors = Object.keys(errors).length > 0;

  /** Flattened field errors, excluding any root errors */
  const fieldErrors = useMemo(
    () => flattenFormErrors<RequestDetailsForm>(errors),
    [errors]
  );

  // Scroll errors into view on submit
  useEffect(() => {
    if (hasErrors && isSubmitting) {
      const err = document.querySelector('.usa-alert--error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors, isSubmitting]);

  return (
    <>
      {hasErrors && (
        <ErrorAlert
          testId="request-details-errors"
          classNames="margin-top-3"
          heading={t('form:inputError.checkFix')}
        >
          {(
            Object.keys(fieldErrors) as Array<FieldPath<RequestDetailsForm>>
          ).map(key => {
            return (
              <ErrorMessage
                errors={errors}
                name={key}
                key={key}
                render={({ message }) => (
                  <ErrorAlertMessage
                    message={message}
                    onClick={() => setFocus(key)}
                  />
                )}
              />
            );
          })}
        </ErrorAlert>
      )}

      <ErrorMessage
        errors={errors}
        name={'root' as keyof RequestDetailsForm}
        as={<Alert type="error" />}
      />

      <PageHeading className="margin-bottom-3">
        {t('requestDetails.heading')}
      </PageHeading>

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner id={systemIntake.id} type="Intake Request" />
      )}

      <p className="line-height-body-6">{t('requestDetails.description')}</p>

      <MandatoryFieldsAlert className="tablet:grid-col-6" />

      <hr className="margin-bottom-1 margin-top-3 opacity-30" aria-hidden />
      <span className="font-body-sm text-bold">
        {' '}
        {t('requestDetails.subsectionHeadings.projectConcept')}
      </span>

      <Form
        onSubmit={handleSubmit(() =>
          submit(() => history.push('contract-details'), true)
        )}
        className="maxw-none tablet:grid-col-6 margin-bottom-7"
      >
        <FieldGroup scrollElement="requestName" error={!!errors.requestName}>
          <Label htmlFor="requestName">
            {t('requestDetails.contractTitle')}
          </Label>
          <HelpText id="requestNameHelpText" className="margin-top-1">
            {t('requestDetails.contractTitleHelpText')}
          </HelpText>
          <ErrorMessage errors={errors} name="requestName" as={FieldErrorMsg} />
          <TextInput
            {...register('requestName')}
            ref={null}
            id="requestName"
            type="text"
            aria-describedby="requestNameHelpText"
          />
        </FieldGroup>

        <FieldGroup scrollElement="businessNeed" error={!!errors.businessNeed}>
          <Label htmlFor="businessNeed">
            {t('requestDetails.businessNeed')}
          </Label>
          <HelpText id="businessNeedHelpText" className="margin-top-1">
            {t('requestDetails.businessNeedHelpText')}
          </HelpText>
          <ErrorMessage
            errors={errors}
            name="businessNeed"
            as={FieldErrorMsg}
          />
          <Textarea
            {...register('businessNeed')}
            ref={null}
            id="businessNeed"
            maxLength={10000}
            aria-describedby="businessNeedHelpText"
          />
        </FieldGroup>

        <FieldGroup
          scrollElement="businessSolution"
          error={!!errors.businessSolution}
        >
          <Label htmlFor="businessSolution">
            {t('requestDetails.businessSolution')}
          </Label>
          <HelpText id="businessSolutionHelpText" className="margin-top-1">
            {t('requestDetails.businessSolutionHelpText')}
          </HelpText>
          <ErrorMessage
            errors={errors}
            name="businessSolution"
            as={FieldErrorMsg}
          />
          <Textarea
            {...register('businessSolution')}
            ref={null}
            id="businessSolution"
            maxLength={10000}
            aria-describedby="businessSolutionHelpText"
          />
        </FieldGroup>

        <FieldGroup scrollElement="currentStage" error={!!errors.currentStage}>
          <Label htmlFor="currentStage">
            {t('requestDetails.currentStage')}
          </Label>
          <HelpText id="currentStageHelpText" className="margin-top-1">
            {t('requestDetails.currentStageHelpText')}
          </HelpText>
          <ErrorMessage
            errors={errors}
            name="currentStage"
            as={FieldErrorMsg}
          />
          <Dropdown
            {...register('currentStage')}
            ref={null}
            id="currentStage"
            aria-describedby="currentStageHelpText"
          >
            <option value="" disabled>
              {t('Select an option')}
            </option>
            {processStages.map(({ name, value }) => (
              <option key={value} value={name}>
                {name}
              </option>
            ))}
          </Dropdown>
        </FieldGroup>

        <hr className="margin-bottom-1 margin-top-4 opacity-30" aria-hidden />
        <span className="font-body-sm text-bold">
          {t('requestDetails.subsectionHeadings.collaboration')}
        </span>

        <FieldGroup
          scrollElement="needsEaSupport"
          error={!!errors.needsEaSupport}
        >
          <Fieldset>
            <legend className="text-bold">
              {t('requestDetails.needsEaSupport')}
            </legend>
            <HelpText id="needsEaSupportHelpText" className="margin-top-1">
              {t('requestDetails.needsEaSupportHelpText')}
            </HelpText>
            <ErrorMessage
              errors={errors}
              name="needsEaSupport"
              as={FieldErrorMsg}
            />

            <Controller
              control={control}
              name="needsEaSupport"
              render={({ field: { ref, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  checked={field.value === true}
                  id="needsEaSupportTrue"
                  label={t('Yes')}
                  onChange={() => field.onChange(true)}
                  value="true"
                  aria-describedby="needsEaSupportHelpText"
                />
              )}
            />

            <Controller
              control={control}
              name="needsEaSupport"
              render={({ field: { ref, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  checked={field.value === false}
                  id="needsEaSupportFalse"
                  label={t('No')}
                  onChange={() => field.onChange(false)}
                  value="true"
                  aria-describedby="needsEaSupportHelpText"
                />
              )}
            />
          </Fieldset>
        </FieldGroup>

        <CollapsableLink
          id="SystemIntake-WhatsEA"
          label={t('requestDetails.eaTeamHelp.label')}
          className="margin-top-2"
        >
          <>
            <p className="margin-top-0">
              {t('requestDetails.eaTeamHelp.description')}
            </p>
            <ul className="margin-bottom-0">
              <li>{t('requestDetails.eaTeamHelp.explore')}</li>
              <li>{t('requestDetails.eaTeamHelp.discuss')}</li>
              <li>{t('requestDetails.eaTeamHelp.give')}</li>
              <li>{t('requestDetails.eaTeamHelp.help')}</li>
              <li>{t('requestDetails.eaTeamHelp.model')}</li>
            </ul>
          </>
        </CollapsableLink>

        <hr className="margin-bottom-1 margin-top-4 opacity-30" aria-hidden />
        <span className="font-body-sm text-bold">
          {' '}
          {t('requestDetails.subsectionHeadings.projectDetails')}
        </span>

        <FieldGroup scrollElement="usesAiTech" error={!!errors.usesAiTech}>
          <Fieldset>
            <legend className="text-bold">
              {t('requestDetails.usesAiTech')}
            </legend>
            <HelpText id="usesAiTechHelpText" className="margin-top-1">
              <Trans
                i18nKey="intake:requestDetails.usesAiTechHelpText"
                components={{
                  aiEmail: (
                    <UswdsLink href={`mailto:${CMS_AI_EMAIL}`}> </UswdsLink>
                  ),
                  trbEmail: (
                    <UswdsLink href={`mailto:${CMS_TRB_EMAIL}`}> </UswdsLink>
                  )
                }}
              />
            </HelpText>
            <ErrorMessage
              errors={errors}
              name="usesAiTech"
              as={FieldErrorMsg}
            />

            <Controller
              control={control}
              name="usesAiTech"
              render={({ field: { ref, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  checked={field.value === true}
                  id="usesAiTechTrue"
                  label={t('Yes')}
                  onChange={() => field.onChange(true)}
                  value="true"
                  aria-describedby="usesAiTechHelpText"
                />
              )}
            />

            <Controller
              control={control}
              name="usesAiTech"
              render={({ field: { ref, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  checked={field.value === false}
                  id="usesAiTechFalse"
                  label={t('No')}
                  onChange={() => field.onChange(false)}
                  value="true"
                  aria-describedby="usesAiTechHelpText"
                />
              )}
            />
          </Fieldset>
        </FieldGroup>

        <FieldGroup scrollElement="hasUiChanges" error={!!errors.hasUiChanges}>
          <Fieldset>
            <legend className="text-bold">
              {t('requestDetails.hasUiChanges')}
            </legend>
            <ErrorMessage
              errors={errors}
              name="hasUiChanges"
              as={FieldErrorMsg}
            />

            <Controller
              control={control}
              name="hasUiChanges"
              render={({ field: { ref, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  checked={field.value === true}
                  id="hasUiChangesTrue"
                  label={t('Yes')}
                  onChange={() => field.onChange(true)}
                  value="true"
                  aria-describedby="hasUiChangesHelpText"
                />
              )}
            />

            <Controller
              control={control}
              name="hasUiChanges"
              render={({ field: { ref, ...field } }) => (
                <Radio
                  {...field}
                  inputRef={ref}
                  checked={field.value === false}
                  id="hasUiChangesFalse"
                  label={t('No')}
                  onChange={() => field.onChange(false)}
                  value="true"
                  aria-describedby="hasUiChangesHelpText"
                />
              )}
            />
          </Fieldset>
        </FieldGroup>

        <FieldGroup
          scrollElement="softwareAcquisition"
          error={!!errors.usingSoftware}
        >
          <Label htmlFor="softwareAcquisition">
            {t('requestDetails.softwareAcquisition.usingSoftwareLabel')}
          </Label>
          <HelpText id="elasHelpText" className="margin-top-1">
            <Trans
              i18nKey="intake:requestDetails.softwareAcquisition.usingSoftwareHelp"
              components={{
                dvsmEmail: (
                  <UswdsLink href={`mailto:${CMS_DVSM_EMAIL}`}> </UswdsLink>
                )
              }}
            />
          </HelpText>
          <ErrorMessage
            errors={errors}
            name="usingSoftware"
            as={FieldErrorMsg}
          />
          <Controller
            control={control}
            name="usingSoftware"
            render={({ field: { ref, value, ...field } }) => (
              <Radio
                {...field}
                inputRef={ref}
                id="usingSoftwareYes"
                label={t('Yes')}
                checked={value === 'YES'}
                onChange={() => field.onChange('YES')}
              />
            )}
          />
          {/* If 'Yes' is selected, display additional software props (software MultiSelect (to come later) and Acquisition Approach Checkboxes) */}
          {watch('usingSoftware') === 'YES' && (
            <div className="margin-left-4 margin-bottom-3">
              {/* TODO: We eventually want to display a ComboBox/MultiSelect of software the requester can select, before we 
                can do this we need a list of "CMS known" software and/or vendors that is currently being evaluated by ICPG / DVSM */}

              <Controller
                control={control}
                name="acquisitionMethods"
                render={({ field, fieldState: { error } }) => {
                  return (
                    <FormGroup error={!!error}>
                      <Label htmlFor="businessSolution">
                        {t(
                          'requestDetails.softwareAcquisition.acquisitionStrategyLabel'
                        )}
                      </Label>
                      <HelpText
                        id="businessSolutionHelpText"
                        className="margin-top-1"
                      >
                        {t(
                          'requestDetails.softwareAcquisition.acquisitionStrategyHelp'
                        )}
                      </HelpText>
                      <ErrorMessage
                        errors={errors}
                        name="acquisitionMethods"
                        as={FieldErrorMsg}
                      />
                      <Alert
                        type="info"
                        data-testid="mandatory-fields-alert"
                        slim
                      >
                        {t(
                          'requestDetails.softwareAcquisition.softwareRequirementsAlert'
                        )}
                      </Alert>
                      {Object.values(
                        SystemIntakeSoftwareAcquisitionMethods
                      ).map(acqMethod => {
                        return (
                          <React.Fragment key={acqMethod}>
                            <Checkbox
                              name={acqMethod}
                              id={`software-acquisition-${acqMethod}`}
                              label={t(
                                `requestDetails.softwareAcquisition.acquistionStrategyLabels.${acqMethod}`
                              )}
                              value={acqMethod}
                              checked={field.value.includes(acqMethod)}
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
                          </React.Fragment>
                        );
                      })}
                    </FormGroup>
                  );
                }}
              />
            </div>
          )}
          <Controller
            control={control}
            name="usingSoftware"
            render={({ field: { ref, value, ...field } }) => (
              <Radio
                {...field}
                inputRef={ref}
                id="usingSoftwareNo"
                label={t('No')}
                checked={value === 'NO'}
                onChange={() => {
                  field.onChange('NO');
                  setValue('acquisitionMethods', []);
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="usingSoftware"
            render={({ field: { ref, value, ...field } }) => (
              <Radio
                {...field}
                inputRef={ref}
                id="usingSoftwareNotSure"
                label={t('Not Sure')}
                checked={value === 'NOT_SURE'}
                onChange={() => {
                  field.onChange('NOT_SURE');
                  setValue('acquisitionMethods', []);
                }}
              />
            )}
          />
        </FieldGroup>

        <Pager
          next={{
            type: 'submit'
          }}
          back={{
            type: 'button',
            onClick: () => submit(() => history.push('contact-details'))
          }}
          border={false}
          taskListUrl={saveExitLink}
          submit={() => submit(() => history.push(saveExitLink))}
          className="margin-top-4"
        />
      </Form>

      <AutoSave values={watch()} onSave={submit} debounceDelay={3000} />

      <PageNumber currentPage={2} totalPages={5} />
    </>
  );
};

export default RequestDetails;
