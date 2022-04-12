import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardGroup, Link as UswdsLink } from '@trussworks/react-uswds';

import ArticleCard from 'components/ArticleCard';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpContacts from 'components/HelpContacts';
import HelpPageIntro from 'components/HelpPageIntro';
import Divider from 'components/shared/Divider';

import section508Articles from './articles';

const Section508 = () => {
  const { t } = useTranslation('help');

  return (
    <>
      <HelpBreadcrumb type="Back" />
      <HelpPageIntro
        heading={t('section508.heading')}
        subheading={
          <p>
            {t('section508.subheading')}
            <UswdsLink
              variant="external"
              target="_blank"
              href={`https://${t('section508.website')}`}
            >
              {t('section508.website')}
            </UswdsLink>
          </p>
        }
      />
      <CardGroup className="padding-top-1 padding-bottom-4">
        {section508Articles.map(article => {
          return (
            <ArticleCard key={article.route} {...article} tag={false} isLink />
          );
        })}
      </CardGroup>
      <Divider />
      <HelpContacts type="Section 508" />
    </>
  );
};

export default Section508;
