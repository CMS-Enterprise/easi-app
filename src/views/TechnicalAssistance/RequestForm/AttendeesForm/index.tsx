import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconArrowBack } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import useTRBAttendees from 'hooks/useTRBAttendees';
// eslint-disable-next-line camelcase
import { CreateTrbRequest_createTRBRequest } from 'queries/types/CreateTrbRequest';
import { PersonRole } from 'types/graphql-global-types';
import { AttendeeFormFields } from 'types/technicalAssistance';

import Breadcrumbs from '../../Breadcrumbs';

import { AttendeeFields } from './components';

interface AttendeesFormProps {
  // eslint-disable-next-line camelcase
  request: CreateTrbRequest_createTRBRequest;
  backToFormUrl?: string;
}

const initialAttendee: AttendeeFormFields = {
  id: '',
  trbRequestId: '',
  userInfo: null,
  component: '',
  role: ''
};

function AttendeesForm({ request, backToFormUrl }: AttendeesFormProps) {
  const { t } = useTranslation('technicalAssistance');
  const [activeAttendee, setActiveAttendee] = useState<AttendeeFormFields>({
    ...initialAttendee,
    trbRequestId: request.id
  });

  // Create attendee
  const { createAttendee } = useTRBAttendees(request.id);

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

        <AttendeeFields
          activeAttendee={activeAttendee}
          setActiveAttendee={setActiveAttendee}
          type="attendee"
        />

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
            onClick={() =>
              createAttendee({
                trbRequestId: request.id,
                euaUserId: activeAttendee.userInfo?.euaUserId || '',
                component: activeAttendee.component,
                role: activeAttendee.role as PersonRole
              })
            }
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
