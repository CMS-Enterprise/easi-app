import { DiscussionTimestamps } from 'types/discussions';

import { getMostRecentDiscussion } from './util';

const discussionTimestamps: DiscussionTimestamps[] = [
  {
    initialPost: {
      createdAt: '2024-11-12T10:00:00.368862Z'
    },
    replies: []
  },
  {
    initialPost: {
      createdAt: '2024-11-11T10:00:00.368862Z'
    },
    replies: [
      {
        createdAt: '2024-11-11T10:05:00.368862Z'
      },
      {
        createdAt: '2024-11-14T12:05:00.368862Z'
      }
    ]
  },
  {
    initialPost: {
      createdAt: '2024-11-13T10:00:00.368862Z'
    },
    replies: [
      {
        createdAt: '2024-11-13T10:05:00.368862Z'
      },
      {
        createdAt: '2024-11-14T10:05:00.368862Z'
      }
    ]
  }
];

describe('getMostRecentDiscussion', () => {
  it('returns the discussion with the most recent activity', () => {
    const recentDiscussion = getMostRecentDiscussion(discussionTimestamps);

    expect(recentDiscussion).toEqual(discussionTimestamps[1]);
  });
});
