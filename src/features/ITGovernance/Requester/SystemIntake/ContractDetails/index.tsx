import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldErrors, FieldPath } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Fieldset,
  Form,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
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
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import SystemIntakeContractStatus from 'constants/enums/SystemIntakeContractStatus';
import { ContractDetailsForm } from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import formatContractNumbers from 'utils/formatContractNumbers';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

import ContractFields from './ContractFields';

import './index.scss';

/** Converts contract date object to ISO */
const contractDateToISO = ({
  month,
  day,
  year
}: ContractDetailsForm['contract']['startDate']) =>
  DateTime.fromObject(
    {
      day: Number(day) || 0,
      month: Number(month) || 0,
      year: Number(year) || 0
    },
    { zone: 'UTC' }
  ).toISO();

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
        variables: {
          id
        }
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
        endDate: {
          day: contract.endDate.day || '',
          month: contract.endDate.month || '',
          year: contract.endDate.year || ''
        },
        hasContract: contract.hasContract as SystemIntakeContractStatus,
        startDate: {
          day: contract.startDate.day || '',
          month: contract.startDate.month || '',
          year: contract.startDate.year || ''
        },
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
    let link = '';
    if (systemIntake.requestType === 'SHUTDOWN') {
      link = '/';
    } else {
      link = `/governance-task-list/${systemIntake.id}`;
    }
    return link;
  })();

  const updateSystemIntake = useCallback(async () => {
    const values = watch();
    const payload = { ...values };

    // Clear contract subfields
    if (
      hasContract === SystemIntakeContractStatus.NOT_STARTED ||
      hasContract === SystemIntakeContractStatus.NOT_NEEDED
    ) {
      payload.contract = {
        ...values.contract,
        numbers: '',
        contractor: '',
        startDate: {
          month: '',
          day: '',
          year: ''
        },
        endDate: {
          month: '',
          day: '',
          year: ''
        }
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
            startDate: contractDateToISO(payload.contract.startDate),
            endDate: contractDateToISO(payload.contract.endDate),
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

    // Update intake
    const result = await updateSystemIntake();

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

  const hasErrors = Object.keys(errors).length > 0;

  /** Flattened field errors, excluding any root errors */
  const fieldErrors = useMemo(() => {
    return flattenFormErrors<ContractDetailsForm>({
      ...errors,
      ...(errors?.contract?.startDate && {
        'contract.startDate': errors?.contract?.startDate
      }),
      ...(errors?.contract?.startDate && {
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

      <PageHeading className="margin-bottom-3">
        {t('contractDetails.heading')}
      </PageHeading>

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner
          id={systemIntake.id}
          type="Intake Request"
          className="margin-bottom-3"
        />
      )}

      <MandatoryFieldsAlert className="tablet:grid-col-6" />

      <EasiFormProvider<ContractDetailsForm> {...form}>
        <Form
          onSubmit={handleSubmit(() =>
            submit(() => history.push('documents'), true)
          )}
          className="maxw-none tablet:grid-col-6 margin-bottom-7"
        >
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

          <FieldGroup
            scrollElement="annualSpending.currentAnnualSpending"
            error={!!errors.annualSpending?.currentAnnualSpending}
          >
            <Label htmlFor="annualSpending.currentAnnualSpending">
              {t('contractDetails.currentAnnualSpending')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="annualSpending.currentAnnualSpending"
              as={FieldErrorMsg}
            />
            <TextInput
              {...register('annualSpending.currentAnnualSpending')}
              ref={null}
              id="currentAnnualSpending"
              type="text"
              maxLength={200}
            />
          </FieldGroup>

          <FieldGroup
            scrollElement="annualSpending.currentAnnualSpendingITPortion"
            error={!!errors.annualSpending?.currentAnnualSpendingITPortion}
          >
            <Label htmlFor="annualSpending.currentAnnualSpendingITPortion">
              {t('contractDetails.currentAnnualSpendingITPortion')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="annualSpending.currentAnnualSpendingITPortion"
              as={FieldErrorMsg}
            />
            <TextInput
              {...register('annualSpending.currentAnnualSpendingITPortion')}
              ref={null}
              id="currentAnnualSpendingITPortion"
              type="text"
              maxLength={200}
            />
          </FieldGroup>

          <FieldGroup
            scrollElement="annualSpending.plannedYearOneSpending"
            error={!!errors.annualSpending?.plannedYearOneSpending}
          >
            <Label htmlFor="annualSpending.plannedYearOneSpending">
              {t('contractDetails.plannedYearOneSpending')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="annualSpending.plannedYearOneSpending"
              as={FieldErrorMsg}
            />
            <TextInput
              {...register('annualSpending.plannedYearOneSpending')}
              ref={null}
              id="plannedYearOneSpending"
              type="text"
              maxLength={200}
            />
          </FieldGroup>

          <FieldGroup
            scrollElement="annualSpending.plannedYearOneSpendingITPortion"
            error={!!errors.annualSpending?.plannedYearOneSpendingITPortion}
          >
            <Label htmlFor="annualSpending.plannedYearOneSpendingITPortion">
              {t('contractDetails.plannedYearOneSpendingITPortion')}
            </Label>
            <ErrorMessage
              errors={errors}
              name="annualSpending.plannedYearOneSpendingITPortion"
              as={FieldErrorMsg}
            />
            <TextInput
              {...register('annualSpending.plannedYearOneSpendingITPortion')}
              ref={null}
              id="plannedYearOneSpendingITPortion"
              type="text"
              maxLength={200}
            />
          </FieldGroup>

          <FieldGroup
            scrollElement="contract.hasContract"
            error={!!errors.contract?.hasContract}
          >
            <Fieldset>
              <legend className="usa-label">
                {t('contractDetails.hasContract')}
              </legend>
              <HelpText className="margin-top-1" id="haContractHelpText">
                {t('contractDetails.hasContractHelpText')}
              </HelpText>
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
            next={{
              type: 'submit'
            }}
            back={{
              type: 'button',
              onClick: () => submit(() => history.push('request-details'))
            }}
            border={false}
            taskListUrl={saveExitLink}
            submit={() => submit(() => history.push(saveExitLink))}
            className="margin-top-4"
          />
        </Form>
      </EasiFormProvider>

      <AutoSave values={watch()} onSave={submit} debounceDelay={3000} />

      <PageNumber currentPage={3} totalPages={5} />
    </>
  );
};

export default ContractDetails;
