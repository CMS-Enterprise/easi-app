export type ArticleProps = {
  route: string;
  type: 'Section 508' | 'IT Governance';
  translation: string;
};

// Section 508 Articles
const section508Articles: ArticleProps[] = [
  {
    route: '/section-508/steps-involved', // route for hitting rendered article component
    type: 'Section 508', // Used for tagging of article
    translation: 'accessibility' // Should reference the translation used to index the title and description for cards
  }
];

export default section508Articles;
