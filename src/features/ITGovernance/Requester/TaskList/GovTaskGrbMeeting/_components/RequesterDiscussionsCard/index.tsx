import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import {
  ITGovGRBStatus,
  useGetSystemIntakeGRBDiscussionsQuery
} from 'gql/generated/graphql';

import Divider from 'components/Divider';
import Spinner from 'components/Spinner';

type RequesterDiscussionsCardProps = {
  systemIntakeId: string;
  grbMeetingStatus: ITGovGRBStatus;
};

/**
 * Displays Primary Discussion Board information for requesters
 * with buttons to view and start discussions
 */
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

  return (
    <div
      className="bg-base-lightest padding-2 margin-top-2"
      data-testid="requester-discussions-card"
    >
      {loading ? (
        <Spinner />
      ) : (
        <p className="display-flex flex-align-center">
          <Icon.Announcement className="margin-right-1" />

          {grbDiscussionsPrimary?.length === 0 ? (
            t('taskList.noDiscussions', { context: grbMeetingStatus })
          ) : (
            <span>
              <Trans
                i18nKey="discussions:taskList.discussionsCount"
                values={{
                  count: grbDiscussionsPrimary?.length,
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
      )}

      <Divider className="margin-y-2" />

      <ButtonGroup>
        <Button
          type="button"
          // TODO EASI-4857: update to open primary discussion board
          onClick={() => null}
          className="margin-right-1"
        >
          {t('general.viewDiscussionBoard')}
        </Button>

        {grbMeetingStatus !== ITGovGRBStatus.AWAITING_DECISION && (
          <Button
            type="button"
            // TODO EASI-4857: update to open primary discussion board
            onClick={() => null}
            unstyled
          >
            {t('general.startDiscussion.heading')}
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default RequesterDiscussionsCard;
