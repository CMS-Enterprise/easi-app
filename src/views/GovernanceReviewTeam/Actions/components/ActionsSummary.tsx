import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import './ActionsSummary.scss';

export type ActionsSummaryProps = {
  heading: string;
  items: { title: string; description: string }[];
  className?: string;
};

const ListItem = ({
  title,
  description
}: {
  title: string;
  description: string;
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <dt className="display-inline text-bold margin-right-05">{t(title)}:</dt>
      <dd className="display-inline margin-0">{t(description)}</dd>
    </div>
  );
};

const ActionsSummary = ({ heading, items, className }: ActionsSummaryProps) => {
  const { t } = useTranslation();
  return (
    <SummaryBox className={classNames('grt-actions-summary', className)}>
      <SummaryBoxHeading headingLevel="h3">{t(heading)}</SummaryBoxHeading>
      <SummaryBoxContent>
        <dl title={t(heading)} className="usa-list">
          {items.map(item => (
            <ListItem
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </dl>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default ActionsSummary;
