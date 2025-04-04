import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalFooter, ModalHeading } from '@trussworks/react-uswds';

import Modal from 'components/Modal';

const SendReviewReminder = ({
  isOpen,
  setIsModalOpen
}: {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { t } = useTranslation('grbReview');

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      closeModal={() => setIsModalOpen(false)}
      className="easi-modal__content--narrow"
    >
      <ModalHeading>
        {t('adminTask.sendReviewReminder.modal.title')}
      </ModalHeading>
      <p className="margin-top-1">
        {t('adminTask.sendReviewReminder.modal.description')}
      </p>
      <ModalFooter>
        <Button
          type="button"
          className="margin-top-0 margin-bottom-2 margin-right-3 tablet:margin-bottom-0 "
        >
          {t('adminTask.sendReviewReminder.modal.sendReminder')}
        </Button>
        <Button type="button" onClick={() => setIsModalOpen(false)} unstyled>
          {t('adminTask.sendReviewReminder.modal.cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SendReviewReminder;
