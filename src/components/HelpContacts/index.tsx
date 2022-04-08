import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as UswdsLink } from '@trussworks/react-uswds';
import classnames from 'classnames';

import { ArticleTypeProps } from 'types/articles';

type HelpContactProps = {
  type: ArticleTypeProps | ArticleTypeProps[];
  className?: string;
};

type ContactProps = {
  title: string;
  content: string;
  email: string;
  type: ArticleTypeProps;
};

export default function HelpContacts({ type, className }: HelpContactProps) {
  const { t } = useTranslation('help');
  const contacts: ContactProps[] = t('additionalContacts.contacts', {
    returnObjects: true
  });

  const contactKeys = Object.keys(contacts).filter((key: any) => {
    return type.includes(contacts[key].type);
  });

  return (
    <div className={classnames('padding-bottom-5 padding-top-2', className)}>
      <h2 className="margin-bottom-1">{t('additionalContacts.heading')}</h2>
      <p className="font-body-md">{t('additionalContacts.subheading')}</p>
      <div className="grid-row grid-gap-lg">
        {contactKeys.map((key: any) => {
          return (
            <div key={key} className="desktop:grid-col-4 margin-bottom-2">
              <h3 className="margin-bottom-1 margin-top-2">
                {contacts[key].title}
              </h3>
              <p className="margin-top-1 line-height-body-4">
                {contacts[key].content}
              </p>
              <h4 className="margin-y-1">
                {t('additionalContacts.emailHeading')}
              </h4>
              <UswdsLink href={`mailto:${contacts[key].email}`}>
                {contacts[key].email}
              </UswdsLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
