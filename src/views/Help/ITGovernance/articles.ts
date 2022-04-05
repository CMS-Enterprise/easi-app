export type ArticleProps = {
  route: string;
  type: 'Section 508' | 'IT Governance';
  translation: string;
};

// IT Governance Articles
const itGovernanceArticles: ArticleProps[] = [
  {
    route: '/it-governance/prepare-for-grt', // route for hitting rendered article component
    type: 'IT Governance', // Used for tagging of article
    translation: 'governanceReviewTeam' // Should reference the translation used to index the title and description for cards
  }
];

export default itGovernanceArticles;
