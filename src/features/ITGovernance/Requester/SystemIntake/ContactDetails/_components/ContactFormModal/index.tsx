import React from 'react';
import { useTranslation } from 'react-i18next';
import { Fieldset, ModalHeading } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import { ContactFormFields } from 'types/systemIntake';

import ContactForm from '../ContactForm';

type ContactFormModalProps = {
  systemIntakeId: string;
  type: 'contact' | 'recipient';
  closeModal: () => void;
  isOpen: boolean;
  initialValues?: ContactFormFields | null;
  createContactCallback?: (contact: ContactFormFields) => void;
};

const ContactFormModal = ({
  systemIntakeId,
  type,
  closeModal,
  isOpen,
  initialValues,
  createContactCallback
}: ContactFormModalProps) => {
  const { t } = useTranslation('intake');

  const action: 'add' | 'edit' = initialValues?.id ? 'edit' : 'add';

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      className="font-body-md maxw-mobile-lg"
    >
      <Fieldset>
        <legend>
          <ModalHeading className="margin-bottom-0">
            {t(`contactDetails.additionalContacts.${action}`, { type })}
          </ModalHeading>
        </legend>
        <ContactForm
          systemIntakeId={systemIntakeId}
          type={type}
          initialValues={initialValues}
          createContactCallback={createContactCallback}
          copyVariant="additionalContacts"
          showExternalRecipientAlert
          onCancel={closeModal}
          onSuccess={() => closeModal()}
        />
      </Fieldset>
    </Modal>
  );
};

export default ContactFormModal;
