import React from 'react';
import classNames from 'classnames';
import ReactModal from 'react-modal';
import './index.scss';
import Button from 'components/shared/Button';

const TimeoutModal = () => {
  const overlayClassName = classNames('easi-timeout-modal__overlay');
  const contentClassName = classNames('easi-timeout-modal__content');

  return (
    <div className="timeout-modal">
      <ReactModal
        isOpen
        overlayClassName={overlayClassName}
        className={contentClassName}
      >
        <div className="easi-timeout-modal__header">
          <div className="easi-timeout-modal__title">EASi</div>
          <button type="button" className="easi-timeout-modal__x-button">
            <i className="fa fa-times" />
          </button>
        </div>
        <div className="easi-timeout-modal__body">
          <h1>Your access to EASi is about to expire in 5 minutes</h1>
          <p>Your data has already been saved.</p>
          <p>
            If you do not do anything on this page you will be signed out in 5
            minutes and will need to sign back in. We do this to keep your
            information secure.
          </p>
          <Button type="button">Return to EASi</Button>
        </div>
      </ReactModal>
    </div>
  );
};

export default TimeoutModal;
