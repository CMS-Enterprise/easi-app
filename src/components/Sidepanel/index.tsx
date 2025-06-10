import React from 'react';
import ReactModal from 'react-modal';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

type SidepanelProps = {
  ariaLabel: string;
  children: React.ReactNode | React.ReactNodeArray;
  classname?: string;
  closeModal: () => void;
  isOpen: boolean;
  modalHeading: string;
  openModal?: () => void;
  testid: string;
};

const Sidepanel = ({
  ariaLabel,
  children,
  classname,
  closeModal,
  isOpen,
  modalHeading,
  openModal,
  testid
}: SidepanelProps) => {
  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="easi-sidepanel__overlay overflow-y-scroll"
      className={classNames('easi-sidepanel__content', classname)}
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick
      contentLabel={ariaLabel}
      appElement={document.getElementById('root')! as HTMLElement}
    >
      <div data-testid={testid}>
        <div className="easi-sidepanel__x-button-container display-flex text-base flex-align-center">
          <button
            type="button"
            data-testid="close-discussions"
            className="easi-sidepanel__x-button margin-right-2"
            aria-label="Close Modal"
            onClick={closeModal}
          >
            <Icon.Close size={4} className="text-base" aria-label="close" />
          </button>
          <h4 className="margin-0">{modalHeading}</h4>
        </div>

        {children}
      </div>
    </ReactModal>
  );
};

export default Sidepanel;
