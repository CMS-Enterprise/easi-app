import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SystemIntakeGRBReviewFragment } from 'gql/generated/graphql';

import AdminAction from 'components/AdminAction';
import CollapsableLink from 'components/CollapsableLink';
import { formatDateLocal, formatTimeLocal } from 'utils/date';

import SendReviewReminder from '../SendReviewReminder';

export type IntakeRequestCardProps = {
  isITGovAdmin: boolean;
  grbReviewStartedAt: SystemIntakeGRBReviewFragment['grbReviewStartedAt'];
  systemIntakeId: string;
  grbReviewReminderLastSent: SystemIntakeGRBReviewFragment['grbReviewReminderLastSent'];
  grbReviewers: SystemIntakeGRBReviewFragment['grbVotingInformation']['grbReviewers'];
};

const GRBReviewAdminTask = ({
  isITGovAdmin,
  grbReviewStartedAt,
  systemIntakeId,
  grbReviewReminderLastSent,
  grbReviewers
}: IntakeRequestCardProps) => {
  const { t } = useTranslation('grbReview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatDoINeedItems: string[] = t('adminTask.setUpGRBReview.whatDoINeed', {
    returnObjects: true
  });

  const history = useHistory();

  if (!isITGovAdmin) {
    return null;
  }

  return (
    <>
      <SendReviewReminder
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        systemIntakeId={systemIntakeId}
        grbReviewers={grbReviewers}
      />
      {grbReviewStartedAt ? (
        <AdminAction
          type="ITGov"
          title={t('adminTask.sendReviewReminder.title')}
          buttons={[
            {
              label: t('adminTask.sendReviewReminder.sendReminder'),
              onClick: () => setIsModalOpen(true)
            },
            {
              label: t('adminTask.takeADifferentAction'),
              unstyled: true,
              onClick: () =>
                history.push(`/it-governance/${systemIntakeId}/actions`)
            }
          ]}
        >
          <p className="margin-top-0 margin-bottom-1">
            {t('adminTask.sendReviewReminder.description')}
          </p>

          {grbReviewReminderLastSent && (
            <p
              className="margin-top-0 margin-bottom-3 text-italic text-base-dark"
              data-testid="review-reminder"
            >
              {t('adminTask.sendReviewReminder.mostRecentReminder', {
                date: formatDateLocal(grbReviewReminderLastSent, 'MM/dd/yyyy'),
                time: formatTimeLocal(grbReviewReminderLastSent)
              })}
            </p>
          )}
        </AdminAction>
      ) : (
        <AdminAction
          type="ITGov"
          title={t('adminTask.setUpGRBReview.title')}
          buttons={[
            {
              label: t('adminTask.setUpGRBReview.title'),
              onClick: () =>
                history.push(
                  `/it-governance/${systemIntakeId}/grb-review/review-type`
                )
            },
            {
              label: t('adminTask.takeADifferentAction'),
              unstyled: true,
              onClick: () =>
                history.push(`/it-governance/${systemIntakeId}/actions`)
            }
          ]}
        >
          <p className="margin-top-0">
            {t('adminTask.setUpGRBReview.description')}
          </p>

          <CollapsableLink
            id="setUpGRBReview"
            className="margin-top-2"
            label={t('adminTask.setUpGRBReview.whatDoINeedLabel')}
          >
            <ul className="padding-left-3 margin-0">
              {whatDoINeedItems.map((item, index) => (
                <li key={item}>
                  <Trans
                    i18nKey={`grbReview:adminTask.setUpGRBReview.whatDoINeed.${index}`}
                    components={{ bold: <strong /> }}
                  />
                </li>
              ))}
            </ul>
          </CollapsableLink>
        </AdminAction>
      )}
    </>
  );
};

export default GRBReviewAdminTask;
