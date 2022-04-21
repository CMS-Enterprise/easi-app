import { ArticleProps } from 'types/articles';

// Section 508 Articles
const section508Articles: ArticleProps[] = [
  {
    route: '/section-508/steps-involved', // route for hitting rendered article component
    type: 'Section 508', // Used for tagging of article
    translation: 'stepsInvolved508' // Should reference the translation used to index the title and description for cards
  },
  {
    route: '/section-508/templates-for-508-testing', // route for hitting rendered article component
    type: 'Section 508', // Used for tagging of article
    translation: 'templatesFor508Testing' // Should reference the translation used to index the title and description for cards
  }
];

export default section508Articles;
