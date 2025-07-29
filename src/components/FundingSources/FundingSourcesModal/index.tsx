import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Label,
  Link,
  ModalFooter,
  ModalHeading,
  TextInput
} from '@trussworks/react-uswds';

import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import MultiSelect from 'components/MultiSelect';
import RequiredFieldsText from 'components/RequiredFieldsText';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import { FormattedFundingSource } from 'types/systemIntake';
import { FundingSourceValidationSchema } from 'validations/systemIntakeSchema';

type FundingSourcesModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  addFundingSource: (data: FormattedFundingSource) => void;
};

const FundingSourcesModal = ({
  isOpen,
  closeModal,
  addFundingSource
}: FundingSourcesModalProps) => {
  const { t } = useTranslation('intake');

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useEasiForm<FormattedFundingSource>({
    resolver: yupResolver(FundingSourceValidationSchema),
    defaultValues: {
      projectNumber: '',
      investments: []
    }
  });

  const submitForm = handleSubmit(data => {
    addFundingSource(data);
    closeModal();
  });

  // Reset form on modal close
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} className="font-body-md">
      <Fieldset>
        <legend>
          <ModalHeading className="margin-bottom-0">
            {t('contractDetails.fundingSources.addFundingSource')}
          </ModalHeading>
        </legend>

        <RequiredFieldsText className="margin-y-0" />

        <FieldGroup className="margin-top-2" error={!!errors?.projectNumber}>
          <Label htmlFor="projectNumber" className="text-normal" requiredMarker>
            {t('contractDetails.fundingSources.projectNumber')}
          </Label>
          <HelpText id="projectNumberHelpText">
            {t('contractDetails.fundingSources.projectNumberHelpText')}
          </HelpText>
          <ErrorMessage
            errors={errors}
            name="projectNumber"
            as={FieldErrorMsg}
          />
          <TextInput
            {...register(`projectNumber`)}
            type="text"
            id="projectNumber"
            className="maxw-none"
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

        <FieldGroup error={!!errors?.investments}>
          <Label htmlFor="investments" className="text-normal" requiredMarker>
            {t('contractDetails.fundingSources.investment')}
          </Label>
          <ErrorMessage errors={errors} name="investments" as={FieldErrorMsg} />
          <Controller
            name="investments"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <MultiSelect
                {...field}
                id="investments"
                selectedLabel={t(
                  'contractDetails.fundingSources.selectedInvestments'
                )}
                options={intakeFundingSources.map(option => ({
                  value: option,
                  label: t(option)
                }))}
              />
            )}
          />
        </FieldGroup>

        <ModalFooter>
          <ButtonGroup>
            <Button
              type="button"
              onClick={submitForm}
              className="margin-right-2"
            >
              {t('contractDetails.fundingSources.modalSubmit')}
            </Button>
            <Button
              type="button"
              onClick={closeModal}
              unstyled
              className="text-error"
            >
              {t('Cancel')}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Fieldset>
    </Modal>
  );
};

export default FundingSourcesModal;
