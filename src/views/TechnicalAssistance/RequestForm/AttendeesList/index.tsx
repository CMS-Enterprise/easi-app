import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconArrowBack } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
// eslint-disable-next-line camelcase
import { CreateTrbRequest_createTRBRequest } from 'queries/types/CreateTrbRequest';

import Breadcrumbs from '../../Breadcrumbs';

interface AttendeesListProps {
  // eslint-disable-next-line camelcase
  request: CreateTrbRequest_createTRBRequest;
  backToFormUrl?: string;
  addExample: () => void;
}

function AttendeesList({
  request,
  backToFormUrl,
  addExample
}: AttendeesListProps) {
  const { t } = useTranslation('technicalAssistance');

  // This is a stub for the attendees list manager
  // with examples to back out or add an attendee

  if (backToFormUrl) {
    return (
      <div className="trb-attendees-list">
        <Breadcrumbs
          items={[
            { text: t('heading'), url: '/trb' },
            { text: t('breadcrumbs.taskList'), url: '/trb/task-list' },
            {
              text: t('requestForm.heading'),
              url: backToFormUrl
            },
            {
              text: t('attendees.addAnAttendee')
            }
          ]}
        />
        <PageHeading>{t('attendees.addAnAttendee')}</PageHeading>

        <div>
          <UswdsReactLink
            variant="unstyled"
            className="usa-button usa-button--outline"
            to={backToFormUrl}
          >
            {t('attendees.cancel')}
          </UswdsReactLink>
          <UswdsReactLink
            variant="unstyled"
            className="usa-button"
            to={backToFormUrl}
            onClick={() => {
              addExample();
            }}
          >
            {t('attendees.addAttendee')}
          </UswdsReactLink>
        </div>
        <div className="margin-top-2">
          <UswdsReactLink to={backToFormUrl}>
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('attendees.dontAddAndReturn')}
          </UswdsReactLink>
        </div>
      </div>
    );
  }

  return null;
}

export default AttendeesList;
