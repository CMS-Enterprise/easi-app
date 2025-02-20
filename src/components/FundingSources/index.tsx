import React, { useEffect, useState } from 'react';
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
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import MultiSelect from 'components/MultiSelect';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import { FundingSource } from 'types/systemIntake';
import { FundingSourcesValidationSchema } from 'validations/systemIntakeSchema';

import {
  formatFundingSourcesForApi,
  formatFundingSourcesForApp
} from './utils';

/** Funding source formatted for app */
export type FormattedFundingSource = {
  id: string;
  fundingNumber: string | null;
  sources: string[];
};

type FundingSourcesForm = {
  fundingSources: Omit<FormattedFundingSource, 'id'>[];
};

type FundingSourcesProps = {
  /** Function to disable submit on parent form when add/edit form is open */
  disableParentForm?: React.Dispatch<React.SetStateAction<boolean>>;
};

/** Funding sources component for system intake form */

// TODO: Refactor to work with both system intake and TRB forms
const FundingSources = ({ disableParentForm }: FundingSourcesProps) => {
  const { t } = useTranslation('intake');

  const [activeFundingSource, setActiveFundingSource] =
    useState<FormattedFundingSource | null>(null);

  const [action, setAction] = useState<'Add' | 'Edit' | null>(null);

  const intakeForm = useEasiFormContext<{
    fundingSources: FundingSource[];
  }>();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors }
  } = useEasiForm<FundingSourcesForm>({
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

  /** Update parent form funding sources and reset active funding source */
  const submit = (
    /** Index of the funding source being added or edited */
    index: number
  ) =>
    handleSubmit(values => {
      update(index, values.fundingSources[index]);

      const fundingSourcesWithIds = values.fundingSources.map((source, i) => ({
        ...source,
        id: fields[i].id
      }));

      intakeForm.setValue(
        'fundingSources',
        formatFundingSourcesForApi(fundingSourcesWithIds)
      );

      setActiveFundingSource(null);
      setAction(null);
    })();

  // For new funding sources, set correct ID
  useEffect(() => {
    if (fields.length > 0 && activeFundingSource?.id === '') {
      setActiveFundingSource(fields[fields.length - 1]);
    }
  }, [fields, activeFundingSource, setActiveFundingSource]);

  /** Disable parent form while adding/editing funding source */
  useEffect(() => {
    // Check if `disableParentForm` prop was provided
    if (disableParentForm) {
      disableParentForm(!!activeFundingSource);
    }
  }, [activeFundingSource, disableParentForm]);

  return (
    <div id="intakeFundingSources">
      {fields.map((source, index) => {
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
                <Label htmlFor="fundingNumber" className="text-normal">
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

                    // reset form
                    setActiveFundingSource(null);
                    setAction(null);
                  }}
                >
                  {t('Cancel')}
                </Button>

                <Button
                  type="button"
                  onClick={() => submit(index)}
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
                  setAction('Edit');
                }}
                type="button"
                className="margin-top-1"
              >
                {t('Edit')}
              </Button>

              <Button
                unstyled
                onClick={() => {
                  remove(index);

                  // Remove from parent form funding sources
                  intakeForm.setValue(
                    'fundingSources',
                    formatFundingSourcesForApi(fields).filter(
                      value => value.id !== id
                    )
                  );
                }}
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
                sources: []
              };

              append(newSource);
              setActiveFundingSource({ ...newSource, id: '' });
              setAction('Add');
            }}
            outline
          >
            {t(
              `contractDetails.fundingSources.${
                fields.length > 0
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
