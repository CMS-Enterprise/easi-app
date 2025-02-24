import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { getPersonFullName } from 'features/Systems/SystemProfile/util';
import { CedarRole } from 'gql/generated/graphql';
import { GetSystemProfile_cedarAuthorityToOperate as CedarAuthorityToOperate } from 'gql/legacyGQL/types/GetSystemProfile';

import { AtoStatusTag } from 'components/AtoStatus';
import ExternalLinkAndModal from 'components/ExternalLinkAndModal';
import { ATO_LEARN_MORE, CFACTS } from 'constants/externalUrls';
import { AtoStatus } from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';

import SpacesCard from '../SpacesCard';

type Props = {
  status: AtoStatus;
  dateAuthorizationMemoExpires?: CedarAuthorityToOperate['dateAuthorizationMemoExpires'];
  isso?: CedarRole;
  className?: string;
};

function AtoCard({
  status,
  dateAuthorizationMemoExpires,
  isso,
  className
}: Props) {
  const { t } = useTranslation('systemWorkspace');

  return (
    <>
      <SpacesCard
        header={t('spaces.ato.header')}
        description={t('spaces.ato.description')}
        body={
          <>
            <div className="display-flex">
              <AtoStatusTag
                status={status}
                className="display-flex flex-align-center margin-right-1"
              />
              {dateAuthorizationMemoExpires && (
                <span className="display-flex flex-align-center text-base">
                  {status === 'Expired' ? 'Expired' : 'Expires'}{' '}
                  {formatDateUtc(dateAuthorizationMemoExpires, 'MM/dd/yyyy')}
                </span>
              )}
            </div>
            <p>
              <strong>{t('spaces.ato.isso')}</strong>
              <br />
              {showVal(isso, {
                format: v => getPersonFullName(v),
                defaultVal: t('spaces.ato.noIsso')
              })}
            </p>
          </>
        }
        footer={
          <div className="display-flex">
            <Link
              className={classnames('usa-button', {
                'usa-button--disabled': !isso?.assigneeEmail,
                'no-pointer': !isso?.assigneeEmail
              })}
              href={`mailto:${isso?.assigneeEmail}`}
            >
              {t('spaces.ato.contact')}
            </Link>
            <ExternalLinkAndModal
              href={CFACTS}
              modalType="CFACTS"
              buttonType="outline"
            >
              {t('spaces.ato.cfacts')}
            </ExternalLinkAndModal>
            <Link
              variant="unstyled"
              href={ATO_LEARN_MORE}
              target="_blank"
              className="margin-left-1 display-flex flex-align-center text-primary"
            >
              {t('spaces.ato.learn')}
              <Icon.Launch className="margin-left-1" />
            </Link>
          </div>
        }
      />
    </>
  );
}

export default AtoCard;
