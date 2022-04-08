import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ArticleTypeProps } from 'types/articles';

export type ArticleTypes = {
  type: string;
  route: string;
};

const articleTypes: ArticleTypes[] = [
  {
    type: 'IT Governance',
    route: '/it-governance'
  },
  {
    type: 'Section 508',
    route: '/section-508'
  }
];

type HelpTagTypes = {
  type: ArticleTypeProps;
  className?: string;
};

export default function HelpTag({ type, className }: HelpTagTypes) {
  const { t } = useTranslation();
  const articleType = articleTypes.filter(article => article.type === type)[0];
  return (
    <UswdsReactLink to={`/help${articleType.route}`} className={className}>
      <Tag className="system-profile__tag text-primary-dark bg-primary-lighter padding-bottom-1 margin-y-1">
        {t(articleType.type)}
      </Tag>
    </UswdsReactLink>
  );
}
