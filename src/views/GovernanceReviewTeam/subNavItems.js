const subNavItems = [
  {
    route: `intake-request`,
    text: 'general:intake',
    aria: 'aria.openIntake'
  },
  {
    route: `business-case`,
    text: 'general:businessCase',
    aria: 'aria.openBusiness'
  },
  {
    route: `decision`,
    text: 'decision.title',
    aria: 'aria.openDecision'
  },
  {
    route: `lcid`,
    text: 'lifecycleID.title',
    aria: 'aria.openLcid',
    groupEnd: true
    // Value used to designate end of sidenav subgrouping / border-bottom
  },
  {
    route: `actions`,
    text: 'actions'
  },
  {
    route: `notes`,
    text: 'notes.heading'
  },
  {
    route: `dates`,
    text: 'dates.heading'
  }
];

export default subNavItems;
