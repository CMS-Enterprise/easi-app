import React, { ReactNode, ReactNodeArray } from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import './index.scss';

type ModalProps = {
  title: string;
  children: ReactNode | ReactNodeArray;
};

const Modal = ({ title, children }: ModalProps) => {
  const overlayClassName = classNames('easi-modal__overlay');
  const contentClassName = classNames('easi-modal__content');

  return (
    <ReactModal
      isOpen
      overlayClassName={overlayClassName}
      className={contentClassName}
    >
      <div className="easi-modal__header">
        <div className="easi-modal__title">{title}</div>
        <button type="button" className="easi-modal__x-button">
          <i className="fa fa-times" />
        </button>
      </div>
      <div className="easi-modal__body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
