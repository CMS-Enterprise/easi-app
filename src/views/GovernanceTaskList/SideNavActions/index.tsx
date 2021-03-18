import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';

import Modal from 'components/Modal';

import './index.scss';

type SideNavActionsProps = {
  archiveIntake: () => void;
};

const SideNavActions = ({ archiveIntake }: SideNavActionsProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const modalHeadingRef = useRef<HTMLHeadingElement>(null);

  const handleWithdrawModalOpen = () => {
    modalHeadingRef.current?.focus();
  };

  return (
    <div className="sidenav-actions grid-row flex-column">
      <div className="grid-col margin-top-105">
        <Link to="/">Save & Exit</Link>
      </div>
      <div className="grid-col margin-top-2">
        <Button
          className="line-height-body-5 test-withdraw-request"
          type="button"
          unstyled
          onClick={() => setModalOpen(true)}
        >
          Remove your request to add a new system
        </Button>
        <Modal
          title={t('taskList:withdraw_modal:title')}
          isOpen={isModalOpen}
          openModal={handleWithdrawModalOpen}
          closeModal={() => setModalOpen(false)}
        >
          <h2
            className="margin-top-0 font-heading-2xl line-height-heading-2"
            tabIndex={-1}
            ref={modalHeadingRef}
          >
            {t('taskList:withdraw_modal:header')}
          </h2>
          <p>{t('taskList:withdraw_modal:warning')}</p>
          <Button
            type="button"
            className="margin-right-4"
            onClick={archiveIntake}
          >
            {t('taskList:withdraw_modal:confirm')}
          </Button>
          <Button type="button" unstyled onClick={() => setModalOpen(false)}>
            {t('taskList:withdraw_modal:cancel')}
          </Button>
        </Modal>
      </div>
      <div className="grid-col margin-top-5">
        <h4>Related Content</h4>
        <UswdsLink
          aria-label="Open overview for adding a system in a new tab"
          className="line-height-body-5"
          href="/governance-overview"
          variant="external"
          target="_blank"
        >
          Overview for adding a system
          <span aria-hidden>&nbsp;(opens in a new tab)</span>
        </UswdsLink>
      </div>
    </div>
  );
};

export default SideNavActions;
