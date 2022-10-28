import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { AttendeeFormFields } from 'types/technicalAssistance';

import { AttendeeFields, AttendeesList } from './AttendeesForm/components';
import AttendeesForm from './AttendeesForm';
import Pager from './Pager';
import { FormStepComponentProps } from '.';

/** Initial blank attendee object */
export const initialAttendee: AttendeeFormFields = {
  id: '',
  trbRequestId: '',
  userInfo: null,
  component: '',
  role: null
};

/** Mock requester object for testing */
const mockRequester: AttendeeFormFields = {
  trbRequestId: '',
  userInfo: {
    commonName: 'Ashley Terstriep',
    euaUserId: 'TXJK',
    email: 'ashley.terstriep@oddball.io'
  },
  component: '',
  role: null
};

function Attendees({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  // Active attendee for form fields
  const [activeAttendee, setActiveAttendee] = useState<AttendeeFormFields>({
    ...initialAttendee,
    trbRequestId: request.id
  });

  // TODO: Update requester state with actual form values
  const [requester, setRequester] = useState<AttendeeFormFields>({
    ...mockRequester,
    trbRequestId: request.id
  });

  // Get TRB attendees
  const { attendees } = useTRBAttendees(request.id);

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
