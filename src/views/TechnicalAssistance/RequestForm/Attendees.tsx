import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import UswdsReactLink from 'components/LinkWrapper';
import useTRBAttendees from 'hooks/useTRBAttendees';
// import useTRBAttendees from 'hooks/useTRBAttendees';
import { TRBAttendee } from 'queries/types/TRBAttendee';
import { PersonRole } from 'types/graphql-global-types';

import { AttendeesList } from './AttendeesForm/components';
import AttendeesForm from './AttendeesForm';
import Pager from './Pager';
import { FormStepComponentProps } from '.';

const testAttendees: TRBAttendee[] = [
  {
    __typename: 'TRBRequestAttendee',
    id: '2f78767e-c4fc-4abe-9db8-feaa8c058b6b',
    trbRequestId: '426c93bc-431f-411c-9494-ddb40e7572d2',
    userInfo: {
      __typename: 'UserInfo',
      commonName: 'Ashley Terstriep',
      email: 'aterstriep@oddball.io',
      euaUserId: 'TXJK'
    },
    component: 'CMS Wide',
    role: PersonRole.PRODUCT_OWNER,
    createdAt: ''
  }
];

function Attendees({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  let { attendees } = useTRBAttendees(request.id);
  attendees = [...attendees, ...testAttendees];

  return (
    <div className="trb-attendees">
      <Switch>
        <Route exact path={`${path}/list`}>
          <AttendeesForm request={request} backToFormUrl={stepUrl.current} />
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

          <AttendeesList attendees={attendees} id={request.id} />

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
