import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import { useSendSystemIntakeGRBReviewerReminderMutation } from 'gql/generated/graphql';

import Modal from 'components/Modal';
import useMessage from 'hooks/useMessage';

const SendReviewReminder = ({
  isOpen,
  setIsModalOpen,
  systemIntakeId,
  setReminderSent
}: {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  systemIntakeId: string;
  setReminderSent: (reminderSent: string) => void;
}) => {
  const { t } = useTranslation('grbReview');
  const { errorMessageInModal, showErrorMessageInModal } = useMessage();

  const [sendReminder] = useSendSystemIntakeGRBReviewerReminderMutation({
    variables: {
      systemIntakeID: systemIntakeId
    }
  });

  // NOTES FOR FUTURE GARY:
  // 2. Display timeSent in AdminAction component

  const handleSendReminder = () => {
    if (!systemIntakeId) return;

    sendReminder()
      .then(response => {
        setReminderSent(
          response.data?.sendSystemIntakeGRBReviewerReminder?.timeSent || ''
        );
        setIsModalOpen(false);
      })
      .catch(() => {
        showErrorMessageInModal(t('adminTask.sendReviewReminder.modal.error'));
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      closeModal={() => setIsModalOpen(false)}
      className="easi-modal__content--narrow"
    >
      <div data-testid="send-review-reminder-modal">
        <ModalHeading>
          {t('adminTask.sendReviewReminder.modal.title')}
        </ModalHeading>
        {errorMessageInModal && (
          <Alert type="error" className="margin-top-2" headingLevel="h4">
            {errorMessageInModal}
          </Alert>
        )}
        <p className="margin-top-1">
          {t('adminTask.sendReviewReminder.modal.description')}
        </p>
        <ModalFooter>
          <Button
            type="button"
            className="margin-top-0 margin-bottom-2 margin-right-3 tablet:margin-bottom-0"
            onClick={handleSendReminder}
          >
            {t('adminTask.sendReviewReminder.modal.sendReminder')}
          </Button>
          <Button type="button" onClick={() => setIsModalOpen(false)} unstyled>
            {t('adminTask.sendReviewReminder.modal.cancel')}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default SendReviewReminder;
