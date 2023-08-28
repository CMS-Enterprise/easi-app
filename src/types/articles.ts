export type ArticleTypeProps = 'IT Governance' | 'Technical Review Board';

export type ArticleProps = {
  route: string;
  type: ArticleTypeProps;
  translation: string;
};

export type ArticleRouteProps = {
  type: string;
  route: string;
};

export type ArticleComponentProps = {
  helpArticle?: boolean;
  className?: string;
};
