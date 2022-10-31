import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import {
  Dropdown,
  Form,
  FormGroup,
  Label,
  TextInput
} from '@trussworks/react-uswds';

import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import contactRoles from 'constants/enums/contactRoles';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { PersonRole } from 'types/graphql-global-types';
import { TRBAttendeeFields } from 'types/technicalAssistance';

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

type TRBAttendeesForm = {
  requester: TRBAttendeeFields;
  attendees: TRBAttendeeFields[];
};

function Attendees({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();

  // Active attendee for form fields
  const [activeAttendee, setActiveAttendee] = useState<TRBAttendeeFields>({
    ...initialAttendee,
    trbRequestId: request.id
  });

  // Get TRB attendees
  const { attendees } = useTRBAttendees(request.id);

  const defaultValues: TRBAttendeesForm = {
    // Requester
    requester: {
      ...initialAttendee,
      trbRequestId: request.id,
      userInfo: {
        commonName: '',
        euaUserId: request.createdBy
      }
    },
    // Filter requester out of attendees array
    attendees: attendees.filter(
      attendee => attendee.userInfo?.euaUserId !== request.createdBy
    )
  };

  const { control, setValue } = useForm<TRBAttendeesForm>({
    defaultValues
  });

  // Set initial requester data
  useEffect(() => {
    let isMounted = true;
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then(({ name, email }) => {
        if (isMounted) {
          setValue('requester.userInfo.commonName', name || '');
          setValue('requester.userInfo.email', email);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [authState, oktaAuth, setValue]);

  return (
    <Form className="trb-attendees" onSubmit={() => null}>
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
          {/* Requester name */}
          <Controller
            name="requester.userInfo.commonName"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup>
                  <Label htmlFor="requester.userInfo.commonName">
                    {t(`attendees.fieldLabels.requester.role`)}
                  </Label>
                  <TextInput
                    {...field}
                    ref={null}
                    id="requester.userInfo.commonName"
                    type="text"
                    validationStatus={error && 'error'}
                    disabled
                  />
                </FormGroup>
              );
            }}
          />
          {/* Requester component */}
          <Controller
            name="requester.component"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup>
                  <Label htmlFor="requester.component">
                    {t(`attendees.fieldLabels.requester.component`)}
                  </Label>
                  <Dropdown
                    id="requester.component"
                    data-testid="requester.component"
                    {...field}
                    ref={null}
                  >
                    <option label={`- ${t('basic.options.select')} -`} />
                    {cmsDivisionsAndOfficesOptions('requester.component')}
                  </Dropdown>
                </FormGroup>
              );
            }}
          />
          {/* Requester role */}
          <Controller
            name="requester.role"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup>
                  <Label htmlFor="requester.role">
                    {t(`attendees.fieldLabels.requester.role`)}
                  </Label>
                  <Dropdown
                    id="requester.role"
                    data-testid="requester.role"
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
          />

          <Pager
            back={{
              onClick: () => {
                history.push(stepUrl.back);
              }
            }}
            next={{
              onClick: e => {
                history.push(stepUrl.next);
              }
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
        </Route>
      </Switch>
    </Form>
  );
}

export default Attendees;
