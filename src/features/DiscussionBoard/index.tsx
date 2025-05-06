import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  SystemIntakeGRBDiscussionBoardType,
  SystemIntakeGRBReviewDiscussionFragment,
  TagType,
  useGetSystemIntakeGRBDiscussionsQuery,
  useGetSystemIntakeGRBReviewQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import useDiscussionParams, { DiscussionMode } from 'hooks/useDiscussionParams';
import { DiscussionAlert, MentionSuggestion } from 'types/discussions';
import user from 'utils/user';

import Discussion from './Discussion';
import DiscussionModalWrapper from './DiscussionModalWrapper';
import StartDiscussion from './StartDiscussion';
import ViewDiscussions from './ViewDiscussions';

import './index.scss';

type DiscussionBoardProps = {
  systemIntakeID: string;
  readOnly?: boolean;
};

function DiscussionBoard({ systemIntakeID, readOnly }: DiscussionBoardProps) {
  const { t } = useTranslation();

  const flags = useFlags();
  const { groups, euaId, isUserSet } = useSelector(
    (state: AppState) => state.auth
  );

  /** Discussion alert state for form success and error messages */
  const [discussionAlert, setDiscussionAlert] = useState<DiscussionAlert>(null);

  const { getDiscussionParams, pushDiscussionQuery } = useDiscussionParams();

  const {
    discussionMode,
    discussionId,
    discussionBoardType = SystemIntakeGRBDiscussionBoardType.PRIMARY
  } = getDiscussionParams();

  // Reset discussionAlert when the side panel changes from certain modes
  const [lastMode, setLastMode] = useState<DiscussionMode | undefined>(
    discussionMode
  );

  const { data: grbReviewData } = useGetSystemIntakeGRBReviewQuery({
    variables: { id: systemIntakeID },
    fetchPolicy: 'cache-first'
  });

  const { data: grbDiscussionsData, loading: grbDiscussionsLoading } =
    useGetSystemIntakeGRBDiscussionsQuery({
      variables: { id: systemIntakeID },
      fetchPolicy: 'cache-first'
    });

  /** Return GRB discussions based on board type */
  const grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[] | undefined =
    useMemo(() => {
      if (grbDiscussionsLoading || !grbDiscussionsData?.systemIntake) {
        return undefined;
      }

      const { grbDiscussionsInternal, grbDiscussionsPrimary } =
        grbDiscussionsData.systemIntake;

      if (discussionBoardType === SystemIntakeGRBDiscussionBoardType.INTERNAL) {
        return grbDiscussionsInternal;
      }

      return grbDiscussionsPrimary;
    }, [grbDiscussionsLoading, grbDiscussionsData, discussionBoardType]);

  const { grbReviewStartedAt } = grbReviewData?.systemIntake || {};
  const grbReviewers =
    grbReviewData?.systemIntake?.grbVotingInformation?.grbReviewers;

  /** Mention suggestions for discussion form tags */
  const mentionSuggestions: MentionSuggestion[] = useMemo(() => {
    const suggestions: MentionSuggestion[] = [
      {
        displayName: t('Governance Admin Team'),
        tagType: TagType.GROUP_IT_GOV
      },
      {
        displayName: t('Governance Review Board (GRB)'),
        tagType: TagType.GROUP_GRB_REVIEWERS
      },
      ...(grbReviewers || []).map(({ userAccount }) => ({
        key: userAccount.username,
        tagType: TagType.USER_ACCOUNT,
        displayName: userAccount.commonName,
        id: userAccount.id
      }))
    ];

    // Add requester as mention suggestion for primary discussion board
    if (discussionBoardType === SystemIntakeGRBDiscussionBoardType.PRIMARY) {
      suggestions[2] = {
        displayName: t('Requester'),
        tagType: TagType.REQUESTER
      };
    }

    return suggestions;
  }, [grbReviewers, discussionBoardType, t]);

  /**
   * Returns false if user is trying to access restricted discussion board
   * and is NOT an admin or GRB reviewer
   */
  const canViewDiscussionBoard: boolean = useMemo(() => {
    if (!isUserSet || !grbReviewers) return false;

    // Return early if board type is unrestricted
    if (discussionBoardType === SystemIntakeGRBDiscussionBoardType.PRIMARY) {
      return true;
    }

    // Return true if user is GRB reviewer or IT Gov admin
    return (
      user.isITGovAdmin(groups, flags) ||
      !!grbReviewers.find(reviewer => reviewer.userAccount.username === euaId)
    );
  }, [groups, isUserSet, euaId, flags, grbReviewers, discussionBoardType]);

  useEffect(() => {
    if (lastMode !== discussionMode) {
      if (lastMode === 'view' || lastMode === 'reply') {
        setDiscussionAlert(null);
      }
      setLastMode(discussionMode);
    }
  }, [discussionMode, lastMode, setDiscussionAlert]);

  const closeModal = () => pushDiscussionQuery(false);

  // Hide discusion board if GRB review has not yet started
  if (!grbReviewStartedAt || !grbDiscussions) {
    return null;
  }

  const activeDiscussion =
    grbDiscussions.find(d => d.initialPost.id === discussionId) || null;

  return (
    <DiscussionModalWrapper
      discussionBoardType={discussionBoardType}
      isOpen={discussionMode !== undefined}
      closeModal={closeModal}
    >
      {canViewDiscussionBoard ? (
        <>
          {discussionAlert && (
            <Alert
              slim
              {...discussionAlert}
              className={classNames(
                'margin-bottom-6',
                discussionAlert.className
              )}
              isClosable={false}
            >
              {discussionAlert.message}
            </Alert>
          )}

          {discussionMode === 'view' && (
            <ViewDiscussions
              grbDiscussions={grbDiscussions}
              discussionBoardType={discussionBoardType}
              readOnly={readOnly}
            />
          )}

          {discussionMode === 'start' && (
            <StartDiscussion
              discussionBoardType={discussionBoardType}
              mentionSuggestions={mentionSuggestions}
              systemIntakeID={systemIntakeID}
              closeModal={closeModal}
              setDiscussionAlert={setDiscussionAlert}
              readOnly={readOnly}
            />
          )}

          {discussionMode === 'reply' && (
            <Discussion
              discussionBoardType={discussionBoardType}
              mentionSuggestions={mentionSuggestions}
              discussion={activeDiscussion}
              closeModal={closeModal}
              setDiscussionAlert={setDiscussionAlert}
              readOnly={readOnly}
            />
          )}
        </>
      ) : (
        // If user cannot view discussion board, return page not found
        <NotFoundPartial />
      )}
    </DiscussionModalWrapper>
  );
}

export default DiscussionBoard;
