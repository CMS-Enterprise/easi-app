import React from 'react';

import DiscussionReply from 'components/DiscussionReply';
import { discussionWithReplies } from 'data/mock/discussions';

/** Displays recent discussions on GRB Review tab */
const DiscussionsCard = () => {
  return (
    <div>
      <h2>Discussions</h2>
      <DiscussionReply discussion={discussionWithReplies} />
    </div>
  );
};

export default DiscussionsCard;
