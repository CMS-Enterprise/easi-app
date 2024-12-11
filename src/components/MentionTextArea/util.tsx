import { JSONContent } from '@tiptap/core';

/**
 * Returns array of mentions from Tiptap input JSON data
 *
 * @example getMentions(input?.getJSON())
 */
export const getMentions = <
  /** Optional type param for mention attributes if return array needs to be typed */
  MentionAttrsType extends Record<string, any> = Record<string, any>
>(
  data: JSONContent
): MentionAttrsType[] => {
  const mentions: MentionAttrsType[] = [];

  data?.content?.forEach(paragraph => {
    paragraph?.content?.forEach(content => {
      if (content?.attrs && content?.type === 'mention') {
        mentions.push(content.attrs as MentionAttrsType);
      }
    });
  });

  return mentions;
};

/** Generic discussion type with only `createdAt` props */
interface DiscussionTimestamps {
  initialPost: {
    createdAt: string;
  };
  replies: { createdAt: string }[];
}

/** Compare initialPost with replies and find the most recent `createdAt` value */
const getMostRecentTimestamp = <DiscussionType extends DiscussionTimestamps>({
  initialPost,
  replies
}: DiscussionType) => {
  if (replies.length === 0) return initialPost.createdAt;

  return replies.reduce(
    (latest, current) => {
      return current.createdAt > latest.createdAt ? current : latest;
    },
    // Start with the initialPost
    initialPost
    // Return the `createdAt` value
  ).createdAt;
};

/**
 * Find and return the discussion object with the most recent activity
 *
 * Returns undefined if discussions array is empty
 */
export const getMostRecentDiscussion = <
  DiscussionType extends DiscussionTimestamps
>(
  discussions: DiscussionType[]
): DiscussionType | undefined => {
  if (discussions.length === 0) return undefined;

  return discussions.reduce((mostRecentDiscussion, currentDiscussion) => {
    /** Latest createdAt value for current discussion */
    const currentDiscussionCreatedAt =
      getMostRecentTimestamp(currentDiscussion);

    // Latest createdAt value for most recent discussion
    const mostRecentDiscussionCreatedAt =
      getMostRecentTimestamp(mostRecentDiscussion);

    return currentDiscussionCreatedAt > mostRecentDiscussionCreatedAt
      ? currentDiscussion
      : mostRecentDiscussion;
  });
};

export default getMentions;
