import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconArrowBack } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
// eslint-disable-next-line camelcase
import { CreateTrbRequest_createTRBRequest } from 'queries/types/CreateTrbRequest';

import Breadcrumbs from '../../Breadcrumbs';

interface AttendeesFormProps {
  // eslint-disable-next-line camelcase
  request: CreateTrbRequest_createTRBRequest;
  backToFormUrl?: string;
}

function AttendeesForm({ request, backToFormUrl }: AttendeesFormProps) {
  const { t } = useTranslation('technicalAssistance');

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
          {/* Cancel */}
          <UswdsReactLink
            variant="unstyled"
            className="usa-button usa-button--outline"
            to={backToFormUrl}
          >
            {t('attendees.cancel')}
          </UswdsReactLink>
          {/* Add Attendee */}
          <UswdsReactLink
            variant="unstyled"
            className="usa-button"
            to={backToFormUrl}
            onClick={() => null}
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

export default AttendeesForm;
