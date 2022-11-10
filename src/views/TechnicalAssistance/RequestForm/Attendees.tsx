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
  Label,
  TextInput
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import contactRoles from 'constants/enums/contactRoles';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { PersonRole } from 'types/graphql-global-types';
import { TRBAttendeeFields } from 'types/technicalAssistance';
import { trbAttendeeSchema } from 'validations/trbRequestSchema';

import { AttendeesList } from './AttendeesForm/components';
import AttendeesForm from './AttendeesForm';
import Pager from './Pager';
import { FormStepComponentProps } from '.';

/** Initial blank attendee object */
export const initialAttendee: TRBAttendeeFields = {
  trbRequestId: '',
  userInfo: null,
  component: '',
  role: null
};

function Attendees({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  // Active attendee for form fields
  const [activeAttendee, setActiveAttendee] = useState<TRBAttendeeFields>({
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
    const { id, component, userInfo, role } = formData;
    if (id) {
      updateAttendee({
        id,
        component,
        role: role as PersonRole
      });
    } else if (userInfo) {
      createAttendee({
        trbRequestId: request.id,
        euaUserId: userInfo?.euaUserId,
        component,
        role: role as PersonRole
      });
    }
    // TODO: Mutation error handling
    history.push(stepUrl.next);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<TRBAttendeeFields>({
    resolver: yupResolver(trbAttendeeSchema),
    defaultValues: { ...requester, trbRequestId: request.id }
  });

  useEffect(() => {
    if (!loading) {
      setValue('userInfo.commonName', requester.userInfo?.commonName || '');
      setValue('userInfo.euaUserId', requester.userInfo?.euaUserId || '');
      setValue('userInfo.email', requester.userInfo?.email);
      setValue('component', requester.component || '');
      setValue('role', requester.role);
    }
  }, [loading, requester, setValue]);

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
              name="userInfo.commonName"
              control={control}
              render={({ field }) => {
                return (
                  <FormGroup>
                    <Label htmlFor="userInfo.commonName">
                      {t(`attendees.fieldLabels.requester.commonName`)}
                    </Label>
                    <TextInput
                      {...field}
                      ref={null}
                      id="userInfo.commonName"
                      type="text"
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
