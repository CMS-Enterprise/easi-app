import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldErrors, FieldPath } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Fieldset,
  Form,
  InputGroup,
  InputPrefix,
  InputSuffix,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  ContractDate,
  GetSystemIntakeDocument,
  SystemIntakeFormState,
  SystemIntakeFragmentFragment,
  useUpdateSystemIntakeContractDetailsMutation
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FeedbackBanner from 'components/FeedbackBanner';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import FundingSources from 'components/FundingSources';
import {
  formatFundingSourcesForApi,
  formatFundingSourcesForApp
} from 'components/FundingSources/utils';
import HelpText from 'components/HelpText';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import RequiredFieldsText from 'components/RequiredFieldsText';
import SystemIntakeContractStatus from 'constants/enums/SystemIntakeContractStatus';
import { ContractDetailsForm } from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import formatContractNumbers from 'utils/formatContractNumbers';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

import ContractFields from './ContractFields';

import './index.scss';

/**
 * Convert ISO string or generated GQL ContractDate into a normalized UTC ISO string.
 * Returns null if invalid/absent.
 */
const toIsoOrNull = (d?: string | ContractDate | null): string | null => {
  if (!d) return null;

  if (typeof d === 'string') {
    const trimmed = d.trim();
    if (!trimmed) return null;
    const dt = DateTime.fromISO(trimmed, { zone: 'utc' });
    return dt.isValid ? dt.toISO() : null;
  }

  const { year, month, day } = d;
  if (!year || !month || !day) return null;

  const dt = DateTime.fromObject(
    { year: Number(year), month: Number(month), day: Number(day) },
    { zone: 'utc' }
  );
  return dt.isValid ? dt.toISO() : null;
};

// For API payloads we want ISO or null; the same helper works.
const contractDateToISOForApi = toIsoOrNull;

type ContractDetailsProps = {
  systemIntake: SystemIntakeFragmentFragment;
};

const ContractDetails = ({ systemIntake }: ContractDetailsProps) => {
  const history = useHistory();
  const { t } = useTranslation('intake');

  const {
    id,
    fundingSources,
    annualSpending,
    contract,
    existingFunding,
    contractNumbers
  } = systemIntake;

  const [mutate] = useUpdateSystemIntakeContractDetailsMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeDocument,
        variables: { id }
      }
    ]
  });

  const form = useEasiForm<ContractDetailsForm>({
    resolver: yupResolver(SystemIntakeValidationSchema.contractDetails),
    defaultValues: {
      existingFunding: existingFunding !== false,
      fundingSources: formatFundingSourcesForApp(fundingSources),
      annualSpending: {
        currentAnnualSpending: annualSpending?.currentAnnualSpending || '',
        currentAnnualSpendingITPortion:
          annualSpending?.currentAnnualSpendingITPortion || '',
        plannedYearOneSpending: annualSpending?.plannedYearOneSpending || '',
        plannedYearOneSpendingITPortion:
          annualSpending?.plannedYearOneSpendingITPortion || ''
      },
      contract: {
        contractor: contract.contractor || '',
        hasContract: contract.hasContract as SystemIntakeContractStatus,
        startDate: toIsoOrNull(contract.startDate),
        endDate: toIsoOrNull(contract.endDate),
        numbers: formatContractNumbers(contractNumbers)
      }
    }
  });

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = form;

  const hasContract = watch('contract.hasContract');

  const saveExitLink = (() => {
    if (systemIntake.requestType === 'SHUTDOWN') return '/';
    return `/governance-task-list/${systemIntake.id}`;
  })();

  const updateSystemIntake = useCallback(async () => {
    const values = watch();
    const payload = { ...values };

    // Clear contract subfields if not applicable
    if (
      hasContract === SystemIntakeContractStatus.NOT_STARTED ||
      hasContract === SystemIntakeContractStatus.NOT_NEEDED
    ) {
      payload.contract = {
        ...values.contract,
        numbers: '',
        contractor: '',
        startDate: null,
        endDate: null
      };
    }

    return mutate({
      variables: {
        input: {
          id,
          fundingSources: {
            existingFunding: payload.existingFunding,
            fundingSources: formatFundingSourcesForApi(payload.fundingSources)
          },
          annualSpending: payload.annualSpending,
          contract: {
            ...payload.contract,
            // Convert to ISO or null for API
            startDate: contractDateToISOForApi(payload.contract.startDate),
            endDate: contractDateToISOForApi(payload.contract.endDate),
            numbers:
              payload.contract.numbers.length > 0
                ? payload.contract.numbers.split(',').map(c => c.trim())
                : []
          }
        }
      }
    });
  }, [watch, hasContract, id, mutate]);

  const submit = async (
    callback: () => void = () => {},
    validate: boolean = false
  ) => {
    if (!isDirty) callback();

    const result = await updateSystemIntake();

    if (!result?.errors) return callback();

    if (validate) {
      return setError('root', {
        message: t('error:encounteredIssueTryAgain')
      });
    }

    return callback();
  };

  const hasErrors = Object.keys(errors).length > 0;

  /** Flattened field errors, excluding any root errors */
  const fieldErrors = useMemo(() => {
    return flattenFormErrors<ContractDetailsForm>({
      ...errors,
      ...(errors?.contract?.startDate && {
        'contract.startDate': errors?.contract?.startDate
      }),
      ...(errors?.contract?.endDate && {
        'contract.endDate': errors?.contract?.endDate
      })
    } as FieldErrors<ContractDetailsForm>);
  }, [errors]);

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
          testId="contract-details-errors"
          classNames="margin-top-3"
          heading={t('form:inputError.checkFix')}
        >
          {(
            Object.keys(fieldErrors) as Array<FieldPath<ContractDetailsForm>>
          ).map(key => {
            return (
              <ErrorMessage
                errors={errors}
                name={key}
                key={key}
                render={({ message }) => (
                  <ErrorAlertMessage message={message} errorKey={key} />
                )}
              />
            );
          })}
        </ErrorAlert>
      )}

      <ErrorMessage errors={errors} name="root" as={<Alert type="error" />} />

      <PageHeading className="margin-top-4 margin-bottom-1">
        {t('contractDetails.heading')}
      </PageHeading>
      <p className="font-body-lg line-height-body-5 margin-top-0 margin-bottom-1">
        {t('contractDetails.description')}
      </p>

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner
          id={systemIntake.id}
          type="Intake Request"
          className="margin-bottom-3"
        />
      )}

      <RequiredFieldsText className="margin-top-0 margin-bottom-5" />

      <EasiFormProvider<ContractDetailsForm> {...form}>
        <Form
          onSubmit={handleSubmit(() =>
            submit(() => history.push('documents'), true)
          )}
          className="maxw-none desktop:grid-col-9 margin-bottom-5 border-top border-base-light padding-top-1"
        >
          <h4 className="text-bold margin-y-0">
            {t('contractDetails.fundingAndBudget')}
          </h4>
          <FieldGroup
            scrollElement="fundingSources"
            error={!!errors.fundingSources}
          >
            <Fieldset>
              <legend className="usa-label">
                {t('fundingSources:whichFundingSources')}
              </legend>
              <HelpText className="margin-top-05" id="fundingSourcesHelpText">
                <Trans
                  i18nKey="fundingSources:helpText"
                  components={{
                    a: <a href="mailto:IT_Governance@cms.hhs.gov">email</a>
                  }}
                />
              </HelpText>

              <ErrorMessage
                errors={errors}
                name="fundingSources"
                as={FieldErrorMsg}
              />

              <FundingSources />
            </Fieldset>
          </FieldGroup>

          <div className="grid-row grid-gap">
            <div className="grid-col-12 desktop:grid-col-7">
              <FieldGroup
                scrollElement="annualSpending.currentAnnualSpending"
                error={!!errors.annualSpending?.currentAnnualSpending}
              >
                <Label
                  className="maxw-none"
                  htmlFor="annualSpending.currentAnnualSpending"
                >
                  {t('contractDetails.currentAnnualSpending')}
                </Label>
                <HelpText id="annualSpending.currentAnnualSpending">
                  {t('contractDetails.currentAnnualSpendingHelpText')}
                </HelpText>
                <ErrorMessage
                  errors={errors}
                  name="annualSpending.currentAnnualSpending"
                  as={FieldErrorMsg}
                />
                <InputGroup className="maxw-none">
                  <InputPrefix>$</InputPrefix>
                  <TextInput
                    {...register('annualSpending.currentAnnualSpending')}
                    ref={null}
                    id="currentAnnualSpending"
                    type="text"
                    maxLength={200}
                  />
                </InputGroup>
              </FieldGroup>
            </div>

            <div className="grid-col-12 desktop:grid-col-5">
              <FieldGroup
                scrollElement="annualSpending.currentAnnualSpendingITPortion"
                error={!!errors.annualSpending?.currentAnnualSpendingITPortion}
              >
                <Label
                  className="maxw-none"
                  htmlFor="annualSpending.currentAnnualSpendingITPortion"
                >
                  {t('contractDetails.currentAnnualSpendingITPortion')}
                </Label>

                <ErrorMessage
                  errors={errors}
                  name="annualSpending.currentAnnualSpendingITPortion"
                  as={FieldErrorMsg}
                />
                <InputGroup className="maxw-none">
                  <TextInput
                    {...register(
                      'annualSpending.currentAnnualSpendingITPortion'
                    )}
                    ref={null}
                    id="currentAnnualSpendingITPortion"
                    type="text"
                    maxLength={200}
                  />
                  <InputSuffix>%</InputSuffix>
                </InputGroup>
              </FieldGroup>
            </div>
          </div>

          <div className="grid-row grid-gap">
            <div className="grid-col-12 desktop:grid-col-7">
              <FieldGroup
                scrollElement="annualSpending.plannedYearOneSpending"
                error={!!errors.annualSpending?.plannedYearOneSpending}
              >
                <Label
                  className="maxw-none"
                  htmlFor="annualSpending.plannedYearOneSpending"
                >
                  {t('contractDetails.plannedYearOneSpending')}
                </Label>
                <HelpText id="annualSpending.plannedYearOneSpending">
                  {t('contractDetails.plannedYearOneSpendingHelpText')}
                </HelpText>
                <ErrorMessage
                  errors={errors}
                  name="annualSpending.plannedYearOneSpending"
                  as={FieldErrorMsg}
                />
                <InputGroup className="maxw-none">
                  <InputPrefix>$</InputPrefix>
                  <TextInput
                    {...register('annualSpending.plannedYearOneSpending')}
                    ref={null}
                    id="plannedYearOneSpending"
                    type="text"
                    maxLength={200}
                  />
                </InputGroup>
              </FieldGroup>
            </div>

            <div className="grid-col-12 desktop:grid-col-5">
              <FieldGroup
                scrollElement="annualSpending.plannedYearOneSpendingITPortion"
                error={!!errors.annualSpending?.plannedYearOneSpendingITPortion}
              >
                <Label
                  className="maxw-none"
                  htmlFor="annualSpending.plannedYearOneSpendingITPortion"
                >
                  {t('contractDetails.plannedYearOneSpendingITPortion')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name="annualSpending.plannedYearOneSpendingITPortion"
                  as={FieldErrorMsg}
                />
                <InputGroup className="maxw-none">
                  <TextInput
                    {...register(
                      'annualSpending.plannedYearOneSpendingITPortion'
                    )}
                    ref={null}
                    id="plannedYearOneSpendingITPortion"
                    type="text"
                    maxLength={200}
                  />
                  <InputSuffix>%</InputSuffix>
                </InputGroup>
              </FieldGroup>
            </div>
          </div>

          <FieldGroup
            scrollElement="contract.hasContract"
            error={!!errors.contract?.hasContract}
            className="border-top border-base-light padding-top-1 margin-top-4"
          >
            <h4 className="margin-top-0 margin-bottom-3 text-bold">
              {t('contractDetails.contractHeading')}
            </h4>
            <Fieldset>
              <Label
                className="maxw-none"
                htmlFor="contractHaveContract"
                requiredMarker
              >
                {t('contractDetails.hasContract')}
              </Label>
              <ErrorMessage
                errors={errors}
                name="contract.hasContract"
                as={FieldErrorMsg}
              />

              <Radio
                {...register('contract.hasContract')}
                ref={null}
                id="contractHaveContract"
                value={SystemIntakeContractStatus.HAVE_CONTRACT}
                aria-describedby="hasContractHelpText"
                aria-expanded={
                  hasContract === SystemIntakeContractStatus.HAVE_CONTRACT
                }
                aria-controls="hasContractBranchWrapper"
                label={t('contractDetails.hasContract', {
                  context: SystemIntakeContractStatus.HAVE_CONTRACT
                })}
              />

              {hasContract === SystemIntakeContractStatus.HAVE_CONTRACT && (
                <ContractFields id="hasContractBranchWrapper" />
              )}

              <Radio
                {...register('contract.hasContract')}
                ref={null}
                id="contractInProgress"
                value={SystemIntakeContractStatus.IN_PROGRESS}
                aria-describedby="hasContractHelpText"
                aria-expanded={
                  hasContract === SystemIntakeContractStatus.IN_PROGRESS
                }
                aria-controls="inProgressBranchWrapper"
                label={t('contractDetails.hasContract', {
                  context: SystemIntakeContractStatus.IN_PROGRESS
                })}
              />

              {hasContract === SystemIntakeContractStatus.IN_PROGRESS && (
                <ContractFields id="inProgressBranchWrapper" />
              )}

              <Radio
                {...register('contract.hasContract')}
                ref={null}
                id="contractNotStarted"
                value={SystemIntakeContractStatus.NOT_STARTED}
                aria-describedby="hasContractHelpText"
                label={t('contractDetails.hasContract', {
                  context: SystemIntakeContractStatus.NOT_STARTED
                })}
                labelDescription={
                  <p className="text-base margin-bottom-0 margin-top-neg-1 font-sans-xs">
                    {t('contractDetails.hasContractRadioHint')}
                  </p>
                }
              />

              <Radio
                {...register('contract.hasContract')}
                ref={null}
                id="contractNotNeeded"
                value={SystemIntakeContractStatus.NOT_NEEDED}
                aria-describedby="hasContractHelpText"
                label={t('contractDetails.hasContract', {
                  context: SystemIntakeContractStatus.NOT_NEEDED
                })}
                labelDescription={
                  <p className="text-base margin-bottom-0 margin-top-neg-1 font-sans-xs">
                    {t('contractDetails.hasContractRadioHint')}
                  </p>
                }
              />
            </Fieldset>
          </FieldGroup>

          <Pager
            next={{ type: 'submit' }}
            back={{
              type: 'button',
              onClick: () => submit(() => history.push('request-details'))
            }}
            border
            taskListUrl={saveExitLink}
            submit={() => submit(() => history.push(saveExitLink))}
            className="margin-top-5"
          />
        </Form>
      </EasiFormProvider>

      <AutoSave values={watch()} onSave={submit} debounceDelay={3000} />

      <PageNumber currentPage={3} totalPages={5} className="margin-bottom-15" />
    </>
  );
};

export default ContractDetails;
