import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  IconArrowForward,
  IconExpandMore
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import { GetGovernanceTaskList_systemIntake as SystemIntake } from 'queries/types/GetGovernanceTaskList';
import { RequestRelationType } from 'types/graphql-global-types';

type SystemCardItemProps = {
  id: string;
  name: string;
  acronym: string | null;
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
        <IconArrowForward className="text-middle margin-left-05" />
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
            <IconExpandMore
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

function AdditionalRequestInfo({ ...system }: SystemIntake) {
  const { t } = useTranslation('itGov');

  return (
    <div>
      <h4 className="line-height-body-2 margin-top-3 margin-bottom-1">
        {t('additionalRequestInfo.header')}
      </h4>

      {system.relationType === null && (
        <Alert
          type="warning"
          heading={t('additionalRequestInfo.actionRequiredAlert.header')}
        >
          {t('additionalRequestInfo.actionRequiredAlert.text')}
          <UswdsReactLink to={`/system/link/${system.id}`}>
            {t('additionalRequestInfo.actionRequiredAlert.answer')}
          </UswdsReactLink>
        </Alert>
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
          <UswdsReactLink to={`/system/link/${system.id}`}>
            {t('additionalRequestInfo.edit')}
          </UswdsReactLink>
        </p>
      )}

      <SystemCardList items={system.systems} />

      {system.contractName !== null && (
        <p>
          <span className="text-base">
            {t('additionalRequestInfo.contractName')}
          </span>
          <br />
          {system.contractName}
        </p>
      )}

      {system.relationType !== null && (
        <p>
          <span className="text-base">
            {t('additionalRequestInfo.contractNumber')}
          </span>
          <br />
          {system.contractNumbers.length ? (
            system.contractNumbers.map(v => v.contractNumber).join(', ')
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
