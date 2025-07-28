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

import FundingSourcesModal from './FundingSourcesModal';
import {
  formatFundingSourcesForApi,
  formatFundingSourcesForApp
} from './utils';

/** Funding source formatted for app */
export type FormattedFundingSource = {
  __typename: 'SystemIntakeFundingSource';
  id: string;
  projectNumber: string | null;
  investments: string[];
};

type FundingSourcesForm = {
  fundingSources: Omit<FormattedFundingSource, 'id'>[];
};

type FundingSourcesProps = {
  /** Function to disable submit on parent form when add/edit form is open */
  disableParentForm?: React.Dispatch<React.SetStateAction<boolean>>;
};

/** Funding sources component for system intake form */
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
      <FundingSourcesModal />

      {fields.map((source, index) => {
        const { projectNumber, investments, id } = source;

        // Show form if adding or editing funding source
        if (id === activeFundingSource?.id) {
          return (
            <Fieldset
              key={id}
              id={`fundingSources.${index}.projectNumber`}
              className="margin-top-3"
            >
              <legend className="usa-legend text-bold">
                {t('contractDetails.fundingSources.formLegend', {
                  action
                })}
              </legend>
              <FieldGroup
                className="margin-top-2"
                error={!!errors?.fundingSources?.[index]?.projectNumber}
              >
                <Label htmlFor="projectNumber" className="text-normal">
                  {t('contractDetails.fundingSources.projectNumber')}
                </Label>
                <HelpText id="projectNumberHelpText">
                  {t('contractDetails.fundingSources.projectNumberHelpText')}
                </HelpText>
                <ErrorMessage
                  errors={errors}
                  name={`fundingSources.${index}.projectNumber`}
                  as={FieldErrorMsg}
                />
                <TextInput
                  {...register(`fundingSources.${index}.projectNumber`)}
                  ref={null}
                  type="text"
                  id="projectNumber"
                  aria-describedby="projectNumberHelptext projectNumberHelpLink"
                />

                <HelpText id="projectNumberHelpLink" className="margin-top-1">
                  <Link
                    href="https://cmsintranet.share.cms.gov/JT/Pages/Budget.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {t('contractDetails.fundingSources.projectNumberLink')}
                  </Link>
                </HelpText>
              </FieldGroup>

              <FieldGroup
                error={!!errors?.fundingSources?.[index]?.investments}
              >
                <Label htmlFor="sources" className="text-normal">
                  {t('contractDetails.fundingSources.investment')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name={`fundingSources.${index}.investments`}
                  as={FieldErrorMsg}
                />
                <Controller
                  name={`fundingSources.${index}.investments`}
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <MultiSelect
                      {...field}
                      id="sources"
                      selectedLabel={t(
                        'contractDetails.fundingSources.selectedInvestments'
                      )}
                      options={intakeFundingSources.map(option => ({
                        value: option,
                        label: t(option)
                      }))}
                      onChange={values => field.onChange(values)}
                      initialValues={activeFundingSource.investments}
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
            id={`fundingSource${projectNumber}`}
            key={id}
            className="margin-top-205"
          >
            <p className="text-bold font-body-sm margin-bottom-0">
              {t('contractDetails.fundingSources.investment')}
            </p>
            <p className="margin-y-05">
              {t('contractDetails.fundingSources.projectNumberLabel', {
                projectNumber
              })}
            </p>
            <p className="margin-y-05">
              {t('contractDetails.fundingSources.investmentsLabel', {
                investments: investments.join(', ')
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
              const newSource: Omit<FormattedFundingSource, 'id'> = {
                __typename: 'SystemIntakeFundingSource',
                projectNumber: '',
                investments: []
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
