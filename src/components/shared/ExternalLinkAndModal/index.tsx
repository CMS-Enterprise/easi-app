import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import ExternalLink from '../ExternalLink';

export type ExternalModalType = 'CFACTS' | 'CLOUD' | 'GENERIC';

const ExternalLinkAndModal = ({
  children,
  href,
  buttonType = 'unstyled',
  modalType = 'GENERIC'
}: {
  children: React.ReactNode;
  href: string;
  buttonType?: 'outline' | 'unstyled';
  modalType?: ExternalModalType;
}) => {
  const { t: externalT } = useTranslation('externalLinkModal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderDescription = () => {
    const description = {
      CFACTS: externalT('description.cfacts'),
      CLOUD: externalT('description.cloud'),
      GENERIC: externalT('description.generic')
    };
    return description[modalType];
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick
        closeModal={() => setIsModalOpen(false)}
        className="external-link-modal maxw-mobile-lg height-auto"
      >
        <PageHeading headingLevel="h3" className="margin-top-0 margin-bottom-2">
          {externalT('genericHeading')}
        </PageHeading>

        <p
          className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-2"
          style={{ whiteSpace: 'break-spaces' }}
        >
          {renderDescription()}
        </p>

        {/* Render contact info if modal type is generic */}
        {modalType === 'GENERIC' && (
          <p
            className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-3"
            style={{ whiteSpace: 'break-spaces' }}
          >
            <Trans
              t={externalT}
              i18nKey="description.contactInfo"
              components={{
                span: <span className="text-no-wrap" />
              }}
            />
          </p>
        )}

        <ExternalLink
          href={href}
          className="usa-button text-white text-no-underline"
          variant="unstyled"
        >
          {modalType !== 'GENERIC'
            ? externalT('continueButton', {
                value: externalT(`modalTypes.${modalType}`)
              })
            : externalT('leaveEasi')}
        </ExternalLink>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          {externalT('goBackToEasi')}
        </Button>
      </Modal>
      <Button
        type="button"
        unstyled={buttonType === 'unstyled'}
        outline={buttonType === 'outline'}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <span
          className="display-flex flex-align-center"
          style={{ columnGap: '0.25rem' }}
        >
          {children}
          {buttonType === 'unstyled' && <Icon.Launch />}
        </span>
      </Button>
    </>
  );
};

export default ExternalLinkAndModal;
