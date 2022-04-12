import React from 'react';
import classnames from 'classnames';

import HelpTag from 'components/HelpTag';
import PageHeading from 'components/PageHeading';
import { ArticleTypeProps } from 'types/articles';

type HelpPageIntroProps = {
  className?: string;
  heading: string | React.ReactNode;
  subheading?: string | React.ReactNode;
  type?: ArticleTypeProps;
};

export default function HelpPageIntro({
  className,
  heading,
  subheading,
  type
}: HelpPageIntroProps) {
  return (
    <div className={classnames('help-page-intro margin-bottom-4', className)}>
      <PageHeading className="margin-bottom-0 margin-top-3">
        {heading}
      </PageHeading>
      {type && <HelpTag type={type} className="margin-y-1" />}
      {subheading && (
        <div className="font-body-lg margin-top-1 margin-bottom-0 line-height-body-5">
          {subheading}
        </div>
      )}
    </div>
  );
}
