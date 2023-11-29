const grtActions = {
  'not-it-request': {
    heading: 'Not an IT governance request',
    view: 'grt-submit-action-view'
  },
  'need-biz-case': {
    heading: 'Request a draft business case',
    view: 'grt-submit-action-view'
  },
  'provide-feedback-need-biz-case': {
    heading: 'Provide GRT Feedback and progress to business case',
    view: 'provide-feedback-biz-case'
  },
  'provide-feedback-keep-draft': {
    heading: 'Provide GRT feedback and keep working on draft business case',
    view: 'provide-feedback-biz-case'
  },
  'provide-feedback-need-final': {
    heading: 'Provide GRT feedback and request final business case for GRB',
    view: 'provide-feedback-biz-case'
  },
  'ready-for-grt': {
    heading: 'Mark as ready for GRT',
    view: 'grt-submit-action-view'
  },
  'ready-for-grb': {
    heading: 'Mark as ready for GRB',
    view: 'ready-for-grb'
  },
  'biz-case-needs-changes': {
    heading: 'Business case needs changes and is not ready for GRT',
    view: 'grt-submit-action-view'
  },
  'no-governance': {
    heading: 'Close project',
    view: 'grt-submit-action-view'
  },
  'send-email': {
    heading: 'Send email',
    view: 'grt-submit-action-view'
  },
  'guide-received-close': {
    heading: 'Decomission guide received. Close the request',
    view: 'grt-submit-action-view'
  },
  'not-responding-close': {
    heading: 'Project team not responding. Close the request',
    view: 'grt-submit-action-view'
  },
  'issue-lcid': {
    heading: 'Approve request and issue Life Cycle ID',
    view: 'issue-lcid'
  },
  'extend-lcid': {
    heading: 'Extend Life Cycle ID',
    view: 'extend-lcid'
  },
  'not-approved': {
    heading: 'Business case not approved',
    view: 'not-approved'
  }
};

export default grtActions;
