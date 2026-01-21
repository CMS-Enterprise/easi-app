import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/DescriptionGroup';
import Tag from 'components/Tag';

export type ATOActivity = {
  id: string;
  title: string;
  status: 'Completed' | 'In progress' | 'Not started';
  activityOwner: string;
  dueDate: string;
};

/**
 * Process list component for ATO activities
 *
 * NOTE: This is not currently in use - component is hidden behind a feature flag
 * on ATO page and activities field has not yet been implemented in the schema
 */
const ATOProcessList = ({ activities }: { activities: ATOActivity[] }) => {
  const { t } = useTranslation('systemProfile');

  return (
    <ProcessList>
      {activities.map(act => (
        <ProcessListItem key={act.id}>
          <ProcessListHeading
            type="h4"
            className="easi-header__basic flex-align-start"
          >
            <div className="margin-0 font-body-lg">Start a process</div>
            <div className="text-right margin-bottom-0">
              <Tag
                className={classNames('font-body-md', 'margin-bottom-1', {
                  'bg-success-dark text-white': act.status === 'Completed',
                  'bg-warning': act.status === 'In progress',
                  'bg-white text-base border-base border-2px':
                    act.status === 'Not started'
                })}
              >
                {act.status}
              </Tag>
              <h5 className="text-normal margin-y-0 text-base-dark">
                {act.status === 'Completed'
                  ? t('singleSystem.ato.completed')
                  : t('singleSystem.ato.due')}
                {act.dueDate}
              </h5>
            </div>
          </ProcessListHeading>
          <DescriptionTerm term={t('singleSystem.ato.activityOwner')} />
          <DescriptionDefinition
            className="line-height-body-3 font-body-md margin-bottom-0"
            definition={act.activityOwner}
          />
        </ProcessListItem>
      ))}
    </ProcessList>
  );
};

export default ATOProcessList;
