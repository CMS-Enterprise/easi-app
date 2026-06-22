import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CreateSystemIntakeActionUpdateLCIDDocument,
  SystemIntakeContactComponent,
  SystemIntakeLCIDStatus,
  SystemIntakeLCIDType
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';
import {
  getSystemIntakeContactsQuery,
  getSystemIntakeQuery,
  requester,
  systemIntake
} from 'tests/mock/systemIntake';

import { formatDateLocal } from 'utils/date';

import UpdateLcid from './UpdateLcid';

describe('Update LCID form', () => {
  const expiresAt = DateTime.local().plus({ year: 1 }).toISO();

  const renderComponent = (
    mocks: MockedResponse[] = [getSystemIntakeContactsQuery()]
  ) =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <UpdateLcid
            systemIntakeId={systemIntake.id}
            lcidStatus={SystemIntakeLCIDStatus.ISSUED}
            lcid="123456"
            lcidDisplay="123456 - 2026 - OIT - NEW_SYSTEM - SHORTENED"
            lcidIssuedAt={DateTime.local().minus({ days: 7 }).toISO()}
            lcidExpiresAt={expiresAt}
            lcidScope="<p>Test scope</p>"
            decisionNextSteps="<p>Test next steps</p>"
            lcidCostBaseline="Test cost baseline"
            lcidType={SystemIntakeLCIDType.NEW_SYSTEM}
            lcidComponent={
              SystemIntakeContactComponent.OFFICE_OF_INFORMATION_TECHNOLOGY_OIT
            }
            lcidIsLowIt={false}
            lcidIsShortened
          />
        </MemoryRouter>
      </MockedProvider>
    );

  it('pre-populates editable LCID fields with existing data', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(screen.getByRole('combobox', { name: 'LCID type' })).toHaveValue(
      SystemIntakeLCIDType.NEW_SYSTEM
    );
    expect(
      screen.getByRole('combobox', { name: 'LCID component' })
    ).toHaveValue(
      SystemIntakeContactComponent.OFFICE_OF_INFORMATION_TECHNOLOGY_OIT
    );

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'Expiration date' })
      ).toHaveValue(formatDateLocal(expiresAt || '', 'MM/dd/yyyy'));
    });

    expect(screen.getByTestId('scope')).toContainHTML('Test scope');
    expect(screen.getByTestId('nextSteps')).toContainHTML('Test next steps');
    expect(
      screen.getByRole('textbox', { name: 'Project cost baseline' })
    ).toHaveValue('Test cost baseline');

    const yesOptions = screen.getAllByRole('radio', { name: 'Yes' });
    const noOptions = screen.getAllByRole('radio', { name: 'No' });

    expect(yesOptions[0]).toBeChecked();
    expect(noOptions[1]).toBeChecked();
  });

  it('disables submit until an LCID field changes', async () => {
    const user = userEvent.setup();

    renderComponent();

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    expect(
      screen.getByRole('button', { name: 'Complete action' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', {
        name: 'Complete action without email'
      })
    ).toBeDisabled();

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'LCID type' }),
      SystemIntakeLCIDType.RECOMPETE
    );

    expect(
      screen.getByRole('button', { name: 'Complete action' })
    ).toBeEnabled();
    expect(
      screen.getByRole('button', {
        name: 'Complete action without email'
      })
    ).toBeEnabled();
  });

  it('submits only dirty LCID fields with action fields', async () => {
    const user = userEvent.setup();
    const updateLcidVariables = vi.fn(() => true);

    renderComponent([
      getSystemIntakeContactsQuery(),
      {
        request: {
          query: CreateSystemIntakeActionUpdateLCIDDocument
        },
        variableMatcher: updateLcidVariables,
        result: {
          data: {
            createSystemIntakeActionUpdateLCID: {
              systemIntake: {
                id: systemIntake.id,
                lcid: '123456'
              }
            }
          }
        }
      },
      getSystemIntakeQuery()
    ]);

    await waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'LCID type' }),
      SystemIntakeLCIDType.RECOMPETE
    );

    await user.click(screen.getByRole('button', { name: 'Complete action' }));

    await waitFor(() => {
      expect(updateLcidVariables).toHaveBeenCalledWith({
        input: {
          systemIntakeID: systemIntake.id,
          reason: undefined,
          additionalInfo: '',
          adminNote: null,
          notificationRecipients: {
            shouldNotifyITGovernance: true,
            shouldNotifyITInvestment: false,
            regularRecipientEmails: [requester.userAccount.email]
          },
          lcidType: SystemIntakeLCIDType.RECOMPETE
        }
      });
    });
  });
});
