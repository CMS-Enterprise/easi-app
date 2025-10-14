import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import ContactForm from 'features/ITGovernance/Requester/SystemIntake/ContactDetails/_components/ContactForm';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import IconLink from 'components/IconLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequiredFieldsText from 'components/RequiredFieldsText';

const AddPointOfContact = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation('requestHome');
  return (
    <MainContent data-testid="add-poc" className="margin-top-6">
      <div className="grid-col-8">
        <PageHeading className="margin-top-0 margin-bottom-1">
          {t('addPOC.title')}
        </PageHeading>
        <p className="easi-body-medium margin-y-0">{t('addPOC.description')}</p>
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
          initialValues={null}
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

export default AddPointOfContact;
