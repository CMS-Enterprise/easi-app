import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, IconLaunch, Link } from '@trussworks/react-uswds';
import classnames from 'classnames';

import Modal from 'components/Modal';
import { AtoStatusTag } from 'components/shared/AtoStatus';
import { ATO_LEARN_MORE, CFACTS } from 'constants/externalUrls';
import { GetSystemProfile_cedarAuthorityToOperate as CedarAuthorityToOperate } from 'queries/types/GetSystemProfile';
import { GetSystemWorkspace_cedarSystemDetails_roles as CedarRole } from 'queries/types/GetSystemWorkspace';
import { AtoStatus } from 'types/systemProfile';
import { formatDateUtc } from 'utils/date';
import showVal from 'utils/showVal';
import { getPersonFullName } from 'views/SystemProfile/helpers';

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

  const [cfactsLinkModalOpen, setCfactsLinkModalOpen] = useState<boolean>(
    false
  );

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
            <Link
              className="usa-button usa-button--outline"
              href={CFACTS}
              onClick={e => {
                e.preventDefault();
                setCfactsLinkModalOpen(true);
              }}
            >
              {t('spaces.ato.cfacts')}
            </Link>
            <Link
              variant="unstyled"
              href={ATO_LEARN_MORE}
              target="_blank"
              className="margin-left-1 display-flex flex-align-center text-primary"
            >
              {t('spaces.ato.learn')}
              <IconLaunch className="margin-left-1" />
            </Link>
          </div>
        }
      />

      {/* Leaving easi modal */}
      <Modal
        isOpen={!!cfactsLinkModalOpen}
        closeModal={() => setCfactsLinkModalOpen(false)}
      >
        <h2 className="usa-modal__heading margin-bottom-2">
          {t('spaces.ato.modal.header')}
        </h2>
        <p className="margin-y-0">{t('spaces.ato.modal.text')}</p>
        <ButtonGroup className="margin-top-3">
          <Link
            className="usa-button"
            href={CFACTS}
            target="_blank"
            onClick={() => setCfactsLinkModalOpen(false)}
          >
            {t('spaces.ato.modal.continue')}
          </Link>
          <Button
            type="button"
            unstyled
            className="margin-left-1"
            onClick={() => setCfactsLinkModalOpen(false)}
          >
            {t('spaces.ato.modal.cancel')}
          </Button>
        </ButtonGroup>
      </Modal>
    </>
  );
}

export default AtoCard;
