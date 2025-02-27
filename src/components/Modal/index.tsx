import React, { ReactNode, ReactNodeArray } from 'react';
import ReactModal from 'react-modal';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import noScroll from 'no-scroll';

import './index.scss';

export type ModalProps = {
  overlayClassName?: string;
  className?: string;
  alignment?: 'right' | 'left';
  title?: string;
  children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  openModal?: () => void;
  closeModal: () => void;
  shouldCloseOnOverlayClick?: boolean;
  noScrollOnClose?: boolean;
};

const Modal = ({
  overlayClassName,
  className,
  alignment,
  title,
  children,
  isOpen,
  openModal,
  closeModal,
  shouldCloseOnOverlayClick = false,
  noScrollOnClose
}: ModalProps) => {
  const handleOpenModal = () => {
    if (!noScrollOnClose) noScroll.on();

    if (openModal) {
      openModal();
    }
  };

  const root = document.getElementById('root');

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName={classNames(
        'easi-modal__overlay',
        {
          'easi-modal__has-title': !!title
        },
        overlayClassName
      )}
      className={classNames(className, 'easi-modal__content outline-0', {
        [`easi-modal__align-${alignment}`]: !!alignment,
        'radius-md': !alignment
      })}
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      appElement={root!}
      // Fix for "App element is not defined" unit test error
      ariaHideApp={root ? undefined : false}
    >
      <button
        type="button"
        className="usa-button usa-modal__close margin-top-0"
        aria-label="Close Modal"
        onClick={closeModal}
      >
        <Icon.Close size={4} />
        {title && <h4 className="text-base margin-0 margin-left-1">{title}</h4>}
      </button>
      <div className="easi-modal__body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
