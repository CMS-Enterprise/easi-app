const subNavItems = (systemId: string) => [
  {
    route: `/governance-review-team/${systemId}/intake-request`,
    text: 'general:intake',
    aria: 'aria.openIntake'
  },
  {
    route: `/governance-review-team/${systemId}/documents`,
    text: 'intake:documents.uploadedDocuments',
    aria: 'aria.openDocuments'
  },
  {
    route: `/governance-review-team/${systemId}/business-case`,
    text: 'general:businessCase',
    aria: 'aria.openBusiness'
  },
  {
    route: `/governance-review-team/${systemId}/decision`,
    text: 'decision.title',
    aria: 'aria.openDecision'
  },
  {
    route: `/governance-review-team/${systemId}/lcid`,
    text: 'lifecycleID.title',
    aria: 'aria.openLcid',
    groupEnd: true
    // Value used to designate end of sidenav subgrouping / border-bottom
  },
  {
    route: `/governance-review-team/${systemId}/actions`,
    text: 'actions'
  },
  {
    route: `/governance-review-team/${systemId}/notes`,
    text: 'notes.heading'
  },
  {
    route: `/governance-review-team/${systemId}/dates`,
    text: 'dates.heading'
  }
];

export default subNavItems;
