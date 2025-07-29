import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import { useEasiFormContext } from 'components/EasiForm';
import { ContractDetailsForm } from 'types/systemIntake';

import FundingSourcesModal from './FundingSourcesModal';

/** Funding sources component for system intake form */
const FundingSources = () => {
  const { t } = useTranslation('intake');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { control } = useEasiFormContext<ContractDetailsForm>();

  const arrayfield = useFieldArray({
    control,
    name: 'fundingSources'
  });

  const { fields, append, remove } = arrayfield;

  return (
    <div id="intakeFundingSources">
      <FundingSourcesModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        addFundingSource={fundingSource => append(fundingSource)}
      />

      {fields.map((source, index) => {
        const { projectNumber, investments, id } = source;

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
        data-testid="fundingSourcesAction-add"
        type="button"
        onClick={() => setIsModalOpen(true)}
        outline
      >
        {t(
          `contractDetails.fundingSources.${
            fields.length > 0 ? 'addAnotherFundingSource' : 'addFundingSource'
          }`
        )}
      </Button>
    </div>
  );
};

export default FundingSources;
