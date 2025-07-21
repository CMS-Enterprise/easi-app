import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import Modal, { ModalProps } from 'components/Modal';

import './index.scss';

type RemoveInsightModalProps = {
  modalProps: Omit<ModalProps, 'children'>;
  handleDelete: () => void;
  children?: React.ReactNode;
};

/**
 * Modal to warn user before removing TRB guidance letter insight
 */
const RemoveInsightModal = ({
  modalProps,
  handleDelete,
  children
}: RemoveInsightModalProps) => {
  const { t } = useTranslation('technicalAssistance');
  const { closeModal } = modalProps;

  return (
    <Modal
      {...modalProps}
      noScrollOnClose
      className="easi-modal__remove-insight"
    >
      <h3 className="margin-y-0 line-height-heading-2">
        {t('guidanceLetterForm.modal.title')}
      </h3>

      <p>{t('guidanceLetterForm.modal.text')}</p>

      {children}

      <ButtonGroup>
        <Button
          type="button"
          onClick={() => {
            handleDelete();
            closeModal();
          }}
        >
          {t('guidanceLetterForm.removeGuidance')}
        </Button>

        <Button
          type="button"
          className="margin-left-2"
          onClick={() => closeModal()}
          unstyled
        >
          {t('button.cancel')}
        </Button>
      </ButtonGroup>
    </Modal>
  );
};

export default RemoveInsightModal;
