import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import SystemProfile from 'views/SystemProfile';

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
