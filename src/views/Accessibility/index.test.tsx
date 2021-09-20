import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import * as OktaReact from '@okta/okta-react';
import { mount, shallow } from 'enzyme';

import {
  REPORT_PROBLEM_ACCESSIBILITY_TEAM_SURVEY,
  REPORT_PROBLEM_BASIC_USER_SURVEY
} from 'constants/externalUrls';
import { ACCESSIBILITY_TESTER_DEV, BASIC_USER_PROD } from 'constants/jobCodes';

import Accessibility from './index';

beforeEach(() => {
  jest.resetModules();
});

jest.mock('@okta/okta-react');

function mockOkta(mockGroups: string[]) {
  OktaReact.useOktaAuth.mockReturnValue({
    authState: {
      isAuthenticated: true,
      accessToken: {
        claims: {
          groups: mockGroups,
          sub: 'AAAA'
        }
      },
      idToken: {
        claims: {
          name: 'A Person'
        }
      }
    },
    oktaAuth: {
      getUser: () =>
        Promise.resolve({
          name: 'John Doe'
        })
    }
  });
}

describe('Accessibility wrapper', () => {
  it('renders without crashing', () => {
    mockOkta([BASIC_USER_PROD]);
    const wrapper = shallow(<Accessibility />);
    expect(wrapper.length).toBe(1);
  });

  it('renders the "Report a problem" link area component', async () => {
    mockOkta([BASIC_USER_PROD]);
    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Accessibility />
        </MemoryRouter>
      );
      wrapper.update();
    });
    expect(wrapper.find('ReportProblemLinkArea').exists()).toBe(true);
  });

  it('uses the right url value for the "report problem" link for a basic user', async () => {
    mockOkta([BASIC_USER_PROD]);
    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Accessibility />
        </MemoryRouter>
      );
      wrapper.update();
    });
    expect(
      wrapper.find('ReportProblemLinkArea').find('a').props().href
    ).toEqual(REPORT_PROBLEM_BASIC_USER_SURVEY);
  });

  it('uses the right url value for the "report problem" link for a 508 tester', async () => {
    mockOkta([ACCESSIBILITY_TESTER_DEV, BASIC_USER_PROD]);
    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Accessibility />
        </MemoryRouter>
      );
      wrapper.update();
    });
    expect(
      wrapper.find('ReportProblemLinkArea').find('a').props().href
    ).toEqual(REPORT_PROBLEM_ACCESSIBILITY_TEAM_SURVEY);
  });
  it('uses the right url value for the "report problem" link for a 508 user', async () => {
    mockOkta([ACCESSIBILITY_TESTER_DEV, BASIC_USER_PROD]);
    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter>
          <Accessibility />
        </MemoryRouter>
      );
      wrapper.update();
    });
    expect(
      wrapper.find('ReportProblemLinkArea').find('a').props().href
    ).toEqual(REPORT_PROBLEM_ACCESSIBILITY_TEAM_SURVEY);
  });
});
