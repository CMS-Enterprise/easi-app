import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import { RequestRelationType } from 'gql/generated/graphql';

import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import { RequestType } from 'types/requestType';
import formatContractNumbers from 'utils/formatContractNumbers';

import './index.scss';

type SystemCardItemProps = {
  id: string;
  name: string;
  acronym?: string | null;
};

function SystemCardItem({ item }: { item: SystemCardItemProps }) {
  const { t } = useTranslation('itGov');
  return (
    <div className="margin-top-2 padding-3 border border-base-lighter radius-md box-shadow-2">
      <h4 className="margin-top-0 margin-bottom-1 line-height-heading-2">
        {item.name}
      </h4>
      {item.acronym && (
        <h5 className="margin-y-0 text-normal line-height-heading-1">
          {item.acronym}
        </h5>
      )}
      <Divider className="margin-y-2" />
      <UswdsReactLink to={`/systems/${item.id}`}>
        {t('additionalRequestInfo.viewSystemProfile')}
        <Icon.ArrowForward className="text-middle margin-left-05" aria-hidden />
      </UswdsReactLink>
    </div>
  );
}

function SystemCardList({ items }: { items: SystemCardItemProps[] }) {
  const { t } = useTranslation('itGov');

  const [isShowMore, setShowMore] = useState<boolean>(false);

  // Initially only show 1 card
  const numInitial = 1;
  const numMore = items.length - numInitial;

  if (items.length === 0) return null;

  return (
    <div className="margin-y-2">
      <SystemCardItem item={items[0]} />
      {numMore > 0 && (
        <>
          <Button
            type="button"
            unstyled
            className="margin-top-2"
            onClick={() => setShowMore(!isShowMore)}
          >
            {t(`additionalRequestInfo.show.${isShowMore ? 'less' : 'more'}`, {
              count: numMore
            })}
            <Icon.ExpandMore
              aria-hidden
              className="text-middle margin-left-05"
              style={{ transform: `scaleY(${isShowMore ? -1 : 1})` }}
            />
          </Button>

          {isShowMore &&
            items
              .slice(numInitial)
              .map(i => <SystemCardItem key={i.id} item={i} />)}
        </>
      )}
    </div>
  );
}

function AdditionalRequestInfo({
  ...system
}: {
  id: string;
  systems: SystemCardItemProps[];
  relationType?: string | null;
  contractName?: string | null;
  contractNumbers: { contractNumber: string }[];
  requestType: RequestType;
}) {
  const { t } = useTranslation('itGov');

  const editLink =
    system.requestType === 'trb'
      ? `/trb/link/${system.id}`
      : `/linked-systems/${system.id}`;

  return (
    <div>
      <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
        {t('additionalRequestInfo.header')}
      </h4>

      {(!system.systems || system.systems.length === 0) && (
        <>
          <div className="task-list-sidebar__subtitle">
            {t('additionalRequestInfo.doesNotSupportOrUseOtherSystems')}
          </div>
          <UswdsReactLink to={editLink}>
            {t('additionalRequestInfo.viewOrEditSystemInformation')}
          </UswdsReactLink>
        </>
      )}

      {system.relationType !== null && (
        <p className="text-base margin-top-1 margin-bottom-0">
          {system.relationType === RequestRelationType.EXISTING_SERVICE &&
            t('additionalRequestInfo.existingService')}
          {system.relationType === RequestRelationType.EXISTING_SYSTEM &&
            t('additionalRequestInfo.existingSystem')}
          {system.relationType === RequestRelationType.NEW_SYSTEM &&
            t('additionalRequestInfo.newSystem')}
          <br />
          <UswdsReactLink to={editLink}>
            {t('additionalRequestInfo.edit')}
          </UswdsReactLink>
        </p>
      )}

      {system.systems && system.systems.length > 0 && (
        <>
          <div className="task-list-sidebar__subtitle">
            {t('additionalRequestInfo.linkedSystems')}
          </div>
          <UswdsReactLink to={editLink}>
            {t('additionalRequestInfo.edit')}
          </UswdsReactLink>
          <SystemCardList items={system.systems} />
        </>
      )}

      {system.contractName !== null && (
        <p>
          <span className="text-base">
            {t('additionalRequestInfo.contractName')}
          </span>
          <br />
          {system.contractName}
        </p>
      )}

      {system.requestType !== 'itgov' && // Hide the contract number field from itgov, see Note [EASI-4160 Disable Contract Number Linking]
        system.relationType !== null && (
          <p>
            <span className="text-base">
              {t('additionalRequestInfo.contractNumber')}
            </span>
            <br />
            {system.contractNumbers.length ? (
              formatContractNumbers(system.contractNumbers)
            ) : (
              <em className="text-base">
                {t('additionalRequestInfo.noContractNumber')}
              </em>
            )}
          </p>
        )}
    </div>
  );
}

export default AdditionalRequestInfo;
