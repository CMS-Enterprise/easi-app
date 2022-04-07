export type ArticleTypeProps = 'Section 508' | 'IT Governance';

export type ArticleProps = {
  route: string;
  type: ArticleTypeProps;
  translation: string;
};
