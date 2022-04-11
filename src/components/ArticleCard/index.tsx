import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/shared/Tag';
import { ArticleProps } from 'types/articles';

import './index.scss';

type ArticleCardProps = {
  className?: string;
  isLink?: boolean;
  tag?: boolean;
};

const ArticleCard = ({
  className,
  type,
  route,
  translation,
  isLink = false,
  tag = true
}: ArticleCardProps & ArticleProps) => {
  const { t } = useTranslation(translation);
  const history = useHistory();

  const clickHandler = (
    e: React.MouseEvent<HTMLElement>,
    cardRoute: string
  ) => {
    const target = e.target as Element;
    if (target.getAttribute('data-testid') === 'tag') {
      if (type === 'Section 508') {
        history.push('/help/section-508');
      } else {
        history.push('/help/it-goverance');
      }
      return;
    }
    if (isLink) {
      history.push(cardRoute);
    }
  };

  return (
    <Card
      containerProps={{
        className: 'radius-md shadow-2 minh-mobile maxh-mobile'
      }}
      data-testid="article-card"
      className={classnames('desktop:grid-col-4', 'article', className, {
        'article-card--isLink': isLink
      })}
      onClick={e => clickHandler(e, `help${route}`)}
    >
      <CardHeader className="padding-x-3 padding-top-3 padding-bottom-2">
        <h3 className="line-height-body-4 margin-bottom-1">{t('title')}</h3>
        {tag && (
          <Tag className="system-profile__tag text-primary-dark bg-primary-lighter padding-bottom-1">
            {type}
          </Tag>
        )}
      </CardHeader>
      <CardBody className="padding-top-0 article__body">
        {t('description')}
      </CardBody>
      <CardFooter className="padding-top-2 article__footer">
        <UswdsReactLink
          to={`help${route}`}
          className="easi-request__button-link padding-x-2"
        >
          {useTranslation('help').t('read')}
        </UswdsReactLink>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
