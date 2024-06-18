import React, { useEffect, useMemo } from 'react';
import { FieldErrors, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Fieldset,
  Form,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import SystemIntakeContractStatus from 'constants/enums/SystemIntakeContractStatus';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeContractDetails as UpdateSystemIntakeContractDetailsQuery } from 'queries/SystemIntakeQueries';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  UpdateSystemIntakeContractDetails,
  UpdateSystemIntakeContractDetailsVariables
} from 'queries/types/UpdateSystemIntakeContractDetails';
import { SystemIntakeFormState } from 'types/graphql-global-types';
import { ContractDetailsForm } from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import formatContractNumbers from 'utils/formatContractNumbers';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import ContractFields from './ContractFields';
import FundingSources from './FundingSources';

import './index.scss';

type ContractDetailsProps = {
  systemIntake: SystemIntake;
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

  const [mutate] = useMutation<
    UpdateSystemIntakeContractDetails,
    UpdateSystemIntakeContractDetailsVariables
  >(UpdateSystemIntakeContractDetailsQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id
        }
      }
    ]
  });

  const form = useEasiForm<ContractDetailsForm>({
    resolver: yupResolver(SystemIntakeValidationSchema.contractDetails),
    defaultValues: {
      existingFunding,
      fundingSources,
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
    setValue,
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

  const formatContractDetailsPayload = (values: ContractDetailsForm) => {
    const startDate = DateTime.fromObject(
      {
        day: Number(values.contract.startDate.day) || 0,
        month: Number(values.contract.startDate.month) || 0,
        year: Number(values.contract.startDate.year) || 0
      },
      { zone: 'UTC' }
    ).toISO();

    const endDate = DateTime.fromObject(
      {
        day: Number(values.contract.endDate.day) || 0,
        month: Number(values.contract.endDate.month) || 0,
        year: Number(values.contract.endDate.year) || 0
      },
      { zone: 'UTC' }
    ).toISO();

    return {
      id,
      fundingSources: {
        existingFunding: !!(values.fundingSources.length > 0),
        fundingSources: values.fundingSources
      },
      annualSpending: values.annualSpending,
      contract: {
        ...values.contract,
        startDate,
        endDate,
        numbers:
          values.contract.numbers.length > 0
            ? values.contract.numbers.split(',').map(c => c.trim())
            : []
      }
    };
  };

  const onSubmit = handleSubmit(values => {
    if (!isDirty) history.push('documents');

    // TODO: Clear contract fields if hasContract value is NOT_STARTED or NOT_NEEDED

    mutate({
      variables: {
        input: formatContractDetailsPayload(values)
      }
    })
      .then(() => history.push('documents'))
      .catch(() =>
        setError('root', {
          message: t('error:encounteredIssueTryAgain')
        })
      );
  });

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
          testId="contact-details-errors"
          classNames="margin-top-3"
          heading={t('form:inputError.checkFix')}
        >
          {(Object.keys(fieldErrors) as Array<
            FieldPath<ContractDetailsForm>
          >).map(key => {
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

      <Form
        onSubmit={onSubmit}
        className="maxw-none tablet:grid-col-6 margin-bottom-7"
      >
        <FieldGroup
          scrollElement="fundingSources"
          error={!!errors.fundingSources}
        >
          <Fieldset>
            <legend className="usa-label">
              {t('contractDetails.fundingSources.label')}
            </legend>
            <HelpText className="margin-top-1" id="fundingSourcesHelpText">
              {t('contractDetails.fundingSources.helpText')}
            </HelpText>

            <FundingSources
              id="fundingSources"
              initialValues={watch('fundingSources')}
              setFieldValue={value => setValue('fundingSources', value)}
              fundingSourceOptions={intakeFundingSources}
            />
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
              label={t('contractDetails.hasContractRadio', {
                context: SystemIntakeContractStatus.HAVE_CONTRACT
              })}
            />

            {hasContract === SystemIntakeContractStatus.HAVE_CONTRACT && (
              <EasiFormProvider<ContractDetailsForm> {...form}>
                <ContractFields id="hasContractBranchWrapper" />
              </EasiFormProvider>
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
              label={t('contractDetails.hasContractRadio', {
                context: SystemIntakeContractStatus.IN_PROGRESS
              })}
            />

            {hasContract === SystemIntakeContractStatus.IN_PROGRESS && (
              <EasiFormProvider<ContractDetailsForm> {...form}>
                <ContractFields id="inProgressBranchWrapper" />
              </EasiFormProvider>
            )}

            <Radio
              {...register('contract.hasContract')}
              ref={null}
              id="contractNotStarted"
              value={SystemIntakeContractStatus.NOT_STARTED}
              aria-describedby="hasContractHelpText"
              label={t('contractDetails.hasContractRadio', {
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
              label={t('contractDetails.hasContractRadio', {
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
            onClick: () => history.push('request-details')
          }}
          border={false}
          taskListUrl={saveExitLink}
          submit={async () => history.push(saveExitLink)}
          className="margin-top-4"
        />
      </Form>

      {/* <AutoSave
        values={watch()}
        onSave={() =>
          partialSubmit({
            update: updateSystemIntake,
            clearErrors: false
          })
        }
        debounceDelay={3000}
      /> */}

      <PageNumber currentPage={3} totalPages={5} />
    </>
  );
};

export default ContractDetails;
