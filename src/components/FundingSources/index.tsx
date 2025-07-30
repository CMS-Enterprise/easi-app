import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import CheckboxField from 'components/CheckboxField';
import { useEasiFormContext } from 'components/EasiForm';
import Modal from 'components/Modal';
import { ContractDetailsForm } from 'types/systemIntake';

import FundingSourceFormModal from './FundingSourceFormModal';

/** Funding sources component for system intake form */
const FundingSources = () => {
  const { t } = useTranslation('fundingSources');

  const [isFundingSourcesModalOpen, setIsFundingSourcesModalOpen] =
    useState(false);

  const [isClearFundingSourcesModalOpen, setIsClearFundingSourcesModalOpen] =
    useState(false);

  const { control, watch, setValue } =
    useEasiFormContext<ContractDetailsForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fundingSources'
  });

  const existingFunding = watch('existingFunding');

  const toggleClearFundingSources = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      if (fields.length > 0) {
        setIsClearFundingSourcesModalOpen(true);
      } else {
        setValue('existingFunding', false);
      }
    } else {
      setValue('existingFunding', true);
    }
  };

  /** Remove all funding sources if checkbox is checked */
  useEffect(() => {
    if (existingFunding === false) {
      remove();
      setIsClearFundingSourcesModalOpen(false);
    }
  }, [existingFunding, remove]);

  return (
    <>
      <FundingSourceFormModal
        isOpen={isFundingSourcesModalOpen}
        closeModal={() => setIsFundingSourcesModalOpen(false)}
        addFundingSource={fundingSource => append(fundingSource)}
        initialFundingSources={fields}
      />

      <div id="intakeFundingSources">
        {fields.map((source, index) => {
          const { projectNumber, investments } = source;

          // Display funding source
          return (
            <div
              id={`fundingSource-${projectNumber}`}
              key={`fundingSource-${projectNumber}`}
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
          disabled={existingFunding === false}
          className="margin-top-2"
          data-testid="addFundingSourceButton"
          outline
        >
          {t('addFundingSource', { count: fields.length + 1 })}
        </Button>

        <Controller
          control={control}
          name="existingFunding"
          render={({ field: { ref, ...field } }) => {
            return (
              <CheckboxField
                {...field}
                id={field.name}
                value="true"
                checked={field.value === false}
                onChange={toggleClearFundingSources}
                label={t('clearFundingSourcesCheckbox')}
                data-testid="clearFundingSourcesCheckbox"
              />
            );
          }}
        />
      </div>

      {/* Clear funding sources modal */}
      <Modal
        isOpen={isClearFundingSourcesModalOpen}
        closeModal={() => setIsClearFundingSourcesModalOpen(false)}
        className="font-body-md"
      >
        <ModalHeading>{t('clearFundingSourcesModal.heading')}</ModalHeading>

        <p>{t('clearFundingSourcesModal.description')}</p>

        <ModalFooter>
          <ButtonGroup>
            <Button
              type="button"
              onClick={() => setValue('existingFunding', false)}
              className="margin-right-2 bg-error"
            >
              {t('clearFundingSourcesModal.removeFundingSources')}
            </Button>
            <Button
              type="button"
              onClick={() => setIsClearFundingSourcesModalOpen(false)}
              unstyled
            >
              {t('clearFundingSourcesModal.dontRemove')}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FundingSources;
