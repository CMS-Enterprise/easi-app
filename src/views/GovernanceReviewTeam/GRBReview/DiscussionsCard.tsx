import React from 'react';
import { SystemIntakeGRBReviewDiscussionFragment } from 'gql/gen/graphql';

import DiscussionReply from 'components/DiscussionReply';

type DiscussionsCardProps = {
  grbDiscussions: SystemIntakeGRBReviewDiscussionFragment[];
};

/** Displays recent discussions on GRB Review tab */
const DiscussionsCard = ({ grbDiscussions }: DiscussionsCardProps) => {
  return (
    <div>
      <h2>Discussions</h2>
      <DiscussionReply discussion={grbDiscussions[0]} />
    </div>
  );
};

export default DiscussionsCard;
