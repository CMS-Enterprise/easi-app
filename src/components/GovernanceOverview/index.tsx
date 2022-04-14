import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import Divider from 'components/shared/Divider';

type processStepProps = {
  heading: string;
  content: string;
  link?: { text: string; path: string };
};

type processListProps = {
  steps: processStepProps[];
  className?: string;
  start?: number;
};

const GovernanceOverviewContent = ({
  helpArticle,
  className
}: {
  helpArticle?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation('governanceOverview');
  const processSteps: processStepProps[] = t('steps', {
    returnObjects: true
  });
  const GovProcessCollapse = ({ className }: { className?: string }) => {
    return (
      <CollapsableLink
        className={className}
        id="GovernanceOverview-WhyGovernanceExists"
        label={t('governanceOverview:processExists:heading')}
      >
        <>
          {t('processExists.subheading')}
          <ul className="margin-bottom-0 margin-top-1 padding-left-205 line-height-body-5">
            {(t('processExists.listItems', {
              returnObjects: true
            }) as string[]).map(item => {
              return <li key={item}>{item}</li>;
            })}
          </ul>
        </>
      </CollapsableLink>
    );
  };
  const GovProcessList = ({ steps, className, start }: processListProps) => {
    return (
      <ProcessList className={className} start={start}>
        {steps.map(step => {
          return (
            <ProcessListItem key={step.heading}>
              <ProcessListHeading type="h3">{step.heading}</ProcessListHeading>
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
    );
  };
  return (
    <div className={classNames('governance-overview__content', className)}>
      <div
        className={`overflow-hidden padding-y-1${
          helpArticle && ' bg-base-lightest padding-x-2 margin-bottom-6'
        }`}
      >
        <p>{t('info.intro')}</p>
        <ul className="padding-left-205">
          {(t('info.listItems', {
            returnObjects: true
          }) as string[]).map(item => (
            <li className="margin-y-1" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <p>{t('info.timeline')}</p>
      </div>
      <div className="tablet:grid-col-6">
        <h2 className="font-heading-xl margin-bottom-2">{t('stepsHeading')}</h2>
        {helpArticle && <GovProcessCollapse className="margin-bottom-1" />}
        <GovProcessList
          className="margin-top-2"
          steps={processSteps.filter((step, i) => i < 2)}
        />
        <Divider className="margin-bottom-3" />
        <GovProcessList
          className="easi-governance-overview__governance-steps"
          steps={processSteps.filter((step, i) => i > 1)}
          start={3}
        />
      </div>
      {!helpArticle && <GovProcessCollapse className="margin-bottom-7" />}
    </div>
  );
};

export default GovernanceOverviewContent;
