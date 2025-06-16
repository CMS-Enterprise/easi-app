import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import CollapsableLink from 'components/CollapsableLink';
import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import { ArticleComponentProps } from 'types/articles';

type processStepProps = {
  heading: string;
  content: string;
  link?: { text: string; path: string };
};

const GovProcessCollapse = ({ className }: { className?: string }) => {
  const { t } = useTranslation('governanceOverview');
  return (
    <CollapsableLink
      className={className}
      id="GovernanceOverview-WhyGovernanceExists"
      label={t('governanceOverview:processExists:heading')}
    >
      <>
        {t('processExists.subheading')}
        <ul className="margin-bottom-0 margin-top-1 padding-left-205 line-height-body-5">
          {(
            t('processExists.listItems', {
              returnObjects: true
            }) as string[]
          ).map(item => {
            return <li key={item}>{item}</li>;
          })}
        </ul>
      </>
    </CollapsableLink>
  );
};

const GovernanceOverviewContent = ({
  helpArticle,
  className
}: ArticleComponentProps) => {
  const { t } = useTranslation('governanceOverview');
  const processSteps: processStepProps[] = t('steps', {
    returnObjects: true
  });
  return (
    <div className={classNames('governance-overview__content', className)}>
      <div className="bg-base-lightest padding-2 margin-bottom-6">
        <p className="margin-0">{t('info.intro')}</p>
        <ul className="padding-left-205">
          {(
            t('info.listItems', {
              returnObjects: true
            }) as string[]
          ).map(item => (
            <li className="line-height-sans-4" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <p className="margin-0">{t('info.timeline')}</p>
      </div>
      <div className="tablet:grid-col-6">
        <h2 className="font-heading-xl margin-bottom-2">{t('stepsHeading')}</h2>
        {helpArticle && <GovProcessCollapse className="margin-bottom-1" />}
        <ProcessList className="margin-top-2">
          {processSteps
            .filter((step, i) => i < 2)
            .map(step => {
              return (
                <ProcessListItem key={step.heading}>
                  <ProcessListHeading type="h3">
                    {step.heading}
                  </ProcessListHeading>
                  <p className="margin-bottom-1">{step.content}</p>
                  {helpArticle && step.link && (
                    <UswdsReactLink to={step.link.path} target="_blank">
                      {step.link.text}
                    </UswdsReactLink>
                  )}
                </ProcessListItem>
              );
            })}
        </ProcessList>
        <Divider className="margin-bottom-3" />
        <ProcessList
          className="easi-governance-overview__governance-steps"
          start={3}
        >
          {processSteps
            .filter((step, i) => i > 1)
            .map(step => {
              return (
                <ProcessListItem key={step.heading}>
                  <ProcessListHeading type="h3">
                    {step.heading}
                  </ProcessListHeading>
                  <p className="margin-bottom-1">{step.content}</p>
                  {step.link && (
                    <UswdsReactLink to={step.link.path} target="_blank">
                      {step.link.text}
                    </UswdsReactLink>
                  )}
                </ProcessListItem>
              );
            })}
        </ProcessList>
      </div>
      {!helpArticle && (
        <div className="margin-bottom-7">
          <GovProcessCollapse />
        </div>
      )}
    </div>
  );
};

export default GovernanceOverviewContent;
