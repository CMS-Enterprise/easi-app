// IT Governance Articles
const itGovernanceArticles = [
  {
    route: '/it-governance/prepare-for-grt', // route for hitting rendered article component
    type: 'IT Governance', // Used for tagging of article
    translation: 'governanceReviewTeam' // Should reference the translation used to index the title and description for cards
  },
  {
    route: '/it-governance/prepare-for-grb',
    type: 'IT Governance',
    translation: 'governanceReviewBoard'
  },
  {
    route: '/it-governance/sample-business-case',
    type: 'IT Governance',
    translation: 'sampleBusinessCase'
  },
  {
    route: '/it-governance/steps-overview/new-system',
    type: 'IT Governance',
    translation: 'newSystem'
  }
] as const;

export default itGovernanceArticles;
