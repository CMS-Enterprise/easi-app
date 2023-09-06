import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';

const Resolutions = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('action');

  return (
    <div className="margin-bottom-10 padding-bottom-2">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/' },
          {
            text: t('resolutions.requestDetails'),
            url: `/governance-review-team/${systemIntakeId}/intake-request`
          },
          // TODO: Dynamic breadcrumb
          { text: 'Issue decision or close request' }
        ]}
      />

      <PageHeading className="margin-bottom-0">
        {
          // TODO: Dynamic title
          t('resolutions.title', { context: 'NO_DECISION' })
        }
      </PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {
          // TODO: Dynamic description
          t('resolutions.description', { context: 'NO_DECISION' })
        }
      </p>

      <p className="margin-top-1 text-base">
        <Trans
          i18nKey="action:fieldsMarkedRequired"
          components={{ asterisk: <RequiredAsterisk /> }}
        />
      </p>
    </div>
  );
};

export default Resolutions;
