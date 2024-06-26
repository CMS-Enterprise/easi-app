import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { Button, ButtonGroup, Link, TextInput } from '@trussworks/react-uswds';

import { useEasiForm, useEasiFormContext } from 'components/EasiForm';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import MultiSelect from 'components/shared/MultiSelect';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import { ContractDetailsForm } from 'types/systemIntake';

import {
  formatFundingSourcesForApi,
  formatFundingSourcesForApp
} from './utils';

export type FormattedFundingSource = {
  id: string;
  fundingNumber: string | null;
  sources: string[];
};

export interface FundingSourcesField {
  fundingSources: FormattedFundingSource[];
}

const FundingSources = () => {
  const { t } = useTranslation('intake');

  const [
    activeFundingSource,
    setActiveFundingSource
  ] = useState<FormattedFundingSource | null>(null);

  const intakeForm = useEasiFormContext<{
    fundingSources: ContractDetailsForm['fundingSources'];
  }>();

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors }
  } = useEasiForm<FundingSourcesField>({
    defaultValues: {
      fundingSources: formatFundingSourcesForApp(
        intakeForm.getValues().fundingSources
      )
    }
  });

  const { append } = useFieldArray({
    control,
    name: 'fundingSources'
  });

  const fundingSources = watch('fundingSources');

  /** Update parent form funding sources and reset active funding source */
  const submit = handleSubmit(values => {
    const formattedFundingSources = formatFundingSourcesForApi(
      values.fundingSources
    );

    intakeForm.setValue('fundingSources', formattedFundingSources);

    setActiveFundingSource(null);
  });

  // For new funding sources, set correct ID
  useEffect(() => {
    if (fundingSources.length > 0 && activeFundingSource?.id === '') {
      setActiveFundingSource(fundingSources[fundingSources.length - 1]);
    }
  }, [fundingSources, activeFundingSource, setActiveFundingSource]);

  return (
    <div>
      {fundingSources.map((source, index) => {
        if (source.id === activeFundingSource?.id) {
          return (
            <div key={source.id} id={`fundingSources.${index}.fundingNumber`}>
              <FieldGroup>
                <Label
                  htmlFor={`fundingSources.${index}.fundingNumber`}
                  className="text-normal"
                >
                  {t('contractDetails.fundingSources.fundingNumber')}
                </Label>
                <HelpText id="fundingNumberHelpText">
                  {t('contractDetails.fundingSources.fundingNumberHelpText')}
                </HelpText>
                <ErrorMessage
                  errors={errors}
                  name="fundingSources.fundingNumber"
                  as={FieldErrorMsg}
                />
                <TextInput
                  {...register(`fundingSources.${index}.fundingNumber`)}
                  ref={null}
                  type="text"
                  id={`fundingSources.${index}.fundingNumber`}
                />

                <HelpText
                  id="IntakeForm-FundingNumberHelp"
                  className="margin-top-1"
                >
                  <Link
                    href="https://cmsintranet.share.cms.gov/JT/Pages/Budget.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {t('contractDetails.fundingSources.fundingNumberLink')}
                  </Link>
                </HelpText>
              </FieldGroup>

              <FieldGroup>
                <Label htmlFor="fundingSources" className="text-normal">
                  {t('contractDetails.fundingSources.fundingSource')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name="fundingSources.sources"
                  as={FieldErrorMsg}
                />
                <Controller
                  name={`fundingSources.${index}.sources`}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <MultiSelect
                      {...field}
                      id="IntakeForm-FundingSources"
                      selectedLabel={t('Funding sources')}
                      options={intakeFundingSources.map(option => ({
                        value: option,
                        label: t(option)
                      }))}
                      onChange={values => field.onChange(values)}
                      initialValues={activeFundingSource.sources}
                    />
                  )}
                />
              </FieldGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => {
                    // TODO: If new, remove from array

                    setActiveFundingSource(null);
                  }}
                >
                  {t('Cancel')}
                </Button>
                <Button type="button" onClick={submit}>
                  {t('Save')}
                </Button>
              </ButtonGroup>
            </div>
          );
        }

        return (
          <div key={source.id}>
            {/**
             * TODO: Display funding sources
             * */}
          </div>
        );
      })}

      <Button
        type="button"
        onClick={() => {
          const newSource = {
            fundingNumber: '',
            sources: [],
            id: ''
          };
          setActiveFundingSource(newSource);
          append(newSource);
        }}
        outline
      >
        {t('contractDetails.fundingSources.addFundingSource')}
      </Button>
    </div>
  );
};

export default FundingSources;
