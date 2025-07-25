import { SuggestionProps } from '@tiptap/suggestion';
import { TagType } from 'gql/generated/graphql';

import { AlertProps } from 'components/Alert';

/** Error and success alerts for the discussion form */
export type DiscussionAlert =
  | (Omit<AlertProps, 'Children'> & { message: string })
  | null;

export type MentionSuggestion =
  | {
      tagType:
        | TagType.GROUP_IT_GOV
        | TagType.GROUP_GRB_REVIEWERS
        | TagType.REQUESTER;
      displayName: string;
    }
  | {
      tagType: TagType.USER_ACCOUNT;
      displayName: string;
      id: string;
    };

/** HTML attributes used for rendering mentions */
export type MentionAttributes = {
  /** Text displayed within mention `span` tag */
  label: string;
  /** Label attribute for rendering mentions */
  'data-label': string;
  /** UUID for `USER_ACCOUNT` tag types */
  'data-id-db': string;
  'tag-type': TagType;
};

/** Suggestion props for use within Tiptap configurations */
export type MentionSuggestionProps = SuggestionProps<
  MentionSuggestion,
  MentionAttributes
>;

/** `MentionList` component forwarded ref attributes */
export type MentionListOnKeyDown = {
  /** onKeyDown handler for rendering the suggestions popup and loading spinner */
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
};

/** Generic discussion type with only `createdAt` props */
export interface DiscussionTimestamps {
  initialPost: {
    createdAt: string;
  };
  replies: { createdAt: string }[];
}
