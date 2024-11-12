import React from 'react';

import DiscussionReply from 'components/DiscussionReply';

/** Displays recent discussions on GRB Review tab */
const DiscussionsCard = () => {
  return (
    <div>
      <h2>Discussions</h2>
      <DiscussionReply />
    </div>
  );
};

export default DiscussionsCard;
