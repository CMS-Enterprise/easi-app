import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Dropdown, Label } from '@trussworks/react-uswds';
import classNames from 'classnames';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import FieldGroup from 'components/shared/FieldGroup';
import InitialsIcon from 'components/shared/InitialsIcon';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import contactRoles from 'constants/enums/contactRoles';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import { AttendeeFormFields } from 'types/technicalAssistance';

import './components.scss';

const AttendeeFields = ({
  activeAttendee,
  setActiveAttendee,
  type,
  className
}: {
  activeAttendee: AttendeeFormFields;
  setActiveAttendee: (value: AttendeeFormFields) => void;
  type: 'requester' | 'attendee';
  className?: string;
}) => {
  const { t } = useTranslation('technicalAssistance');
  const { userInfo } = activeAttendee;

  return (
    <div className={classNames('margin-bottom-4', className)}>
      {/* Attendee name */}
      <FieldGroup>
        <Label htmlFor="trbAttendee-name">{t(`attendees.${type}Name`)}</Label>
        <CedarContactSelect
          id="trbAttendee-name"
          name="trbAttendee-name"
          value={userInfo || undefined}
          onChange={cedarContact =>
            cedarContact &&
            setActiveAttendee({
              ...activeAttendee,
              userInfo: cedarContact
            })
          }
        />
      </FieldGroup>
      {/* Attendee component */}
      <FieldGroup>
        <Label htmlFor="trbAttendee-component">
          {t(`attendees.${type}Component`)}
        </Label>
        <Dropdown
          id="trbAttendee-component"
          name="trbAttendee-component"
          value={activeAttendee?.component}
          onChange={e =>
            setActiveAttendee({
              ...activeAttendee,
              component: e.target.value
            })
          }
        >
          <option label={`- ${'Select'} -`} />
          {cmsDivisionsAndOfficesOptions('trbAttendee-component')}
        </Dropdown>
      </FieldGroup>
      {/* Attendee role */}
      <FieldGroup>
        <Label htmlFor="trbAttendee-component">
          {t(`attendees.${type}Role`)}
        </Label>
        <Dropdown
          id="trbAttendee-role"
          name="trbAttendee-role"
          value={activeAttendee?.role}
          onChange={e =>
            setActiveAttendee({
              ...activeAttendee,
              role: e.target.value
            })
          }
        >
          <option label={`- ${'Select'} -`} />
          {contactRoles.map(({ key, label }) => (
            <option key={key} value={key} label={label} />
          ))}
        </Dropdown>
      </FieldGroup>
    </div>
  );
};

const Attendee = ({ attendee }: { attendee: TRBAttendee }) => {
  const { t } = useTranslation();
  const { id, userInfo } = attendee;

  // Delete attendee
  const { deleteAttendee } = useTRBAttendees(attendee.trbRequestId);

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
  const { commonName, euaUserId, email } = userInfo;

  return (
    <li id={`trbAttendee-${euaUserId}`}>
      <InitialsIcon name={commonName} />
      <div>
        <p className="margin-y-05 text-bold">
          {commonName}, {component}
        </p>
        <p className="margin-y-05">{email}</p>
        <p className="margin-top-05 margin-bottom-0">{role}</p>
        <ButtonGroup className="margin-y-0">
          {/* Edit Attendee */}
          <Button type="button" unstyled onClick={() => null}>
            {t('Edit')}
          </Button>
          {/* Remove attendee */}
          <Button
            className="text-error"
            type="button"
            unstyled
            onClick={() => deleteAttendee(id)}
          >
            {t('Remove')}
          </Button>
        </ButtonGroup>
      </div>
    </li>
  );
};

const AttendeesList = ({
  attendees,
  id
}: {
  attendees: TRBAttendee[];
  id: string;
}) => {
  return (
    <ul className="trbAttendees-list usa-list usa-list--unstyled margin-y-3">
      {attendees.map(attendee => (
        <Attendee attendee={attendee} key={attendee.id} />
      ))}
    </ul>
  );
};

export { Attendee, AttendeesList, AttendeeFields };
