import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import ExternalLink from '../ExternalLink';

const ExternalLinkAndModal = ({
  children,
  href
}: {
  children: React.ReactNode;
  href: string;
}) => {
  const { t: externalT } = useTranslation('externalLinkModal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* MODAL TO GO HERE */}
      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick
        closeModal={() => setIsModalOpen(false)}
        className="external-link-modal maxw-mobile-lg height-auto"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-3 margin-bottom-2"
        >
          {externalT('heading')}
        </PageHeading>

        <p
          className="font-body-md line-height-sans-4 margin-top-0 margin-bottom-4"
          style={{ whiteSpace: 'break-spaces' }}
        >
          {toEchimp ? externalT('descriptionEchimp') : externalT('description')}
        </p>

        {/* <Link
          href={href}
          aria-label={
            toEchimp ? externalT('continueEchimp') : externalT('continueButton')
          }
          target="_blank"
          rel="noopener noreferrer"
          className="usa-button text-white text-no-underline"
          onClick={() => setIsModalOpen(false)}
          variant={variant}
        >
          {toEchimp ? externalT('continueEchimp') : externalT('leave')}
        </Link> */}

        <ExternalLink href={href}>{children}</ExternalLink>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          {externalT('return')}
        </Button>
      </Modal>
    </>
  );
};

export default ExternalLinkAndModal;
