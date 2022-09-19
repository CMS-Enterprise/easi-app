import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import SystemProfile from 'views/SystemProfile';

import './index.scss';

export default function SystemProfileModal({ id }: { id: string }) {
  const [modalOpen, setModalOpen] = useState(true);
  const { t } = useTranslation();
  return (
    <Modal
      title={t('System Profile')}
      isOpen={modalOpen}
      closeModal={() => setModalOpen(!modalOpen)}
    >
      <SystemProfile id={id} modal />
    </Modal>
  );
}
