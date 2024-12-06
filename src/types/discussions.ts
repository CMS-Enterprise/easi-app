import { TagType } from 'gql/gen/graphql';

import { AlertProps } from 'components/shared/Alert';

export type DiscussionAlert =
  | (Omit<AlertProps, 'Children'> & { message: string })
  | null;

export type MentionSuggestion =
  | {
      tagType: TagType.GROUP_IT_GOV | TagType.GROUP_GRB_REVIEWERS;
      displayName: string;
    }
  | {
      tagType: TagType.USER_ACCOUNT;
      displayName: string;
      id: string;
    };
