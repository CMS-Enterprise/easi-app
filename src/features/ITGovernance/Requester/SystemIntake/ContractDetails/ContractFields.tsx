import React, { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { Fieldset, TextInput } from '@trussworks/react-uswds';

import {
  DateInputDay,
  DateInputMonth,
  DateInputYear
} from 'components/DateInput';
import DateTimePicker from 'components/DateTimePicker';
import { useEasiFormContext } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import { ContractDetailsForm } from 'types/systemIntake';

type ContractFieldsProps = {
  id: string;
};

// Normalize anything the form might hold into an ISO string or null
const normalizeToISO = (v: unknown): string | null => {
  if (!v) return null;
  if (typeof v === 'string') {
    // empty string should be treated as null
    const trimmed = v.trim();
    if (!trimmed) return null;
    const d = new Date(trimmed);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (v instanceof Date) {
    return Number.isNaN(v.getTime()) ? null : v.toISOString();
  }
  // legacy { year, month, day }
  if (typeof v === 'object' && v !== null) {
    const anyV = v as any;
    if (anyV.year && anyV.month && anyV.day) {
      const d = new Date(
        Number(anyV.year),
        Number(anyV.month) - 1,
        Number(anyV.day)
      );
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    }
  }
  return null;
};

const ContractFields = ({ id }: ContractFieldsProps) => {
  const { t } = useTranslation('intake');

  const {
    control,
    register,
    watch,
    trigger,
    formState: { errors, isSubmitted }
  } = useEasiFormContext<ContractDetailsForm>();

  // Raw values from the form (could be anything)
  const startRaw = watch('contract.startDate');
  const endRaw = watch('contract.endDate');

  // Always expose ISO or null to the DateTimePicker
  const startISO = useMemo(() => normalizeToISO(startRaw), [startRaw]);
  const endISO = useMemo(() => normalizeToISO(endRaw), [endRaw]);

  const hasStartDateError: boolean = !!errors?.contract?.startDate;
  const hasEndDateError: boolean = !!errors?.contract?.endDate;

  // Trigger `startDate` validation when field is updated
  useEffect(() => {
    if (isSubmitted && hasStartDateError) {
      trigger('contract.startDate');
    }
  }, [hasStartDateError, isSubmitted, trigger]);

  // Trigger `endDate` validation when field is updated
  useEffect(() => {
    if (isSubmitted && hasEndDateError) {
      trigger('contract.endDate');
    }
  }, [hasEndDateError, isSubmitted, trigger]);

  return (
    <div id={id} className="margin-left-4 margin-top-1 margin-bottom-2">
      <FieldGroup
        className="margin-top-0"
        scrollElement="contract.contractor"
        error={!!errors.contract?.contractor}
      >
        <Label htmlFor="contractor" required>
          {t('contractDetails.contractors')}
        </Label>
        <ErrorMessage
          errors={errors}
          name="contract.contractor"
          as={FieldErrorMsg}
        />
        <TextInput
          {...register('contract.contractor')}
          ref={null}
          id="contractor"
          type="text"
          maxLength={100}
        />
      </FieldGroup>

      <FieldGroup
        scrollElement="contract.numbers"
        error={!!errors.contract?.numbers}
      >
        <Label htmlFor="numbers" required>
          {t('fields.contractNumber')}
        </Label>
        <ErrorMessage
          errors={errors}
          name="contract.numbers"
          as={FieldErrorMsg}
        />
        <TextInput
          {...register('contract.numbers')}
          ref={null}
          id="contractNumbers"
          type="text"
          maxLength={100}
        />
      </FieldGroup>
      <FieldGroup error={hasStartDateError || hasEndDateError}>
        <Fieldset>
          <legend className="usa-label">
            {t('contractDetails.periodOfPerformance')}
          </legend>
          <HelpText>
            {t('contractDetails.periodOfPerformanceHelpText')}
          </HelpText>

          {Object.keys(errors?.contract?.startDate || {}).map(key => (
            <ErrorMessage
              errors={errors}
              name={`contract.startDate.${key}`}
              as={FieldErrorMsg}
              key={key}
            />
          ))}

          {Object.keys(errors?.contract?.endDate || {}).map(key => (
            <ErrorMessage
              errors={errors}
              name={`contract.endDate.${key}`}
              as={FieldErrorMsg}
              key={key}
            />
          ))}

          <div className="grid-row grid-gap">
            <div className="grid-col-6">
              <FieldGroup>
                <Label htmlFor="contractStartDate" required>
                  {t('contractDetails.performanceStartDate')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name="contract.startDate"
                  as={FieldErrorMsg}
                />
                <Controller
                  control={control}
                  name="contract.startDate"
                  render={({ field }) => (
                    <DateTimePicker
                      id="contractStartDate"
                      name={field.name}
                      value={startISO ?? undefined}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldGroup>
            </div>
            <div className="grid-col-6">
              <FieldGroup>
                <Label htmlFor="contractEndDate" required>
                  {t('contractDetails.performanceEndDate')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name="contract.endDate"
                  as={FieldErrorMsg}
                />
                <Controller
                  control={control}
                  name="contract.endDate"
                  render={({ field }) => (
                    <DateTimePicker
                      id="contractEndDate"
                      name={field.name}
                      value={endISO ?? undefined}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FieldGroup>
            </div>
          </div>

          {/* TODO: Change this to a datepicker */}
          {/* <div className="display-flex flex-align-center">
            <div
              className="usa-memorable-date"
              data-scroll="contract.startDate.validDate"
            >
              <FieldGroup
                className="usa-form-group--month"
                scrollElement="contract.startDate.month"
              >
                <Label
                  className="system-intake__label-margin-top-0"
                  htmlFor="contractStartMonth"
                >
                  {t('general:date.month')}
                </Label>
                <Controller
                  control={control}
                  name="contract.startDate.month"
                  render={({
                    field: { ref, ...field },
                    fieldState: { error }
                  }) => (
                    <DateInputMonth
                      {...field}
                      inputRef={ref}
                      id="contractStartMonth"
                      error={!!error || hasStartDateError}
                    />
                  )}
                />
              </FieldGroup>

              <FieldGroup
                className="usa-form-group--day"
                scrollElement="contract.startDate.day"
              >
                <Label
                  className="system-intake__label-margin-top-0"
                  htmlFor="contractStartDay"
                >
                  {t('general:date.day')}
                </Label>
                <Controller
                  control={control}
                  name="contract.startDate.day"
                  render={({
                    field: { ref, ...field },
                    fieldState: { error }
                  }) => (
                    <DateInputDay
                      {...field}
                      inputRef={ref}
                      id="contractStartDay"
                      error={!!error || hasStartDateError}
                    />
                  )}
                />
              </FieldGroup>

              <FieldGroup
                className="usa-form-group--year"
                scrollElement="contract.startDate.year"
              >
                <Label
                  className="system-intake__label-margin-top-0"
                  htmlFor="contractStartYear"
                >
                  {t('general:date.year')}
                </Label>
                <Controller
                  control={control}
                  name="contract.startDate.year"
                  render={({
                    field: { ref, ...field },
                    fieldState: { error }
                  }) => (
                    <DateInputYear
                      {...field}
                      inputRef={ref}
                      id="contractStartYear"
                      error={!!error || hasStartDateError}
                    />
                  )}
                />
              </FieldGroup>
            </div>

            <div
              className="usa-memorable-date"
              data-scroll="contract.endDate.validDate"
            >
              <FieldGroup
                className="usa-form-group--month"
                scrollElement="contract.endDate.month"
              >
                <Label
                  className="system-intake__label-margin-top-0"
                  htmlFor="contractEndMonth"
                >
                  {t('general:date.month')}
                </Label>
                <Controller
                  control={control}
                  name="contract.endDate.month"
                  render={({
                    field: { ref, ...field },
                    fieldState: { error }
                  }) => (
                    <DateInputMonth
                      {...field}
                      inputRef={ref}
                      id="contractEndMonth"
                      error={!!error || hasEndDateError}
                    />
                  )}
                />
              </FieldGroup>
              <FieldGroup
                className="usa-form-group--day"
                scrollElement="contract.endDate.day"
              >
                <Label
                  className="system-intake__label-margin-top-0"
                  htmlFor="contractEndDay"
                >
                  {t('general:date.day')}
                </Label>
                <Controller
                  control={control}
                  name="contract.endDate.day"
                  render={({
                    field: { ref, ...field },
                    fieldState: { error }
                  }) => (
                    <DateInputDay
                      {...field}
                      inputRef={ref}
                      id="contractEndDay"
                      error={!!error || hasEndDateError}
                    />
                  )}
                />
              </FieldGroup>
              <FieldGroup
                className="usa-form-group--year"
                scrollElement="contract.endDate.year"
              >
                <Label
                  className="system-intake__label-margin-top-0"
                  htmlFor="contractEndYear"
                >
                  {t('general:date.year')}
                </Label>
                <Controller
                  control={control}
                  name="contract.endDate.year"
                  render={({
                    field: { ref, ...field },
                    fieldState: { error }
                  }) => (
                    <DateInputYear
                      {...field}
                      inputRef={ref}
                      id="contractEndYear"
                      error={!!error || hasEndDateError}
                    />
                  )}
                />
              </FieldGroup>
            </div>
          </div> */}
        </Fieldset>
      </FieldGroup>
    </div>
  );
};

export default ContractFields;
