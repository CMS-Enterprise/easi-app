import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import { Button, ButtonGroup, Dropdown, Label } from '@trussworks/react-uswds';
import classNames from 'classnames';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import UswdsReactLink from 'components/LinkWrapper';
import FieldGroup from 'components/shared/FieldGroup';
import InitialsIcon from 'components/shared/InitialsIcon';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import contactRoles from 'constants/enums/contactRoles';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import { PersonRole } from 'types/graphql-global-types';
import { AttendeeFormFields } from 'types/technicalAssistance';
import { parseAsLocalTime } from 'utils/date';

import { initialAttendee } from '../Attendees';

import './components.scss';

type AttendeeFieldsProps = {
  activeAttendee: AttendeeFormFields;
  setActiveAttendee: (value: AttendeeFormFields) => void;
  type: 'requester' | 'create' | 'edit';
  className?: string;
};

const AttendeeFields = ({
  activeAttendee,
  setActiveAttendee,
  type,
  className
}: AttendeeFieldsProps) => {
  const { t } = useTranslation('technicalAssistance');
  const { userInfo } = activeAttendee;

  return (
    <div className={classNames('margin-bottom-4', className)}>
      {/* Attendee name */}
      <FieldGroup>
        <Label htmlFor="trbAttendee-name">
          {t(`attendees.fieldLabels.${type}.name`)}
        </Label>
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
          // If editing attendee or requester, disable field
          disabled={!(type === 'create')}
        />
      </FieldGroup>
      {/* Attendee component */}
      <FieldGroup>
        <Label htmlFor="trbAttendee-component">
          {t(`attendees.fieldLabels.${type}.component`)}
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
          {t(`attendees.fieldLabels.${type}.role`)}
        </Label>
        <Dropdown
          id="trbAttendee-role"
          name="trbAttendee-role"
          value={activeAttendee?.role || undefined}
          onChange={e =>
            setActiveAttendee({
              ...activeAttendee,
              role: e.target.value as PersonRole
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

type AttendeeProps = {
  attendee: TRBAttendee;
  setActiveAttendee?: (activeAttendee: AttendeeFormFields) => void;
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
  attendees: TRBAttendee[];
  id: string;
  setActiveAttendee: (activeAttendee: AttendeeFormFields) => void;
};

const AttendeesList = ({
  attendees,
  id,
  setActiveAttendee
}: AttendeesListProps) => {
  // Delete attendee
  const { deleteAttendee } = useTRBAttendees(id);

  return (
    <ul className="trbAttendees-list usa-list usa-list--unstyled margin-y-3">
      {[...attendees]
        // Sort attendees by time created
        .sort(
          (a, b) =>
            parseAsLocalTime(b.createdAt) - parseAsLocalTime(a.createdAt)
        )
        .map(attendee => (
          <Attendee
            attendee={attendee}
            deleteAttendee={() => {
              deleteAttendee(attendee.id);
              setActiveAttendee({ ...initialAttendee, trbRequestId: id });
            }}
            setActiveAttendee={setActiveAttendee}
            key={attendee.id}
          />
        ))}
    </ul>
  );
};

export { Attendee, AttendeesList, AttendeeFields };
