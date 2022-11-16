import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Dropdown,
  ErrorMessage,
  Form,
  FormGroup,
  Label
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import contactRoles from 'constants/enums/contactRoles';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { PersonRole } from 'types/graphql-global-types';
import { TRBAttendeeData, TRBAttendeeFields } from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

import { AttendeesList } from './AttendeesForm/components';
import AttendeesForm from './AttendeesForm';
import Pager from './Pager';
import { FormStepComponentProps } from '.';

/** Initial blank attendee object */
export const initialAttendee: TRBAttendeeData = {
  trbRequestId: '',
  userInfo: {
    commonName: '',
    euaUserId: ''
  },
  component: '',
  role: null
};

function Attendees({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  // Active attendee for form fields
  const [activeAttendee, setActiveAttendee] = useState<TRBAttendeeData>({
    ...initialAttendee,
    trbRequestId: request.id
  });

  // Get TRB attendees
  const {
    data: { attendees, requester, loading },
    createAttendee,
    updateAttendee,
    deleteAttendee
  } = useTRBAttendees({
    trbRequestId: request.id,
    requesterId: request.createdBy
  });

  const saveRequester = (formData: TRBAttendeeFields) => {
    const { component, role, euaUserId } = formData;
    if (requester.id) {
      updateAttendee({
        id: requester.id,
        component,
        role: role as PersonRole
      });
    } else {
      createAttendee({
        trbRequestId: request.id,
        euaUserId,
        component,
        role: role as PersonRole
      });
    }
    // TODO: Mutation error handling
    history.push(stepUrl.next);
  };

  // Initialize form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<TRBAttendeeFields>({
    resolver: yupResolver(trbAttendeeSchema),
    defaultValues: { ...requester, trbRequestId: request.id }
  });

  // Set initial field values after queries have completed
  useEffect(() => {
    if (!loading) {
      setValue('euaUserId', requester?.userInfo?.euaUserId || '');
      setValue('component', requester.component || '');
      setValue('role', requester.role);
    }
  }, [loading, requester, setValue]);

  if (loading) return null;

  return (
    <div className="trb-attendees">
      <Switch>
        <Route exact path={`${path}/list`}>
          <AttendeesForm
            request={request}
            backToFormUrl={stepUrl.current}
            activeAttendee={activeAttendee}
            setActiveAttendee={setActiveAttendee}
          />
        </Route>

        <Route exact path={`${path}`}>
          <Form
            onSubmit={handleSubmit(formData => {
              if (isDirty) {
                saveRequester(formData);
              } else {
                history.push(stepUrl.next);
              }
            })}
          >
            {/* Requester validation errors summary */}
            {Object.keys(errors).length > 0 && (
              <Alert
                heading={t('basic.errors.checkFix')}
                type="error"
                className="margin-bottom-2"
              >
                {Object.keys(errors).map(fieldName => {
                  return (
                    <ErrorAlertMessage
                      key={fieldName}
                      errorKey={fieldName}
                      message={t(
                        `attendees.fieldLabels.requester.${fieldName}`
                      )}
                    />
                  );
                })}
              </Alert>
            )}
            {/* Requester name */}
            <Controller
              name="euaUserId"
              control={control}
              render={({ field }) => {
                return (
                  <FormGroup>
                    <Label htmlFor="euaUserId">
                      {t(`attendees.fieldLabels.requester.commonName`)}
                    </Label>
                    <CedarContactSelect
                      id="euaUserId"
                      name="euaUserId"
                      value={requester.userInfo}
                      onChange={cedarContact =>
                        cedarContact &&
                        setValue('euaUserId', cedarContact.euaUserId)
                      }
                      disabled
                    />
                  </FormGroup>
                );
              }}
            />
            {/* Requester component */}
            <Controller
              name="component"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormGroup error={!!error}>
                    <Label htmlFor="component">
                      {t(`attendees.fieldLabels.requester.component`)}
                    </Label>
                    {error && (
                      <ErrorMessage>
                        {t('basic.errors.makeSelection')}
                      </ErrorMessage>
                    )}
                    <Dropdown
                      id="component"
                      data-testid="component"
                      {...field}
                      ref={null}
                    >
                      <option label={`- ${t('basic.options.select')} -`} />
                      {cmsDivisionsAndOfficesOptions('component')}
                    </Dropdown>
                  </FormGroup>
                );
              }}
            />
            {/* Requester role */}
            <Controller
              name="role"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormGroup error={!!error}>
                    <Label htmlFor="role">
                      {t(`attendees.fieldLabels.requester.role`)}
                    </Label>
                    {error && (
                      <ErrorMessage>
                        {t('basic.errors.makeSelection')}
                      </ErrorMessage>
                    )}
                    <Dropdown
                      id="role"
                      data-testid="role"
                      {...field}
                      ref={null}
                      value={(field.value as PersonRole) || ''}
                    >
                      <option label={`- ${t('basic.options.select')} -`} />
                      {contactRoles.map(({ key, label }) => (
                        <option key={key} value={key} label={label} />
                      ))}
                    </Dropdown>
                  </FormGroup>
                );
              }}
            />

            <Divider className="margin-top-4" />

            <h4>{t('attendees.additionalAttendees')}</h4>

            <div className="margin-y-2">
              <UswdsReactLink
                variant="unstyled"
                className="usa-button"
                to={`${url}/list`}
              >
                {t(
                  attendees.length > 0
                    ? 'attendees.addAnotherAttendee'
                    : 'attendees.addAnAttendee'
                )}
              </UswdsReactLink>
            </div>

            <AttendeesList
              attendees={attendees}
              setActiveAttendee={setActiveAttendee}
              id={request.id}
              deleteAttendee={deleteAttendee}
            />

            <Pager
              back={{
                disabled: isSubmitting
              }}
              next={{
                disabled: isSubmitting
                // TODO: Button style / text based on attendees count
                // // Demo next button based on attendees
                // ...(numExample === 0
                //   ? {
                //       text: t('attendees.continueWithoutAdding'),
                //       outline: true
                //     }
                //   : {})
              }}
            />
          </Form>
        </Route>
      </Switch>
    </div>
  );
}

export default Attendees;
