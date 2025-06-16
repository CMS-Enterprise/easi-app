import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import CollapsableLink from 'components/CollapsableLink';
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
      <div className="tablet:grid-col-8">
        <h2 className="font-heading-xl margin-bottom-2">{t('stepsHeading')}</h2>

        <GovProcessCollapse className="margin-bottom-1 text-bold" />

        <ProcessList className="margin-top-2 border-bottom border-bottom-width-1px border-base-lighter margin-bottom-4">
          {processSteps
            .filter((_, i) => i < 2)
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
        <ProcessList
          className="easi-governance-overview__governance-steps margin-top-2 border-bottom border-bottom-width-1px border-base-lighter margin-bottom-4"
          start={3}
        >
          {processSteps
            .filter((_, i) => i > 1 && i < 6)
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
        <ProcessList
          className="easi-governance-overview__governance-steps"
          start={7}
        >
          {processSteps
            .filter((_, i) => i > 5)
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
    </div>
  );
};

export default GovernanceOverviewContent;
