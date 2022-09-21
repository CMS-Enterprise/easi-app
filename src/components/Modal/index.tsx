import React, { ReactNode, ReactNodeArray } from 'react';
import ReactModal from 'react-modal';
import { IconClose } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

type ModalProps = {
  title?: string;
  children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  openModal?: () => void;
  closeModal: () => void;
  shouldCloseOnOverlayClick?: boolean;
};

const Modal = ({
  title,
  children,
  isOpen,
  openModal,
  closeModal,
  shouldCloseOnOverlayClick = false
}: ModalProps) => {
  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName={classNames('easi-modal__overlay', {
        'easi-modal__has-title': !!title
      })}
      className="easi-modal__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      appElement={document.getElementById('root')!}
    >
      <button
        type="button"
        className="easi-modal__x-button"
        aria-label="Close Modal"
        onClick={closeModal}
      >
        <IconClose size={3} />
        <h4 className="text-base margin-0 margin-left-1">{title}</h4>
      </button>
      <div className="easi-modal__body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
