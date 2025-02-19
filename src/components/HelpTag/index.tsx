import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { ArticleRouteProps, ArticleTypeProps } from 'types/articles';

const articleTypes: ArticleRouteProps[] = [
  {
    type: 'IT Governance',
    route: '/it-governance'
  },
  {
    type: 'Technical Review Board',
    route: '/trb'
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
    <UswdsReactLink
      to={`/help${articleType.route}`}
      className={classnames('display-inline-block', className)}
    >
      <Tag className="system-profile__tag text-primary-dark bg-primary-lighter padding-bottom-1">
        {t(articleType.type)}
      </Tag>
    </UswdsReactLink>
  );
}
