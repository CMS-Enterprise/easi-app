const subNavItems = [
  {
    page: `intake-request`,
    text: 'general:intake',
    aria: 'aria.openIntake'
  },
  {
    page: `business-case`,
    text: 'general:businessCase',
    aria: 'aria.openBusiness'
  },
  {
    page: `decision`,
    text: 'decision.title',
    aria: 'aria.openDecision'
  },
  {
    page: `lcid`,
    text: 'lifecycleID.title',
    aria: 'aria.openLcid',
    groupEnd: true
    // if true, then a bottom border is added to the list item
  },
  {
    page: `actions`,
    text: 'actions'
  },
  {
    page: `notes`,
    text: 'notes.heading'
  },
  {
    page: `dates`,
    text: 'dates.heading'
  }
];

export default subNavItems;
