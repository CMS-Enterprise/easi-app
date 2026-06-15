import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormGroup, Radio, Select } from '@trussworks/react-uswds';
import { SystemIntakeLCIDType } from 'gql/generated/graphql';

import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';

type LcidMetadataFieldsProps<T extends FieldValues> = {
  control: Control<T>;
  required?: boolean;
};

const lcidTypeOptions = Object.values(SystemIntakeLCIDType);

const LcidMetadataFields = <T extends FieldValues>({
  control,
  required = false
}: LcidMetadataFieldsProps<T>) => {
  const { t } = useTranslation('action');

  return (
    <>
      <Controller
        name={'lcidType' as Path<T>}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <FormGroup error={!!error}>
            <Label
              htmlFor={field.name}
              className="text-normal"
              required={required}
            >
              {t('issueLCID.lcidType.label')}
            </Label>
            {!!error?.message && (
              <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
            )}
            <Select
              {...field}
              id={field.name}
              value={field.value || ''}
              onChange={e => field.onChange(e.target.value || undefined)}
            >
              <option value="">{`- ${t('Select')} -`}</option>
              {lcidTypeOptions.map(option => (
                <option key={option} value={option}>
                  {t(`issueLCID.lcidType.${option}`)}
                </option>
              ))}
            </Select>
          </FormGroup>
        )}
      />

      <Controller
        name={'lcidIsLowIt' as Path<T>}
        control={control}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <FormGroup error={!!error}>
            <Label
              htmlFor={field.name}
              className="text-normal"
              required={required}
            >
              {t('issueLCID.lcidIsLowIt.label')}
            </Label>
            <HelpText className="margin-top-1" id={`${field.name}-hint`}>
              {t('issueLCID.lcidIsLowIt.helpText')}
            </HelpText>
            {!!error?.message && (
              <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
            )}
            <Radio
              {...field}
              inputRef={ref}
              id="lcidIsLowItTrue"
              label={t('issueLCID.lcidIsLowIt.yes')}
              checked={field.value === true}
              onChange={() => field.onChange(true)}
              value="true"
              aria-describedby={`${field.name}-hint`}
            />
            <Radio
              {...field}
              inputRef={ref}
              id="lcidIsLowItFalse"
              label={t('issueLCID.lcidIsLowIt.no')}
              checked={field.value === false}
              onChange={() => field.onChange(false)}
              value="false"
              aria-describedby={`${field.name}-hint`}
            />
          </FormGroup>
        )}
      />
    </>
  );
};

export default LcidMetadataFields;
