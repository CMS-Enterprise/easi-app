export type ArticleTypeProps = 'Section 508' | 'IT Governance';

export type ArticleRouteProps = {
  type: ArticleTypeProps;
  route: string;
};

export type ArticleProps = {
  route: string;
  type: ArticleTypeProps;
  translation: string;
};
