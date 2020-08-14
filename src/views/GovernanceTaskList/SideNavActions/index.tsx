import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as UswdsLink, Button } from '@trussworks/react-uswds';

import './index.scss';
import Modal from 'components/Modal';
import { useTranslation } from 'react-i18next';

type SideNavActionsProps = {
  archiveIntake: () => void;
};

const SideNavActions = ({ archiveIntake }: SideNavActionsProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
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
          closeModal={() => setModalOpen(false)}
        >
          <h1 className="margin-top-0 font-heading-2xl line-height-heading-2">
            {t('taskList:withdraw_modal:header')}
          </h1>
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
