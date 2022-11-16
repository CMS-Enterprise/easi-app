import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import InitialsIcon from 'components/shared/InitialsIcon';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import contactRoles from 'constants/enums/contactRoles';
import { TRBAttendeeData } from 'types/technicalAssistance';

// import { parseAsLocalTime } from 'utils/date';
import { initialAttendee } from '../Attendees';

import './components.scss';

type AttendeeProps = {
  attendee: TRBAttendeeData;
  setActiveAttendee?: (activeAttendee: TRBAttendeeData) => void;
  deleteAttendee?: () => void;
};

const Attendee = ({
  attendee,
  setActiveAttendee,
  deleteAttendee
}: AttendeeProps) => {
  const { t } = useTranslation();
  const { userInfo } = attendee;
  const { url } = useRouteMatch();

  // Get role label from enum value
  const role =
    contactRoles.find(contactRole => contactRole.key === attendee.role)
      ?.label || '';

  // Get component acronym
  const component = cmsDivisionsAndOffices.find(
    ({ name }) => name === attendee.component
  )?.acronym;

  // If attendee is not found in CEDAR, return null
  if (!userInfo) return null;

  // Attendee name, EUA, and email from CEDAR user info
  const { email, commonName, euaUserId } = userInfo;

  return (
    <li id={`trbAttendee-${euaUserId}`}>
      <InitialsIcon name={commonName} />
      <div>
        <p className="margin-y-05 text-bold">
          {commonName}, {component}
        </p>
        <p className="margin-y-05">{email}</p>
        <p className="margin-top-05 margin-bottom-0">{role}</p>
        {/* Attendee actions */}
        {(setActiveAttendee || deleteAttendee) && (
          <ButtonGroup className="margin-y-0">
            {/* Edit Attendee */}
            {setActiveAttendee && (
              <UswdsReactLink
                variant="unstyled"
                onClick={() => setActiveAttendee(attendee)}
                to={`${url}/list`}
              >
                {t('Edit')}
              </UswdsReactLink>
            )}
            {/* Remove attendee */}
            {deleteAttendee && (
              <Button
                className="text-error"
                type="button"
                unstyled
                onClick={() => deleteAttendee()}
              >
                {t('Remove')}
              </Button>
            )}
          </ButtonGroup>
        )}
      </div>
    </li>
  );
};

type AttendeesListProps = {
  attendees: TRBAttendeeData[];
  id: string;
  setActiveAttendee: (activeAttendee: TRBAttendeeData) => void;
  deleteAttendee: (id: string) => void;
};

const AttendeesList = ({
  attendees,
  id,
  setActiveAttendee,
  deleteAttendee
}: AttendeesListProps) => {
  if (attendees.length < 1) return null;
  // console.log(attendees);
  return (
    <ul className="trbAttendees-list usa-list usa-list--unstyled margin-y-3">
      {[...attendees]
        // TODO: Fix sort attendees by time created
        // .sort(
        //   (a, b) =>
        //     parseAsLocalTime(b.createdAt) - parseAsLocalTime(a.createdAt)
        // )
        .map(attendee => (
          <Attendee
            attendee={attendee}
            deleteAttendee={() => {
              if (attendee.id) {
                deleteAttendee(attendee.id);
                setActiveAttendee({ ...initialAttendee, trbRequestId: id });
              }
            }}
            setActiveAttendee={setActiveAttendee}
            key={attendee.id}
          />
        ))}
    </ul>
  );
};

export { Attendee, AttendeesList };
