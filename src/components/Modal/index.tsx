import React, { ReactNode, ReactNodeArray } from 'react';
import ReactModal from 'react-modal';
import noScroll from 'no-scroll';

import './index.scss';

type ModalProps = {
  children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  openModal?: () => void;
  closeModal: () => void;
};

const Modal = ({ children, isOpen, openModal, closeModal }: ModalProps) => {
  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="easi-modal__overlay"
      className="easi-modal__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById('root')!}
    >
      <button
        type="button"
        className="easi-modal__x-button"
        aria-label="Close Modal"
        onClick={closeModal}
      >
        <i className="fa fa-times" />
      </button>
      <div className="easi-modal__body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
