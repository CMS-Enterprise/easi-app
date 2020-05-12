import React, { ReactNode, ReactNodeArray } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import noScroll from 'no-scroll';
import './index.scss';

type ModalProps = {
  title: string;
  children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  closeModal: () => void;
};

const Modal = ({ title, children, isOpen, closeModal }: ModalProps) => {
  const overlayClassName = classNames('easi-modal__overlay');
  const contentClassName = classNames('easi-modal__content');

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName={overlayClassName}
      className={contentClassName}
      onAfterOpen={noScroll.on}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
    >
      <div className="easi-modal__header">
        <div className="easi-modal__title">{title}</div>
        <button
          type="button"
          className="easi-modal__x-button"
          onClick={closeModal}
        >
          <i className="fa fa-times" />
        </button>
      </div>
      <div className="easi-modal__body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
