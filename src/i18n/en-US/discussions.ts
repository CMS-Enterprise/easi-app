import {
  SystemIntakeGRBDiscussionBoardType,
  TagType
} from 'gql/generated/graphql';

const tags: Record<Exclude<TagType, TagType.USER_ACCOUNT>, string> = {
  [TagType.GROUP_GRB_REVIEWERS]: 'Governance Review Board (GRB)',
  [TagType.GROUP_IT_GOV]: 'Governance Admin Team',
  [TagType.REQUESTER]: 'Requester'
};

const discussionBoardType: Record<SystemIntakeGRBDiscussionBoardType, string> =
  {
    [SystemIntakeGRBDiscussionBoardType.INTERNAL]:
      'Internal GRB discussion board',
    [SystemIntakeGRBDiscussionBoardType.PRIMARY]: 'Primary discussion board'
  };

const discussions = {
  // TODO: We need to make a decision on how to structure these translations:
  //         - Do we want a generic i18n file at all?
  //         - Should some board specific stuff be stored in their respective i18n files? (e.g. name of the board, participants, role type translations, etc. in grbReview.ts)
  //         - I tried to make the general section as generic as possible (obviously lol) but some of it may make the frontend overly complicated, open to any recommendations

  general: {
    cancel: 'Cancel', // TODO: this is in other i18n files, move to general.ts?
    label: 'Discussions',
    discussion: 'Discussion',
    mostRecentActivity: 'Most recent activity',
    newTopics: '{{count}} new discussion topic',
    newTopics_plural: '{{count}} new discussion topics',
    discussedTopics: '{{count}} discussion with replies',
    discussedTopics_plural: '{{count}} discussions with replies',
    fieldsMarkedRequired:
      'Fields marked with an asterisk (<asterisk />) are required.', // TODO: this is in other i18n files, move to general.ts?
    discussionsWithoutReplies: '{{count}} discussion without replies',
    discussionsWithoutReplies_plural: '{{count}} discussions without replies',
    readMore: 'Read more', // TODO: this is in other i18n files, move to general.ts?
    repliesInDiscussion: '{{count}} reply in this discussion',
    repliesInDiscussion_plural: '{{count}} replies in this discussion',
    repliesCount: '{{count}} reply',
    repliesCount_plural: '{{count}} replies',
    reply: 'Reply',
    lastReply: 'Last reply {{date}} at {{time}}',
    hideReplies: 'Hide replies',
    showReplies: 'Show replies',

    startNewDiscussion: 'Start a new discussion',

    view: 'View', // TODO: this is in other i18n files, move to general.ts?
    viewDiscussionBoard: 'View discussion board',

    viewMore: 'View more {{type}}',
    viewLess: 'View less {{type}}',

    alerts: {
      noDiscussionsStarted:
        'There are no discussions yet. When a discussion topic is started, it will appear here.',
      noDiscussionsRepliedTo:
        'There are no discussions yet. When a discussion topic is replied to, it will appear here.',
      noDiscussions: 'There are not yet any discussions.',
      noDiscussionsStartButton:
        'There are not yet any discussions. <button>Start a discussion</button>.',
      replyError:
        'There was an issue with adding your reply, please try again.',
      replySuccess: 'Success! Your reply has been added.',
      saveDiscussion:
        'When you save your discussion, the selected team(s) and individual(s) will be notified via email.',
      startDiscussionError:
        'There was an issue with adding to the discussion board, please try again.',
      startDiscussionSuccess:
        'You have successfully added to the discussion board.'
    },

    startDiscussion: {
      heading: 'Start a discussion',
      description_PRIMARY:
        'Have a question or comment that you want to discuss with the requester, project team, or other individuals involved in this request?  Start a discussion and you’ll be notified when they reply. ',
      description_INTERNAL:
        'Have a question or comment that you want to discuss internally with the Governance Admin Team or other Governance Review Board (GRB) members involved in this request? Start a discussion and you’ll be notified when they reply.'
    },

    discussionForm: {
      contentLabel_discussion: 'Type your question or discussion topic',
      contentLabel_reply: 'Type your reply',
      helpText_PRIMARY:
        'To tag an individual or team, type "@" and select the individual or group you wish to notify. You may begin typing the group name or individual’s name if you do not see it in the list.',
      helpText_INTERNAL:
        'To tag an individual or team, type "@" and select the individual or group you wish to notify. You may begin typing the group name or individual’s name if you do not see it in the list. In this discussion board, you are only able to tag GRB reviewers or Governance Admin Team members.',
      save: 'Save {{type}}',
      modal: {
        heading_discussion: 'Are you sure you want to start this discussion?',
        heading_reply: 'Are you sure you want to reply to this discussion?',
        discussionBoard: 'Discussion board'
      }
    },

    usageTips: {
      label: 'Tips for using the discussion boards',
      content: [
        'Start a new discussion thread for each new topic',
        'Ask questions in the primary discussion board as often as possible when appropriate, especially if there may be input needed from the project team',
        'Use tags (@) any time you need input from a specific individual or group. Group tags will notify all members of that group. Available group tags: <span>@Governance Review Board</span>, <span>@Governance Admin Team</span>, and <span>@Requester</span>.',
        'Participating individuals will get an email notification when a new discussion is started, or when they are tagged in a discussion or reply'
      ]
    }
  },

  summaryCard: {
    title:
      '<span>Discussions summary:</span> {{count}} total discussions ({{withoutReplies}} without replies)',
    jumpToDiscussions: 'Jump to discussions'
  },

  // discussion text area tags
  tags,

  // Discussion board type labels
  discussionBoardType,

  // Board Specific Translations
  governanceReviewBoard: {
    discussionsDescription:
      'Use the discussion boards below to discuss this project. The internal GRB discussion board is a space for the Governance Admin Team and GRB members to discuss privately; the project team will not be able to view discussions there. The primary discussion board is open to all participating in this GRB review.',
    visibility_INTERNAL: 'Visibility restricted',
    visibility_PRIMARY: 'Not restricted',

    description_PRIMARY:
      'Use this discussion board to ask questions or have discussions with the requester and project team, Governance Admin Team, and other Governance Review Board (GRB) members.',
    description_INTERNAL:
      'Use this discussion board to ask questions or have discussions with the Governance Admin Team and other Governance Review Board (GRB) members. The conversations here are not visible to the Project team.',

    discussionsSharedWith:
      'All discussions and replies in this discussion board will be shared with:'
  },

  taskList: {
    noDiscussions: 'There are not yet any discussions for this review.',
    noDiscussions_AWAITING_DECISION:
      'There were no discussions during this review.',
    discussionsCount:
      '<0>{{discussionsWithoutRepliesCount}}</0> discussions without replies, <1>{{count}}</1> discussions total'
  }
};

export default discussions;
