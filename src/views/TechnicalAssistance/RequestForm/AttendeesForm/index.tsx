import React, { useRef } from 'react';
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
  activeAttendee: AttendeeFormFields;
  setActiveAttendee: (value: AttendeeFormFields) => void;
}

function AttendeesForm({
  request,
  backToFormUrl,
  activeAttendee,
  setActiveAttendee
}: AttendeesFormProps) {
  const { t } = useTranslation('technicalAssistance');

  /** Initial attendee values before form values are updated */
  const initialValues = useRef(activeAttendee).current;

  // Attendee mutations
  const { createAttendee, updateAttendee } = useTRBAttendees(request.id);

  /** Create or update attendee with field values */
  const onSubmit = () => {
    /** Attendee component and role */
    const input = {
      component: activeAttendee.component,
      role: activeAttendee.role as PersonRole
    };
    // If editing attendee, add ID to input and update attendee
    if (initialValues.id) {
      updateAttendee({
        ...input,
        id: initialValues.id
      });
    } else {
      // If creating attendee, add EUA and TRB request id and create attendee
      createAttendee({
        ...input,
        trbRequestId: request.id,
        euaUserId: activeAttendee.userInfo?.euaUserId || ''
      });
    }
  };

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
              text: t(
                initialValues.id
                  ? 'attendees.editAttendee'
                  : 'attendees.addAnAttendee'
              )
            }
          ]}
        />
        <PageHeading>
          {t(
            initialValues.id
              ? 'attendees.editAttendee'
              : 'attendees.addAnAttendee'
          )}
        </PageHeading>

        <AttendeeFields
          activeAttendee={activeAttendee}
          setActiveAttendee={setActiveAttendee}
          type={initialValues.id ? 'edit' : 'create'}
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
            onClick={() => onSubmit()}
          >
            {t(initialValues.id ? 'Save' : 'attendees.addAttendee')}
          </UswdsReactLink>
        </div>
        <div className="margin-top-2">
          <UswdsReactLink to={backToFormUrl}>
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t(
              initialValues.id
                ? 'attendees.dontEditAndReturn'
                : 'attendees.dontAddAndReturn'
            )}
          </UswdsReactLink>
        </div>
      </div>
    );
  }

  return null;
}

export default AttendeesForm;
