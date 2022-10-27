import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import UswdsReactLink from 'components/LinkWrapper';
import useTRBAttendees from 'hooks/useTRBAttendees';
import { AttendeeFormFields } from 'types/technicalAssistance';

import { AttendeesList } from './AttendeesForm/components';
import AttendeesForm from './AttendeesForm';
import Pager from './Pager';
import { FormStepComponentProps } from '.';

const initialAttendee: AttendeeFormFields = {
  id: '',
  trbRequestId: '',
  userInfo: null,
  component: '',
  role: ''
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
