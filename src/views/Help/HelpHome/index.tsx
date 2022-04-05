import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';

import './index.scss';

const HelpHome = () => {
  const { t } = useTranslation('help');

  type ContactProps = {
    key: string;
    title: string;
    copy: string;
    email: string;
  };

  const contacts: ContactProps[] = t('additionalContacts.contacts', {
    returnObjects: true
  });

  return (
    <div className="help-home">
      <PageHeading>{t('heading')}</PageHeading>
      <p className="font-body-lg">{t('subheading')}</p>
      Card stuff here
      <hr className="help-home__hr margin-y-6" />
      <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-1">
        {t('additionalContacts.heading')}
      </PageHeading>
      <p className="margin-bottom-4">{t('additionalContacts.subheading')}</p>
      <div className="grid-row grid-gap-lg">
        {contacts.map(({ key, title, copy, email }) => (
          <div key={key} className="tablet:grid-col-4 padding-bottom-4">
            <PageHeading
              headingLevel="h3"
              className="margin-top-0 margin-bottom-1"
            >
              {title}
            </PageHeading>
            <p className="margin-top-0 margin-bottom-2 line-height-body-4">
              {copy}
            </p>
            <PageHeading
              headingLevel="h4"
              className="margin-top-0 margin-bottom-05"
            >
              Email addresses
            </PageHeading>
            <UswdsLink href={`mailto:${email}`} className="margin-top-0">
              {email}
            </UswdsLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpHome;
