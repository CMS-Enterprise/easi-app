import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GetSytemIntakeQuery from 'queries/GetSystemIntakeQuery';

import SystemIntake from '../index';

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true
      },
      oktaAuth: {
        getAccessToken: () => Promise.resolve('test-access-token'),
        getUser: () =>
          Promise.resolve({
            name: 'John Doe'
          })
      }
    };
  }
}));

describe('The intake contact details page', () => {
  const INTAKE_ID = 'ccdfdcf5-5085-4521-9f77-fa1ea324502b';
  const intakeQuery = {
    request: {
      query: GetSytemIntakeQuery,
      variables: {
        id: INTAKE_ID
      }
    },
    result: {
      data: {
        systemIntake: {
          id: INTAKE_ID,
          adminLead: null,
          businessNeed: null,
          businessSolution: null,
          businessOwner: {
            component: null,
            name: null
          },
          contract: {
            contractor: null,
            endDate: {
              day: null,
              month: null,
              year: null
            },
            hasContract: null,
            startDate: {
              day: null,
              month: null,
              year: null
            },
            vehicle: null
          },
          costs: {
            isExpectingIncrease: null,
            expectedIncreaseAmount: null
          },
          currentStage: null,
          decisionNextSteps: null,
          grbDate: null,
          grtDate: null,
          grtFeedbacks: [],
          governanceTeams: {
            isPresent: false,
            teams: null
          },
          isso: {
            isPresent: false,
            name: null
          },
          fundingSource: {
            fundingNumber: null,
            isFunded: null,
            source: null
          },
          lcid: null,
          lcidExpiresAt: null,
          lcidScope: null,
          needsEaSupport: null,
          productManager: {
            component: null,
            name: null
          },
          rejectionReason: null,
          requester: {
            component: null,
            email: null,
            name: 'User ABCD'
          },
          requestName: '',
          requestType: 'NEW',
          status: 'INTAKE_DRAFT',
          submittedAt: null
        }
      }
    }
  };

  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByTestId('system-intake')).toBeInTheDocument();
  });

  it('prefills the requester name', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('textbox', {
        name: /requester/i
      })
    ).toHaveValue('User ABCD');
  });

  it('fills required fields (smoke test)', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Requester Component
    const requesterComponentDropdown = screen.getByRole('combobox', {
      name: /requester component/i
    });
    userEvent.selectOptions(
      requesterComponentDropdown,
      'Office of Information Technology'
    );
    expect(requesterComponentDropdown).toHaveValue(
      'Office of Information Technology'
    );

    // Business Owner Name
    const businessOwnerName = screen.getByRole('textbox', {
      name: /business owner name/i
    });
    userEvent.type(businessOwnerName, 'User ZYXW');
    expect(businessOwnerName).toHaveValue('User ZYXW');

    // Business Owner Component
    const businessOwnerComponentDropdown = screen.getByRole('combobox', {
      name: /business owner component/i
    });
    userEvent.selectOptions(
      businessOwnerComponentDropdown,
      'Office of Information Technology'
    );
    expect(businessOwnerComponentDropdown).toHaveValue(
      'Office of Information Technology'
    );

    // Product Manager Name
    const productManagerName = screen.getByRole('textbox', {
      name: /project\/product manager/i
    });
    userEvent.type(productManagerName, 'User HAHA');
    expect(productManagerName).toHaveValue('User HAHA');

    // Product Manager Component
    const productManagerComponentDropdown = screen.getByRole('combobox', {
      name: /product manager component/i
    });
    userEvent.selectOptions(
      productManagerComponentDropdown,
      'Office of Information Technology'
    );
    expect(productManagerComponentDropdown).toHaveValue(
      'Office of Information Technology'
    );

    // ISSO
    const isso = screen.getByTestId('isso-fieldset');
    const noIssoRadio = within(isso).getByRole('radio', { name: /no/i });
    userEvent.click(noIssoRadio);

    // Governance Teams
    const governanceTeams = screen.getByTestId('governance-teams-fieldset');

    const noGovernanceTeamsRadio = within(governanceTeams).getByRole('radio', {
      name: /no/i
    });
    userEvent.click(noGovernanceTeamsRadio);
  });

  it('fills isso name', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    const isso = screen.getByTestId('isso-fieldset');
    const noIssoRadio = within(isso).getByRole('radio', { name: /yes/i });
    userEvent.click(noIssoRadio);
    expect(screen.getByTestId('isso-name-container')).toBeInTheDocument();

    const issoNameInput = screen.getByRole('textbox', { name: /isso name/i });
    userEvent.type(issoNameInput, 'ISSO name');
    expect(issoNameInput).toHaveValue('ISSO name');
  });

  it('adds all collaborating governance teams', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    const governanceTeams = screen.getByTestId('governance-teams-fieldset');
    const noGovernanceTeamsRadio = within(governanceTeams).getByRole('radio', {
      name: /1 or more of the following in OIT/i
    });
    userEvent.click(noGovernanceTeamsRadio);

    const trb = screen.getByRole('checkbox', { name: /trb/i });
    userEvent.click(trb);

    const ispg = screen.getByRole('checkbox', { name: /ispg/i });
    userEvent.click(ispg);

    const ea = screen.getByRole('checkbox', {
      name: /Enterprise Architecture/i
    });
    userEvent.click(ea);

    const trbInput = screen.getByRole('textbox', {
      name: /trb collaborator name/i
    });
    userEvent.type(trbInput, 'TRB Collaborator Name');
    expect(trbInput).toHaveValue('TRB Collaborator Name');

    const ispgInput = screen.getByRole('textbox', {
      name: /ispg collaborator name/i
    });
    userEvent.type(ispgInput, 'ISPG Collaborator Name');
    expect(ispgInput).toHaveValue('ISPG Collaborator Name');

    const eaInput = screen.getByRole('textbox', {
      name: /ea collaborator name/i
    });
    userEvent.type(eaInput, 'EA Collaborator Name');
    expect(eaInput).toHaveValue('EA Collaborator Name');
  });

  it('autofills business owner based on requester info', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Requester name is already filled - User ABCD
    // Requester Component
    const requesterComponentDropdown = screen.getByRole('combobox', {
      name: /requester component/i
    });
    userEvent.selectOptions(
      requesterComponentDropdown,
      'Office of Information Technology'
    );

    const sameAsRequesterCheckbox = screen.getByRole('checkbox', {
      name: /CMS Business Owner is same as requester/i
    });
    userEvent.click(sameAsRequesterCheckbox);

    const businessOwnerName = screen.getByRole('textbox', {
      name: /business owner name/i
    });
    expect(businessOwnerName).toHaveValue('User ABCD');

    const businessOwnerComponentDropdown = screen.getByRole('combobox', {
      name: /business owner component/i
    });
    expect(businessOwnerComponentDropdown).toHaveValue(
      'Office of Information Technology'
    );
  });

  it('autofills product owner based on requester info', async () => {
    render(
      <MemoryRouter initialEntries={[`/system/${INTAKE_ID}/contact-details`]}>
        <MockedProvider mocks={[intakeQuery]} addTypename={false}>
          <Route path="/system/:systemId/:formPage">
            <SystemIntake />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    // Requester name is already filled - User ABCD
    // Requester Component
    const requesterComponentDropdown = screen.getByRole('combobox', {
      name: /requester component/i
    });
    userEvent.selectOptions(
      requesterComponentDropdown,
      'Office of Information Technology'
    );

    const sameAsRequesterCheckbox = screen.getByRole('checkbox', {
      name: /CMS Project\/Product Manager, or lead is same as requester/i
    });
    userEvent.click(sameAsRequesterCheckbox);

    // Product Manager Name
    const productManagerName = screen.getByRole('textbox', {
      name: /project\/product manager/i
    });
    expect(productManagerName).toHaveValue('User ABCD');

    // Product Manager Component
    const productManagerComponentDropdown = screen.getByRole('combobox', {
      name: /product manager component/i
    });

    expect(productManagerComponentDropdown).toHaveValue(
      'Office of Information Technology'
    );
  });
});
