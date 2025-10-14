import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

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
      </div>
      <div className="grid-col-6">
        <RequiredFieldsText />
      </div>
    </MainContent>
  );
};

export default AddPointOfContact;
