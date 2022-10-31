import React, { useEffect, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { TRBAttendeeFields } from 'types/technicalAssistance';

import { AttendeeFields, AttendeesList } from './AttendeesForm/components';
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
  const { authState, oktaAuth } = useOktaAuth();

  // Active attendee for form fields
  const [activeAttendee, setActiveAttendee] = useState<TRBAttendeeFields>({
    ...initialAttendee,
    trbRequestId: request.id
  });

  // Get TRB attendees
  const { attendees } = useTRBAttendees(request.id);

  // Form values
  const [requester, setRequester] = useState<TRBAttendeeFields>();

  // Set initial requester data
  useEffect(() => {
    let isMounted = true;
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then(({ name, email }) => {
        if (isMounted) {
          setRequester({
            trbRequestId: request.id,
            userInfo: {
              euaUserId: request.createdBy,
              commonName: name || '',
              email
            },
            component: '',
            role: null
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [authState, oktaAuth, request.id, request.createdBy]);

  // Wait until requester is set to return
  if (!requester) return null;

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
          {/* Requester fields */}
          <AttendeeFields
            activeAttendee={requester}
            setActiveAttendee={setRequester}
            type="requester"
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
    </div>
  );
}

export default Attendees;
