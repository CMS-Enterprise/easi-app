import React from 'react';
import { useTranslation } from 'react-i18next';
import { SystemIntakeFragmentFragment } from 'gql/generated/graphql';

import PageHeading from 'components/PageHeading';

const AddPointOfContact = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation('requestHome');
  return (
    <div id="add-poc">
      <div>
        <PageHeading className="margin-top-0 margin-bottom-1">
          {t('addPOC.title')}
        </PageHeading>
        <p className="easi-body-medium margin-y-0">{t('addPOC.description')}</p>
      </div>
    </div>
  );
};

export default AddPointOfContact;
