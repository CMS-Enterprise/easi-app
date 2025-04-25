import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import {
  ITGovGRBStatus,
  useGetSystemIntakeGRBDiscussionsQuery
} from 'gql/generated/graphql';

type RequesterDiscussionsCardProps = {
  systemIntakeId: string;
  grbMeetingStatus: ITGovGRBStatus;
};

const RequesterDiscussionsCard = ({
  systemIntakeId,
  grbMeetingStatus
}: RequesterDiscussionsCardProps) => {
  const { t } = useTranslation('discussions');

  const { data, loading } = useGetSystemIntakeGRBDiscussionsQuery({
    variables: { id: systemIntakeId }
  });

  const grbDiscussionsPrimary = useMemo(
    () => data?.systemIntake?.grbDiscussionsPrimary,
    [data]
  );

  const discussionsWithoutRepliesCount = useMemo(() => {
    if (!grbDiscussionsPrimary) return 0;

    return grbDiscussionsPrimary.filter(({ replies }) => replies.length === 0)
      .length;
  }, [grbDiscussionsPrimary]);

  if (loading || !grbDiscussionsPrimary) return null;

  return (
    <div
      className="bg-base-lightest padding-2 margin-top-2"
      data-testid="requester-discussions-card"
    >
      <p className="display-flex flex-align-center">
        <Icon.Announcement className="margin-right-1" />

        {grbDiscussionsPrimary.length === 0 ? (
          t('taskList.noDiscussions', { context: grbMeetingStatus })
        ) : (
          <span>
            <Trans
              i18nKey="discussions:taskList.discussionsCount"
              values={{
                count: grbDiscussionsPrimary.length,
                discussionsWithoutRepliesCount
              }}
              components={[
                <span
                  className="text-bold"
                  data-testid="discussions-without-replies"
                />,
                <span className="text-bold" data-testid="discussions-total" />
              ]}
            />
          </span>
        )}
      </p>
    </div>
  );
};

export default RequesterDiscussionsCard;
