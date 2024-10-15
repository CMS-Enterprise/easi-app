import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import { GetTrbRequestHome_trbRequest as GetTrbRequestHomeType } from 'queries/types/GetTrbRequestHome';
import {
  TRBFormStatus,
  TRBGuidanceLetterStatus
} from 'types/graphql-global-types';

import InformationCard from '.';

const trbRequestId = '449ea115-8bfa-48c3-b1dd-5a613d79fbae';

const trbRequest: GetTrbRequestHomeType = {
  id: trbRequestId,
  consultMeetingTime: '2024-01-05T05:00:00Z',
  taskStatuses: {
    formStatus: TRBFormStatus.COMPLETED,
    adviceLetterStatus: TRBGuidanceLetterStatus.READY_TO_START,
    __typename: 'TRBTaskStatuses'
  },
  form: {
    id: 'c92ec6a6-cd5b-4be3-895a-e88f7de76c22',
    modifiedAt: '2023-01-05T05:00:00Z',
    __typename: 'TRBRequestForm'
  },
  adviceLetter: {
    __typename: 'TRBGuidanceLetter',
    id: '123',
    modifiedAt: '2023-02-05T05:00:00Z'
  },
  trbLeadInfo: {
    commonName: 'Jerry Seinfeld',
    email: 'js@oddball.io',
    __typename: 'UserInfo'
  },
  documents: [
    {
      __typename: 'TRBRequestDocument',
      id: '456'
    }
  ],
  adminNotes: [],
  __typename: 'TRBRequest'
};

describe('TRB Admin InformationCard', () => {
  it('Renders correct Initial request form info', () => {
    const { getByText, asFragment, getByRole } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
        <Route exact path="/trb/:id/:activePage">
          <InformationCard trbRequest={trbRequest} type="initialRequestForm" />
        </Route>
      </MemoryRouter>
    );

    expect(
      getByText(
        i18next.t<string>('technicalAssistance:adminHome.initialRequest')
      )
    ).toBeInTheDocument();

    expect(getByText('January 5, 2023')).toBeInTheDocument();

    expect(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:adminHome.view')
      })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders correct guidance letter info', () => {
    const { getByText, asFragment, getByRole } = render(
      <MemoryRouter initialEntries={[`/trb/${trbRequestId}/request`]}>
        <Route exact path="/trb/:id/:activePage">
          <InformationCard trbRequest={trbRequest} type="adviceLetter" />
        </Route>
      </MemoryRouter>
    );

    expect(
      getByText(
        i18next.t<string>('technicalAssistance:adminHome.guidanceLetter')
      )
    ).toBeInTheDocument();

    expect(getByText('February 5, 2023')).toBeInTheDocument();

    expect(
      getByRole('button', {
        name: i18next.t<string>('technicalAssistance:adminHome.startGuidance')
      })
    ).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
