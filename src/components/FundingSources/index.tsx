import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import CheckboxField from 'components/CheckboxField';
import { useEasiFormContext } from 'components/EasiForm';
import { ContractDetailsForm } from 'types/systemIntake';

import FundingSourcesModal from './FundingSourcesModal';

/** Funding sources component for system intake form */
const FundingSources = () => {
  const { t } = useTranslation('fundingSources');

  const [isFundingSourcesModalOpen, setIsFundingSourcesModalOpen] =
    useState(false);

  const { control, watch } = useEasiFormContext<ContractDetailsForm>();

  const arrayfield = useFieldArray({
    control,
    name: 'fundingSources'
  });

  const { fields, append, remove } = arrayfield;

  const skipFundingSources = watch('skipFundingSources');

  /** Remove all funding sources if checkbox is checked */
  useEffect(() => {
    if (skipFundingSources) {
      remove();
    }
  }, [skipFundingSources, remove]);

  return (
    <div id="intakeFundingSources">
      <FundingSourcesModal
        isOpen={isFundingSourcesModalOpen}
        closeModal={() => setIsFundingSourcesModalOpen(false)}
        addFundingSource={fundingSource => append(fundingSource)}
        initialFundingSources={fields}
      />

      {fields.map((source, index) => {
        const { projectNumber, investments } = source;

        // Display funding source
        return (
          <div
            id={`fundingSource-${index}`}
            // eslint-disable-next-line react/no-array-index-key
            key={`fundingSource-${index}`}
            className="margin-top-205"
          >
            <p className="text-bold font-body-sm margin-bottom-0">
              {t('investment')}
            </p>
            <p className="margin-y-05">
              {t('projectNumberLabel', {
                projectNumber
              })}
            </p>
            <p className="margin-y-05">
              {t('investmentsLabel', {
                investments: investments.join(', ')
              })}
            </p>

            <Button
              unstyled
              onClick={() => remove(index)}
              type="button"
              className="text-error margin-top-1"
            >
              {t('Delete')}
            </Button>
          </div>
        );
      })}

      <Button
        type="button"
        onClick={() => setIsFundingSourcesModalOpen(true)}
        disabled={skipFundingSources}
        className="margin-top-2"
        data-testid="fundingSourcesAction-add"
        outline
      >
        {t('addFundingSource', { count: fields.length + 1 })}
      </Button>

      <Controller
        control={control}
        name="skipFundingSources"
        render={({ field: { ref, ...field } }) => {
          return (
            <CheckboxField
              {...field}
              id={field.name}
              value="true"
              onChange={e => field.onChange(e.target.checked)}
              label={t('clearFundingSourcesCheckbox')}
            />
          );
        }}
      />
    </div>
  );
};

export default FundingSources;
