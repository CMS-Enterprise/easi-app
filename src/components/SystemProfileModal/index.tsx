import React from 'react';
import { useTranslation } from 'react-i18next';
import SystemProfile from 'features/Systems/SystemProfile';

import Modal from 'components/Modal';

import './index.scss';

type ModalProps = {
  id: string;
  isOpen: boolean;
  closeModal: () => void;
};

export default function SystemProfileModal({
  id,
  isOpen,
  closeModal
}: ModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      overlayClassName="easi-modal_system-profile"
      alignment="right"
      title={t('System Profile')}
      isOpen={isOpen}
      closeModal={closeModal}
      shouldCloseOnOverlayClick
    >
      <SystemProfile id={id} modal />
    </Modal>
  );
}
