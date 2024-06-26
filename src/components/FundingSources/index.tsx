import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Link,
  TextInput
} from '@trussworks/react-uswds';

import { useEasiForm, useEasiFormContext } from 'components/EasiForm';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import MultiSelect from 'components/shared/MultiSelect';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import { ContractDetailsForm } from 'types/systemIntake';
import { FundingSourcesValidationSchema } from 'validations/systemIntakeSchema';

import {
  formatFundingSourcesForApi,
  formatFundingSourcesForApp
} from './utils';

export type FormattedFundingSource = {
  id: string;
  fundingNumber: string | null;
  sources: string[];
};

type FundingSourcesField = {
  fundingSources: FormattedFundingSource[];
};

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
    resolver: yupResolver(FundingSourcesValidationSchema),
    defaultValues: {
      // Get default values from parent form
      fundingSources: formatFundingSourcesForApp(
        intakeForm.getValues().fundingSources
      )
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'fundingSources'
  });

  const fundingSources = watch('fundingSources');

  /** Type of action for funding sources form */
  const action: 'Add' | 'Edit' | null = useMemo(() => {
    if (!activeFundingSource) return null;

    const isExistingFundingSource = intakeForm
      .getValues()
      .fundingSources.some(({ id }) => id === activeFundingSource.id);

    return isExistingFundingSource ? 'Edit' : 'Add';
  }, [intakeForm, activeFundingSource]);

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
    <div id="intakeFundingSources">
      {fundingSources.map((source, index) => {
        const { fundingNumber, sources, id } = source;

        // Show form if adding or editing funding source
        if (id === activeFundingSource?.id) {
          return (
            <Fieldset
              key={id}
              id={`fundingSources.${index}.fundingNumber`}
              className="margin-top-3"
            >
              <legend className="usa-legend text-bold">
                {t('contractDetails.fundingSources.formLegend', {
                  action
                })}
              </legend>
              <FieldGroup
                className="margin-top-2"
                error={!!errors?.fundingSources?.[index]?.fundingNumber}
              >
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
                  name={`fundingSources.${index}.fundingNumber`}
                  as={FieldErrorMsg}
                />
                <TextInput
                  {...register(`fundingSources.${index}.fundingNumber`)}
                  ref={null}
                  type="text"
                  id="fundingNumber"
                  aria-describedby="fundingNumberHelptext fundingNumberHelpLink"
                />

                <HelpText id="fundingNumberHelpLink" className="margin-top-1">
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

              <FieldGroup error={!!errors?.fundingSources?.[index]?.sources}>
                <Label htmlFor="sources" className="text-normal">
                  {t('contractDetails.fundingSources.fundingSource')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name={`fundingSources.${index}.sources`}
                  as={FieldErrorMsg}
                />
                <Controller
                  name={`fundingSources.${index}.sources`}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <MultiSelect
                      {...field}
                      id="sources"
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
                  outline
                  onClick={() => {
                    // If cancelling new funding source, remove from array
                    if (action === 'Add') remove(index);

                    // If cancelling edit, restore previous values
                    if (action === 'Edit') {
                      update(index, fields[index]);
                    }

                    // reset active funding source
                    setActiveFundingSource(null);
                  }}
                >
                  {t('Cancel')}
                </Button>

                <Button
                  type="button"
                  onClick={submit}
                  data-testid="fundingSourcesAction-save"
                >
                  {t('Save')}
                </Button>
              </ButtonGroup>
            </Fieldset>
          );
        }

        // Display funding source
        return (
          <div
            id={`fundingSource${fundingNumber}`}
            key={id}
            className="margin-top-205"
          >
            <p className="text-bold font-body-sm margin-bottom-0">
              {t('contractDetails.fundingSources.fundingSource')}
            </p>
            <p className="margin-y-05">
              {t('contractDetails.fundingSources.fundingNumberLabel', {
                fundingNumber
              })}
            </p>
            <p className="margin-y-05">
              {t('contractDetails.fundingSources.fundingSourcesLabel', {
                sources: sources.join(', ')
              })}
            </p>

            <ButtonGroup>
              <Button
                unstyled
                onClick={() => {
                  // If currently adding new funding source, remove from array
                  if (action === 'Add') {
                    remove(fields.length - 1);
                  }

                  setActiveFundingSource(source);
                }}
                type="button"
                className="margin-top-1"
              >
                {t('Edit')}
              </Button>

              <Button
                unstyled
                onClick={() => remove(index)}
                type="button"
                className="text-error margin-top-1"
              >
                {t('Delete')}
              </Button>
            </ButtonGroup>
          </div>
        );
      })}

      {
        // Add funding source button
        !activeFundingSource && (
          <Button
            data-testid="fundingSourcesAction-add"
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
            {t(
              `contractDetails.fundingSources.${
                fundingSources.length > 0
                  ? 'addAnotherFundingSource'
                  : 'addFundingSource'
              }`
            )}
          </Button>
        )
      }
    </div>
  );
};

export default FundingSources;
