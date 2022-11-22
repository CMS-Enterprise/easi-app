import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import {
  Alert,
  Button,
  ButtonGroup,
  Dropdown,
  ErrorMessage,
  FormGroup,
  Label
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import UswdsReactLink from 'components/LinkWrapper';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import InitialsIcon from 'components/shared/InitialsIcon';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import contactRoles from 'constants/enums/contactRoles';
import { PersonRole } from 'types/graphql-global-types';
import {
  AttendeeFieldLabels,
  TRBAttendeeData,
  TRBAttendeeFields
} from 'types/technicalAssistance';

// import { parseAsLocalTime } from 'utils/date';
import { initialAttendee } from '../Attendees';

import './components.scss';

/** Attendee form props */
type AttendeeFieldsProps = {
  /** Fields type */
  type: 'requester' | 'attendee';
  /** Default field values */
  defaultValues: TRBAttendeeData;
  /** Control from useForm hook */
  control: Control<TRBAttendeeFields>;
  /** Field errors object */
  errors: FieldErrors<TRBAttendeeFields>;
  /** setValue function from useForm hook */
  setValue: UseFormSetValue<TRBAttendeeFields>;
  /** Form field labels */
  fieldLabels: AttendeeFieldLabels;
};

const AttendeeFields = ({
  type,
  defaultValues,
  errors,
  control,
  setValue,
  fieldLabels
}: AttendeeFieldsProps) => {
  const { t } = useTranslation('technicalAssistance');

  return (
    <>
      {/* Validation errors summary */}
      {Object.keys(errors).length > 0 && (
        <Alert
          heading={t('basic.errors.checkFix')}
          type="error"
          className="margin-bottom-2"
        >
          {Object.keys(errors).map(fieldName => {
            // Check if error has custom message
            const { message } = errors[fieldName as keyof typeof errors] || {};

            // Error message set by form
            const errorString =
              fieldLabels[fieldName as keyof typeof fieldLabels];

            // If no error message, return null
            if (!errorString || !message) return null;

            // Return error message
            return (
              <ErrorAlertMessage
                key={fieldName}
                errorKey={fieldName}
                message={t(message || errorString)}
              />
            );
          })}
        </Alert>
      )}
      {/* Attendee name */}
      <Controller
        name="euaUserId"
        control={control}
        render={() => {
          // TODO: Error state
          return (
            <FormGroup>
              <Label htmlFor="euaUserId">{t(fieldLabels.euaUserId)}</Label>
              <CedarContactSelect
                id="euaUserId"
                name="euaUserId"
                value={defaultValues.userInfo}
                onChange={cedarContact =>
                  cedarContact && setValue('euaUserId', cedarContact.euaUserId)
                }
                disabled={type === 'requester' || !!defaultValues.id}
              />
            </FormGroup>
          );
        }}
      />
      {/* Attendee component */}
      <Controller
        name="component"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Label htmlFor="component">{t(fieldLabels.component)}</Label>
              {error && (
                <ErrorMessage>{t('basic.errors.makeSelection')}</ErrorMessage>
              )}
              <Dropdown
                id="component"
                data-testid="component"
                {...field}
                ref={null}
              >
                <option label={`- ${t('basic.options.select')} -`} disabled />
                {cmsDivisionsAndOfficesOptions('component')}
              </Dropdown>
            </FormGroup>
          );
        }}
      />
      {/* Attendee role */}
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormGroup error={!!error}>
              <Label htmlFor="role">{t(fieldLabels.role)}</Label>
              {error && (
                <ErrorMessage>{t('basic.errors.makeSelection')}</ErrorMessage>
              )}
              <Dropdown
                id="role"
                data-testid="role"
                {...field}
                ref={null}
                value={(field.value as PersonRole) || ''}
              >
                <option label={`- ${t('basic.options.select')} -`} disabled />
                {contactRoles.map(({ key, label }) => (
                  <option key={key} value={key} label={label} />
                ))}
              </Dropdown>
            </FormGroup>
          );
        }}
      />
    </>
  );
};

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

export { Attendee, AttendeesList, AttendeeFields };
