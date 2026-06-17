import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import {
  SystemIntakeContactComponent,
  SystemIntakeLCIDStatus,
  SystemIntakeLCIDType
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';
import {
  getSystemIntakeContactsQuery,
  systemIntake
} from 'tests/mock/systemIntake';

import { formatDateLocal } from 'utils/date';

import UpdateLcid from './UpdateLcid';

describe('Update LCID form', () => {
  it('pre-populates editable LCID fields with existing data', async () => {
    const expiresAt = DateTime.local().plus({ year: 1 }).toISO();

    render(
      <MockedProvider
        mocks={[getSystemIntakeContactsQuery()]}
        addTypename={false}
      >
        <MemoryRouter>
          <UpdateLcid
            systemIntakeId={systemIntake.id}
            lcidStatus={SystemIntakeLCIDStatus.ISSUED}
            lcid="123456"
            lcidDisplay="123456 - 2026 - OIT - NEW_SYSTEM - SHORTENED"
            lcidIssuedAt={DateTime.local().minus({ days: 7 }).toISO()}
            lcidExpiresAt={expiresAt}
            lcidScope="Test scope"
            decisionNextSteps="Test next steps"
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
});
