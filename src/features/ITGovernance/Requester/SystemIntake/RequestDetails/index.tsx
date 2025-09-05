import React, { useEffect, useMemo } from 'react';
import { Controller, FieldPath } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  Fieldset,
  Form,
  FormGroup,
  Link,
  Link as UswdsLink,
  Radio,
  Select,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  GetSystemIntakeDocument,
  SystemIntakeFormState,
  SystemIntakeFragmentFragment,
  SystemIntakeSoftwareAcquisitionMethods,
  useUpdateSystemIntakeRequestDetailsMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import CollapsableLink from 'components/CollapsableLink';
import { useEasiForm } from 'components/EasiForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FeedbackBanner from 'components/FeedbackBanner';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import RequiredFieldsText from 'components/RequiredFieldsText';
import processStages from 'constants/enums/processStages';
import {
  CMS_AI_EMAIL,
  CMS_DVSM_EMAIL,
  CMS_TRB_EMAIL,
  ENTERPRISE_ARCH_EMAIL,
  IT_GOV_EMAIL
} from 'constants/externalUrls';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

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
  systemIntake: SystemIntakeFragmentFragment;
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

  const [mutate] = useUpdateSystemIntakeRequestDetailsMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeDocument,
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

  const currentStageOptions: string[] = t(
    'requestDetails.currentStageOptions',
    {
      returnObjects: true
    }
  );

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

      <PageHeading className="margin-top-4 margin-bottom-1">
        {t('requestDetails.heading')}
      </PageHeading>
      <p className="font-body-lg line-height-body-5 margin-top-0 margin-bottom-1">
        {t('requestDetails.description')}
      </p>

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner id={systemIntake.id} type="Intake Request" />
      )}

      <RequiredFieldsText className="margin-top-0 margin-bottom-5" />

      <Form
        onSubmit={handleSubmit(() =>
          submit(() => history.push('contract-details'), true)
        )}
        className="maxw-none tablet:grid-col-9 margin-bottom-5 border-top border-base-light padding-top-1"
      >
        <p className="margin-y-0 font-body-md text-bold">
          {t('requestDetails.subsectionHeadings.projectConcept')}
        </p>
        <HelpText>
          <Trans
            i18nKey="intake:requestDetails.projectConceptHelpText"
            values={{ email: IT_GOV_EMAIL }}
            components={{
              emailLink: <Link href={`mailto:${IT_GOV_EMAIL}`}> </Link>
            }}
          />
        </HelpText>

        <FieldGroup scrollElement="requestName" error={!!errors.requestName}>
          <Label htmlFor="requestName" required>
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
          <Label htmlFor="businessNeed" className="maxw-none" required>
            {t('requestDetails.businessNeed')}
          </Label>
          <HelpText id="businessNeedHelpText" className="margin-top-1">
            {t('requestDetails.businessNeedHelpText')}
          </HelpText>
          <CollapsableLink
            id="businessNeed"
            label={t('requestDetails.viewExampleAnswer')}
            className="margin-y-1"
          >
            <p className="margin-y-0">
              {t('requestDetails.businessNeedExampleAnswer')}
            </p>
          </CollapsableLink>
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
          <Label htmlFor="businessSolution" required>
            {t('requestDetails.businessSolution')}
          </Label>
          <HelpText id="businessSolutionHelpText" className="margin-top-1">
            {t('requestDetails.businessSolutionHelpText')}
          </HelpText>
          <CollapsableLink
            id="businessSolution"
            label={t('requestDetails.viewExampleAnswer')}
            className="margin-y-1"
          >
            <p className="margin-y-0">
              {t('requestDetails.businessSolutionExampleAnswer')}
            </p>
          </CollapsableLink>
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
          <Label htmlFor="currentStage" required>
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
          <Select
            {...register('currentStage')}
            ref={null}
            id="currentStage"
            aria-describedby="currentStageHelpText"
          >
            <option value="" disabled>
              - {t('Select')} -
            </option>

            {processStages.map(({ name, value }) => (
              <option key={value} value={name}>
                {name}
              </option>
            ))}
          </Select>
          <CollapsableLink
            id="currentStage"
            label={t('requestDetails.currentStageCollapseLinkText')}
            className="margin-y-1"
          >
            <ul className="margin-y-0 padding-left-3">
              {currentStageOptions.map((item, index) => (
                <li key={item} className="line-height-sans-5 margin-bottom-1">
                  <Trans
                    i18nKey={`intake:requestDetails.currentStageOptions.${index}`}
                    components={{ bold: <strong /> }}
                  />
                </li>
              ))}
            </ul>
          </CollapsableLink>
          {/* {watch('currentStage') === processStages[1].name && (
            <Controller
              control={control}
              name="usingSoftware"
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormGroup error={!!error}>
                    <Label
                      htmlFor="businessSolution"
                      className="maxw-none"
                      required
                    >
                      {t('requestDetails.itDev')}
                    </Label>
                    <HelpText id="businessSolutionHelpText">
                      {t('requestDetails.itDevHelp')}
                    </HelpText>
                    <ErrorMessage
                      errors={errors}
                      name="acquisitionMethods"
                      as={FieldErrorMsg}
                    />
                    <DateTimePicker
                      id="test"
                      name="test"
                      // TODO: Update this when this new section gets added
                      value="12/12/2025"
                      onChange={(date: string | null) => field.onChange(date)}
                    />
                  </FormGroup>
                );
              }}
            />
          )} */}
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
            <Label htmlFor="needsEaSupport" required>
              {t('requestDetails.needsEaSupport')}
            </Label>
            <HelpText id="needsEaSupportHelpText" className="margin-top-1">
              <Trans
                i18nKey="intake:requestDetails.needsEaSupportHelpText"
                components={{
                  email: (
                    <UswdsLink href={`mailto:${ENTERPRISE_ARCH_EMAIL}`}>
                      {' '}
                    </UswdsLink>
                  )
                }}
              />
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
          {t('requestDetails.subsectionHeadings.projectDetails')}
        </span>

        <FieldGroup scrollElement="usesAiTech" error={!!errors.usesAiTech}>
          <Fieldset>
            <Label htmlFor="usesAiTech" required>
              {t('requestDetails.usesAiTech')}
            </Label>
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
            <Label htmlFor="hasUiChanges" className="maxw-none" required>
              {t('requestDetails.hasUiChanges')}
            </Label>
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
          <Label htmlFor="softwareAcquisition" className="maxw-none" required>
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
                      <Label htmlFor="acquisitionMethods" required>
                        {t(
                          'requestDetails.softwareAcquisition.acquisitionStrategyLabel'
                        )}
                      </Label>
                      <HelpText id="businessSolutionHelpText">
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
                        className="margin-top-1"
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
                label={t('requestDetails.softwareAcquisition.notSure')}
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
          border
          taskListUrl={saveExitLink}
          submit={() => submit(() => history.push(saveExitLink))}
          className="margin-top-5"
        />
      </Form>

      <AutoSave values={watch()} onSave={submit} debounceDelay={3000} />

      <PageNumber currentPage={2} totalPages={5} className="margin-bottom-15" />
    </>
  );
};

export default RequestDetails;
