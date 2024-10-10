import React, { useEffect, useMemo, useState } from 'react';
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
import { FetchResult } from '@apollo/client';
import {
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
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { AvatarCircle } from 'components/shared/Avatar/Avatar';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import HelpText from 'components/shared/HelpText';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TablePagination from 'components/TablePagination';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import contactRoles from 'constants/enums/contactRoles';
import { DeleteTRBRequestAttendee } from 'queries/types/DeleteTRBRequestAttendee';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import { PersonRole } from 'types/graphql-global-types';
import {
  AttendeeFieldLabels,
  TRBAttendeeFields
} from 'types/technicalAssistance';

import { initialAttendee } from '../Attendees';
import { TrbFormAlert } from '..';

/** Attendee form props */
type AttendeeFieldsProps = {
  /** Fields type */
  type: 'requester' | 'attendee';
  /** Sets the default values for the form */
  activeAttendee: TRBAttendee;
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

  // Using this instead of formState.isValid since it's not the same
  const hasErrors = Object.keys(errors).length > 0;

  // Scroll to the error summary when there are changes after submit
  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-attendees-fields-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  return (
    <>
      {/* Validation errors summary */}
      {Object.keys(errors).length > 0 && (
        <Alert
          heading={t('errors.checkFix')}
          type="error"
          className="trb-attendees-fields-error margin-bottom-2"
          slim={false}
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
      <Grid row className="margin-bottom-2">
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          {/* Required fields help text */}
          <HelpText className="margin-top-1 margin-bottom-1 text-base">
            <Trans
              i18nKey="technicalAssistance:requiredFields"
              components={{ red: <span className="text-red" /> }}
            />
          </HelpText>

          {/* Attendee name */}
          <Controller
            name="euaUserId"
            control={control}
            render={({ fieldState: { error } }) => {
              return (
                <FormGroup error={!!error}>
                  <Label htmlFor="euaUserId">
                    {t(fieldLabels.euaUserId)}
                    <RequiredAsterisk />
                  </Label>
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
                    data-testid={`trb-${type}-component`}
                    {...field}
                    ref={null}
                    value={field.value || ''}
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
                  <Label htmlFor="role">
                    {t(fieldLabels.role)}
                    <RequiredAsterisk />
                  </Label>
                  {error && (
                    <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                  )}
                  <Dropdown
                    id="role"
                    data-testid={`trb-${type}-role`}
                    {...field}
                    ref={null}
                    value={(field.value as PersonRole) || ''}
                  >
                    <option
                      label={`- ${t('basic.options.select')} -`}
                      disabled
                    />
                    {(Object.keys(contactRoles) as PersonRole[]).map(key => (
                      <option key={key} value={key} label={contactRoles[key]} />
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
  attendee: TRBAttendee;
  /** Set active attendee - used to edit attendee */
  setActiveAttendee?: (activeAttendee: TRBAttendee) => void;
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
  const role = attendee.role ? contactRoles[attendee.role] : '';

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
      {/* Attendee details */}
      <div>
        <p className="margin-y-05 text-bold">
          {commonName}
          {component && ','} {component}
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
type AttendeesTableProps = {
  /** Array of attendee objects */
  attendees: TRBAttendee[];
  /** TRB request id */
  trbRequestId: string;
  /** Set active attendee - used to edit attendee */
  setActiveAttendee?: (activeAttendee: TRBAttendee) => void;
  setFormAlert?: React.Dispatch<React.SetStateAction<TrbFormAlert>>;
  /** Delete attendee */
  deleteAttendee?: (
    id: string
  ) => Promise<FetchResult<DeleteTRBRequestAttendee>>;
};

const AttendeesTable = ({
  attendees,
  trbRequestId,
  setActiveAttendee,
  setFormAlert,
  deleteAttendee
}: AttendeesTableProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [isModalOpen, setModalOpen] = useState(false);
  const [attendeeToRemove, setAttendeeToRemove] = useState<TRBAttendee>();

  /** Format attendees for display in table */
  const data = useMemo(() => {
    return attendees.map(attendee => ({ attendee }));
  }, [attendees]);

  /** Columns for display in table */
  const columns: Column<{ attendee: TRBAttendee }>[] = useMemo(
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
        pageSize: 6
      }
    },
    usePagination
  );

  // If no attendees, return null
  if (attendees.length < 1) return null;

  const renderModal = () => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-top-0 margin-bottom-0">
          {t('attendees.modal.heading', {
            attendee: attendeeToRemove?.userInfo?.commonName
          })}
        </PageHeading>

        <p>{t('attendees.modal.description')}</p>

        <Button
          type="button"
          onClick={() => {
            if (deleteAttendee && attendeeToRemove?.id) {
              deleteAttendee(attendeeToRemove?.id).then(() => {
                if (setFormAlert) {
                  setFormAlert({
                    type: 'success',
                    message: t<string>('attendees.alerts.successRemove')
                  });
                }
              });
              setActiveAttendee?.({
                ...initialAttendee,
                trbRequestId
              });
              setModalOpen(false);
            }
          }}
        >
          {t('attendees.modal.remove')}
        </Button>

        <Button
          type="button"
          className="margin-left-2"
          unstyled
          onClick={() => setModalOpen(false)}
        >
          {t('attendees.modal.cancel')}
        </Button>
      </Modal>
    );
  };

  return (
    <div className="trbAttendees-table margin-top-4 margin-bottom-neg-1">
      {renderModal()}
      <Table bordered={false} fullWidth {...getTableProps()}>
        <tbody {...getTableBodyProps()} className="grid-row grid-gap-sm">
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="tablet:grid-col-6 margin-bottom-1"
              >
                {row.cells.map(cell => {
                  const attendee: TRBAttendee = cell.value;
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        border: 'none',
                        padding: 0
                      }}
                      id={`trbAttendee-${attendee?.userInfo?.euaUserId}`}
                      data-testid={`trbAttendee-${attendee?.userInfo?.euaUserId}`}
                      className="trbAttendee display-flex"
                    >
                      {/* Attendee icon with initials */}
                      <AvatarCircle
                        user={attendee?.userInfo?.commonName || ''}
                        className="margin-right-1"
                      />
                      <Attendee
                        attendee={attendee}
                        deleteAttendee={
                          deleteAttendee
                            ? () => {
                                if (attendee.id) {
                                  setAttendeeToRemove(attendee);
                                  setModalOpen(true);
                                }
                              }
                            : undefined
                        }
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
          />
        )
      }
    </div>
  );
};

export { Attendee, AttendeesTable, AttendeeFields };
