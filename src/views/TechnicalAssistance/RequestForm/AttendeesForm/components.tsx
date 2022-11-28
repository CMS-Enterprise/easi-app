import React, { useMemo } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormSetValue
} from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';
import { Column, usePagination, useTable } from 'react-table';
import {
  Alert,
  Button,
  ButtonGroup,
  Dropdown,
  ErrorMessage,
  FormGroup,
  Grid,
  Label,
  Link,
  Table
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import UswdsReactLink from 'components/LinkWrapper';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import HelpText from 'components/shared/HelpText';
import InitialsIcon from 'components/shared/InitialsIcon';
import TablePagination from 'components/TablePagination';
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
  /** Sets the default values for the form */
  activeAttendee: TRBAttendeeData;
  /** Control from useForm hook */
  control: Control<TRBAttendeeFields>;
  /** Field errors object */
  errors: FieldErrors<TRBAttendeeFields>;
  /** Clear form errors */
  clearErrors: UseFormClearErrors<TRBAttendeeFields>;
  /** setValue function from useForm hook */
  setValue: UseFormSetValue<TRBAttendeeFields>;
  /** Form field labels */
  fieldLabels: AttendeeFieldLabels;
};

/**
 * Reusable component that displays TRB attendee fields
 *
 * Used in TRB requester and additional attendee forms
 * */
const AttendeeFields = ({
  type,
  activeAttendee,
  errors,
  clearErrors,
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
          heading={t('errors.checkFix')}
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
      <Grid row className="margin-bottom-5">
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          {/* Attendee name */}
          <Controller
            name="euaUserId"
            control={control}
            render={({ fieldState: { error } }) => {
              return (
                <FormGroup error={!!error}>
                  <Label htmlFor="euaUserId">{t(fieldLabels.euaUserId)}</Label>
                  {error && (
                    <ErrorMessage>
                      {t(
                        error.message ? error.message : 'errors.makeSelection'
                      )}
                    </ErrorMessage>
                  )}
                  {type === 'attendee' && (
                    <HelpText className="margin-top-1">
                      <Trans i18nKey="technicalAssistance:attendees.attendeeNameHelpText">
                        indexOne
                        <Link href="mailto:NavigatorInquiries@cms.hhs.gov">
                          helpTextEmail
                        </Link>
                        indexTwo
                      </Trans>
                    </HelpText>
                  )}
                  <CedarContactSelect
                    id="euaUserId"
                    name="euaUserId"
                    value={activeAttendee.userInfo}
                    onChange={cedarContact => {
                      if (cedarContact) {
                        setValue('euaUserId', cedarContact.euaUserId);
                        clearErrors('euaUserId');
                      }
                    }}
                    disabled={type === 'requester' || !!activeAttendee.id}
                    className="maxw-none"
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
                <FormGroup className="margin-top-3" error={!!error}>
                  <Label htmlFor="component">{t(fieldLabels.component)}</Label>
                  {error && (
                    <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                  )}
                  <Dropdown
                    id="component"
                    data-testid="component"
                    {...field}
                    ref={null}
                  >
                    <option
                      label={`- ${t('basic.options.select')} -`}
                      disabled
                    />
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
                <FormGroup className="margin-top-3" error={!!error}>
                  <Label htmlFor="role">{t(fieldLabels.role)}</Label>
                  {error && (
                    <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                  )}
                  <Dropdown
                    id="role"
                    data-testid="role"
                    {...field}
                    ref={null}
                    value={(field.value as PersonRole) || ''}
                  >
                    <option
                      label={`- ${t('basic.options.select')} -`}
                      disabled
                    />
                    {contactRoles.map(({ key, label }) => (
                      <option key={key} value={key} label={label} />
                    ))}
                  </Dropdown>
                </FormGroup>
              );
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

/** Single TRB attendee props */
type AttendeeProps = {
  /** Attendee object */
  attendee: TRBAttendeeData;
  /** Set active attendee - used to edit attendee */
  setActiveAttendee?: (activeAttendee: TRBAttendeeData) => void;
  /** Delete attendee */
  deleteAttendee?: () => void;
};

/** Display single TRB attendee */
const Attendee = ({
  attendee,
  setActiveAttendee,
  deleteAttendee
}: AttendeeProps) => {
  const { t } = useTranslation();
  const { url } = useRouteMatch();

  /** Attendee role label */
  // Gets label from enum value in attendee object
  const role =
    contactRoles.find(contactRole => contactRole.key === attendee.role)
      ?.label || '';

  /** Attendee component acronym */
  const component = cmsDivisionsAndOffices.find(
    ({ name }) => name === attendee.component
  )?.acronym;

  // If attendee is not found in CEDAR, return null
  if (!attendee.userInfo) return null;

  // Get attendee user info from object
  const {
    /** Attendee email */
    email,
    /** Attendee name */
    commonName
  } = attendee.userInfo;

  return (
    <>
      {/* Attendee icon with initials */}
      <InitialsIcon name={commonName} />
      {/* Attendee details */}
      <div>
        <p className="margin-y-05 text-bold">
          {commonName}, {component}
        </p>
        <p className="margin-y-05">{email}</p>
        <p className="margin-top-05 margin-bottom-0">{role}</p>
        {/**
         * Attendee edit and delete buttons
         * ButtonGroup does not display if setActiveAttendee (edit) and deleteAttendee functions are not provided as props
         */}
        {(setActiveAttendee || deleteAttendee) && (
          <ButtonGroup className="margin-y-0">
            {/* Edit Attendee */}
            {setActiveAttendee && (
              <UswdsReactLink
                variant="unstyled"
                // Sets active attendee to pass attendee object to edit attendee form
                onClick={() => setActiveAttendee(attendee)}
                to={`${url}/list`}
                className="margin-right-05"
              >
                {t('Edit')}
              </UswdsReactLink>
            )}
            {/* Delete attendee */}
            {deleteAttendee && (
              <Button
                className="text-error margin-top-0"
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
    </>
  );
};

/** TRB attendees list props */
type AttendeesListProps = {
  /** Array of attendee objects */
  attendees: TRBAttendeeData[];
  /** TRB request id */
  trbRequestId: string;
  /** Set active attendee - used to edit attendee */
  setActiveAttendee: (activeAttendee: TRBAttendeeData) => void;
  /** Delete attendee */
  deleteAttendee: (id: string) => void;
};

const AttendeesList = ({
  attendees,
  trbRequestId,
  setActiveAttendee,
  deleteAttendee
}: AttendeesListProps) => {
  /** Format attendees for display in table */
  const data = useMemo(() => {
    return attendees.map(attendee => ({ attendee }));
  }, [attendees]);

  /** Columns for display in table */
  const columns: Column<{ attendee: TRBAttendeeData }>[] = useMemo(
    () => [
      {
        accessor: 'attendee',
        id: 'attendee.id'
      }
    ],
    []
  );

  /** Attendees table object */
  const {
    canNextPage,
    canPreviousPage,
    getTableProps,
    getTableBodyProps,
    gotoPage,
    nextPage,
    page,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    setPageSize,
    state
  } = useTable(
    {
      data,
      columns,
      initialState: {
        pageIndex: 0,
        pageSize: 4
      }
    },
    usePagination
  );

  // If no attendees, return null
  if (attendees.length < 1) return null;

  return (
    <div className="trbAttendees-table margin-top-4">
      <Table bordered={false} fullWidth {...getTableProps()}>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  const attendee: TRBAttendeeData = cell.value;
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        border: 'none',
                        padding: 0
                      }}
                      id={`trbAttendee-${attendee?.userInfo?.euaUserId}`}
                      className="trbAttendee"
                    >
                      <Attendee
                        attendee={attendee}
                        deleteAttendee={() => {
                          if (attendee.id) {
                            deleteAttendee(attendee.id);
                            setActiveAttendee({
                              ...initialAttendee,
                              trbRequestId
                            });
                          }
                        }}
                        setActiveAttendee={setActiveAttendee}
                        key={attendee.id}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {
        /* Table pagination - hide if no second page */
        attendees.length > state.pageSize && (
          <TablePagination
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
            pageIndex={state.pageIndex}
            pageOptions={pageOptions}
            canPreviousPage={canPreviousPage}
            pageCount={pageCount}
            pageSize={state.pageSize}
            setPageSize={setPageSize}
            page={[]}
            className="margin-top-3"
          />
        )
      }
    </div>
  );
};

export { Attendee, AttendeesList, AttendeeFields };
