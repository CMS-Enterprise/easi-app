import React, { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Label,
  ModalFooter,
  ModalHeading,
  TextInput
} from '@trussworks/react-uswds';

import { useEasiForm } from 'components/EasiForm';
import ExternalLinkAndModal from 'components/ExternalLinkAndModal';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import MultiSelect from 'components/MultiSelect';
import RequiredFieldsText from 'components/RequiredFieldsText';
import intakeFundingSources from 'constants/enums/intakeFundingSources';
import { FormattedFundingSource } from 'types/systemIntake';
import FundingSourceValidationSchema from 'validations/fundingSources';

type FundingSourcesModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  addFundingSource: (data: FormattedFundingSource) => void;
  initialFundingSources: FormattedFundingSource[];
};

/**
 * Modal that contains the form for adding a funding source to a system intake
 */
const FundingSourceFormModal = ({
  isOpen,
  closeModal,
  addFundingSource,
  initialFundingSources
}: FundingSourcesModalProps) => {
  const { t } = useTranslation('fundingSources');

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors }
  } = useEasiForm<FormattedFundingSource>({
    defaultValues: {
      projectNumber: '',
      investments: []
    },
    reValidateMode: 'onSubmit',
    resolver: yupResolver(FundingSourceValidationSchema),
    // Pass initial project numbers as context to resolver to validate uniqueness
    context: {
      initialProjectNumbers: initialFundingSources.map(
        source => source.projectNumber
      )
    }
  });

  const submitForm = handleSubmit(data => {
    addFundingSource(data);
    closeModal();
  });

  const projectNumber = watch('projectNumber');
  const investments = watch('investments');

  /** Disable form submit if required fields are blank */
  const disableSubmit = useMemo(() => {
    return !projectNumber || investments.length === 0;
  }, [projectNumber, investments]);

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
            {t('addFundingSource')}
          </ModalHeading>
        </legend>

        <RequiredFieldsText className="margin-y-0" />

        <FieldGroup className="margin-top-2" error={!!errors?.projectNumber}>
          <Label htmlFor="projectNumber" className="text-normal" requiredMarker>
            {t('projectNumber')}
          </Label>
          <HelpText id="projectNumberHelpText">
            {t('form.projectNumberHelpText')}
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
            data-testid="projectNumberInput"
            className="maxw-none margin-bottom-1"
            aria-describedby="projectNumberHelptext projectNumberHelpLink"
          />

          <ExternalLinkAndModal href="https://cmsintranet.share.cms.gov/JT/Pages/Budget.aspx">
            <span id="projectNumberHelpLink">
              {t('form.projectNumberLink')}
            </span>
          </ExternalLinkAndModal>
        </FieldGroup>

        <FieldGroup error={!!errors?.investments}>
          <Label htmlFor="investments" className="text-normal" requiredMarker>
            {t('investment')}
          </Label>
          <ErrorMessage errors={errors} name="investments" as={FieldErrorMsg} />
          <Controller
            name="investments"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <MultiSelect
                {...field}
                id="investments"
                data-testid="investmentsInput"
                selectedLabel={t('form.selectedInvestments')}
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
              disabled={disableSubmit}
              data-testid="submitFundingSourceButton"
            >
              {t('form.addFundingSource')}
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

export default FundingSourceFormModal;
