import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Icon } from '@trussworks/react-uswds';
import ContactForm from 'features/ITGovernance/Requester/SystemIntake/ContactDetails/_components/ContactForm';
import {
  SystemIntakeContactFragment,
  SystemIntakeFragmentFragment
} from 'gql/generated/graphql';

import IconLink from 'components/IconLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequiredFieldsText from 'components/RequiredFieldsText';

const AddOrEditPointOfContact = ({
  systemIntake,
  type
}: {
  systemIntake: SystemIntakeFragmentFragment;
  type: 'add' | 'edit';
}) => {
  const { t } = useTranslation('requestHome');
  const location = useLocation<{ contact?: SystemIntakeContactFragment }>();
  // Extract the contact from navigation state
  const contactToEdit = location.state?.contact;

  // Transform SystemIntakeContactFragment to ContactFormFields format
  const transformedContactToEdit = contactToEdit
    ? {
        id: contactToEdit.id,
        userAccount: {
          username: contactToEdit.userAccount.username,
          commonName: contactToEdit.userAccount.commonName,
          email: contactToEdit.userAccount.email
        },
        component: contactToEdit.component,
        roles: contactToEdit.roles,
        isRequester: contactToEdit.isRequester
      }
    : null;

  const isAddingPOC = type === 'add';

  return (
    <MainContent data-testid="add-poc" className="margin-top-6">
      <div className="grid-col-8">
        <PageHeading className="margin-top-0 margin-bottom-1">
          {isAddingPOC ? t('addPOC.title') : t('editPOC.title')}
        </PageHeading>
        <p className="easi-body-medium margin-y-0">
          {isAddingPOC ? t('addPOC.description') : t('editPOC.description')}
        </p>
        <RequiredFieldsText />
        <IconLink
          to="request-home"
          icon={<Icon.ArrowBack aria-hidden />}
          className="margin-bottom-5"
        >
          {t('addPOC.dontAddAndReturn')}
        </IconLink>
      </div>
      <div className="grid-col-6">
        <ContactForm
          type="contact"
          systemIntakeId={systemIntake.id}
          // isOpen={isContactsModalOpen}
          // closeModal={() => console.log('gary it is working')}
          initialValues={isAddingPOC ? null : transformedContactToEdit}
        />
        <IconLink
          to="request-home"
          icon={<Icon.ArrowBack aria-hidden />}
          className="margin-top-2 margin-bottom-5"
        >
          {t('addPOC.dontAddAndReturn')}
        </IconLink>
      </div>
    </MainContent>
  );
};

export default AddOrEditPointOfContact;
