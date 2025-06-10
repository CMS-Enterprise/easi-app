import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { RequestType } from 'types/requestType';

type LinkCardProps = {
  className?: string;
  type: RequestType;
} & JSX.IntrinsicElements['div'];

const LinkCard = ({ className, type }: LinkCardProps) => {
  const { t } = useTranslation('home');

  const history = useHistory();
  return (
    <div
      className={classnames(
        'padding-2',
        'line-height-body-4',
        'link-card-container',
        'bg-base-lightest',
        className
      )}
    >
      <h3 className="margin-top-0 margin-bottom-1">
        {t(`actions.${type}.heading`)}
      </h3>
      <div className="margin-top-1">{t(`actions.${type}.body`)}</div>

      <UswdsReactLink
        to={t(`actions.${type}.link`)}
        className="display-flex flex-align-center margin-top-1 margin-bottom-3"
      >
        {t(`actions.${type}.learnMore`)}
        <Icon.ArrowForward className="margin-left-1" aria-label="forward" />
      </UswdsReactLink>

      <Button
        type="button"
        className="usa-button usa-button--outline"
        onClick={() => history.push(t(`actions.${type}.buttonLink`))}
      >
        {t(`actions.${type}.button`)}
      </Button>
    </div>
  );
};

export default LinkCard;
