import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonGroup,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';

const FundingSourcesModal = () => {
  const { t } = useTranslation('intake');
  return (
    <Modal isOpen closeModal={() => {}} className="font-body-md">
      <ModalHeading className="margin-bottom-0">
        {t('contractDetails.fundingSources.addFundingSource')}
      </ModalHeading>

      <RequiredFieldsText className="margin-y-0" />

      <ModalFooter>
        <ButtonGroup>
          <Button type="button" onClick={() => {}} className="margin-right-2">
            {t('contractDetails.fundingSources.modalSubmit')}
          </Button>
          <Button
            type="button"
            onClick={() => {}}
            unstyled
            className="text-error"
          >
            {t('Cancel')}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};

export default FundingSourcesModal;
