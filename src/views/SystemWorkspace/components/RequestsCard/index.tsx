import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import linkCedarSystemIdQueryString from 'utils/linkCedarSystemIdQueryString';

import SpacesCard from '../SpacesCard';

type RequestsCardProps = {
  systemId: string;
  trbCount: number;
  itgovCount: number;
};

function RequestsCard({ systemId, trbCount, itgovCount }: RequestsCardProps) {
  const { t } = useTranslation('systemWorkspace');

  const linkSearchQuery = linkCedarSystemIdQueryString(systemId);

  return (
    <SpacesCard
      header={t('spaces.requests.header')}
      description={t('spaces.requests.description')}
      body={
        <div>
          <div className="margin-bottom-2">
            <strong className="padding-right-1 border-right-1px border-base-light">
              {t('spaces.requests.itgCount', { count: itgovCount })}
            </strong>
            <UswdsReactLink
              className="margin-left-1 text-primary"
              to={{
                search: linkSearchQuery,
                pathname: '/system/request-type'
              }}
              data-testid="new-request-itgov"
            >
              {t('spaces.requests.start')}
            </UswdsReactLink>
          </div>
          <div>
            <strong className="padding-right-1 border-right-1px border-base-light">
              {t('spaces.requests.trbCount', { count: trbCount })}
            </strong>
            <UswdsReactLink
              className="margin-left-1 text-primary"
              to={{
                search: linkSearchQuery,
                pathname: '/trb/start'
              }}
              data-testid="new-request-trb"
            >
              {t('spaces.requests.start')}
            </UswdsReactLink>
          </div>
        </div>
      }
      footer={
        <Button disabled type="button">
          {t('spaces.requests.viewAll')}
        </Button>
      }
    />
  );
}

export default RequestsCard;
