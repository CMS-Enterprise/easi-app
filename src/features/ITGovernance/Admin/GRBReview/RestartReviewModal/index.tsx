import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import { useMessage } from 'hooks/useMessage';

import { useRestartReviewModal } from './RestartReviewModalContext';

const RestartReviewModal = () => {
  const { t } = useTranslation('grbReview');
  const { isOpen, closeModal } = useRestartReviewModal();

  const { errorMessageInModal } = useMessage();

  const handleRestartReview = () => {
    console.log('restart review');
  };

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      closeModal={closeModal}
      className="easi-modal__content--narrow"
    >
      <div data-testid="restart-review-modal">
        <ModalHeading>{t('adminTask.restartReview.title')}</ModalHeading>
        {errorMessageInModal && (
          <Alert type="error" className="margin-top-2" headingLevel="h4">
            {errorMessageInModal}
          </Alert>
        )}
        <p className="margin-top-1">
          {t('adminTask.restartReview.description')}
        </p>
        <ModalFooter>
          <Button
            type="button"
            className="margin-top-0 margin-bottom-2 margin-right-3 tablet:margin-bottom-0"
            onClick={handleRestartReview}
          >
            {t('adminTask.restartReview.restart')}
          </Button>
          <Button type="button" onClick={closeModal} unstyled>
            {t('adminTask.restartReview.cancel')}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default RestartReviewModal;
