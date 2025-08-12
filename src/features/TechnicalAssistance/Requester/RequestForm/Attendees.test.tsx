import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  GetCedarContactsDocument,
  GetTRBRequestAttendeesDocument,
  GetTRBRequestAttendeesQuery,
  GetTRBRequestDocument,
  GetTRBRequestQuery
} from 'gql/generated/graphql';
import { attendees, requester, trbRequest } from 'tests/mock/trbRequest';

import Attendees from './Attendees';

/** Requester object with initial null values for component and role */
const initialRequester: GetTRBRequestAttendeesQuery['trbRequest']['attendees'][0] =
  {
    ...requester,
    component: null,
    role: null
  };

const cedarDisplay = `${initialRequester.userInfo?.commonName}, ${initialRequester.userInfo?.euaUserId} (${initialRequester.userInfo?.email})`;

describe('Trb Request form: Attendees', () => {
  const mockRefetch = async (): Promise<
    ApolloQueryResult<GetTRBRequestQuery>
  > => {
    return {
      loading: false,
      networkStatus: NetworkStatus.ready,
      data: {
        __typename: 'Query',
        trbRequest
      }
    };
  };

  const getAttendeesQuery = {
    request: {
      query: GetTRBRequestAttendeesDocument,
      variables: {
        id: trbRequest.id
      }
    },
    result: {
      data: {
        trbRequest: {
          id: trbRequest.id,
          attendees: [initialRequester, ...attendees]
        }
      }
    }
  };

  const getTrbRequestQuery = {
    request: {
      query: GetTRBRequestDocument,
      variables: {
        id: trbRequest.id
      }
    },
    result: {
      data: trbRequest
    }
  };

  const getCedarContactsQuery = {
    request: {
      query: GetCedarContactsDocument,
      variables: {
        commonName: initialRequester.userInfo?.commonName
      }
    },
    result: {
      data: requester
    }
  };

  it('Renders the attendees form', async () => {
    const { getByTestId, findByTestId } = render(
      <MemoryRouter>
        <MockedProvider
          mocks={[getAttendeesQuery, getTrbRequestQuery, getCedarContactsQuery]}
          addTypename={false}
        >
          <Attendees
            request={trbRequest}
            stepUrl={{
              current: `/trb/requests/${trbRequest.id}/attendees`,
              next: `/trb/requests/${trbRequest.id}/documents`,
              back: `/trb/requests/${trbRequest.id}/subject`
            }}
            refetchRequest={mockRefetch}
            setIsStepSubmitting={() => {}}
            setStepSubmit={() => {}}
            setFormAlert={() => {}}
            taskListUrl=""
          />
        </MockedProvider>
      </MemoryRouter>
    );

    const requesterContactSelect = await findByTestId('cedar-contact-select');

    // Check that requester name and EUA matches mocked query results
    expect(requesterContactSelect).toHaveValue(
      `${requester.userInfo?.commonName}, ${requester.userInfo?.euaUserId} (${requester.userInfo?.email})`
    );

    const requesterComponentField = getByTestId(
      'trb-requester-component'
    ) as HTMLSelectElement;
    const requesterRoleField = getByTestId(
      'trb-requester-role'
    ) as HTMLSelectElement;

    // Wait for component options (post-reset) and pick first real option (skip placeholder)
    const componentOptions = await within(
      requesterComponentField
    ).findAllByRole('option');
    const firstRealComponentOption = componentOptions.find(o => {
      const opt = o as HTMLOptionElement;
      const label = opt.getAttribute('label') || opt.textContent || '';
      return !opt.disabled && !/^\s*-\s*select\s*-\s*$/i.test(label);
    });
    expect(firstRealComponentOption).toBeTruthy();

    await userEvent.selectOptions(
      requesterComponentField,
      firstRealComponentOption!
    );

    // Assert by display value (visible text)
    expect(requesterComponentField).toHaveDisplayValue(
      (firstRealComponentOption as HTMLOptionElement).textContent!
    );

    // Wait for role options and pick first real option (skip placeholder/empty)
    const roleOptions =
      await within(requesterRoleField).findAllByRole('option');
    const firstRealRoleOption = roleOptions.find(o => {
      const opt = o as HTMLOptionElement;
      return !opt.disabled && opt.value !== '';
    });
    expect(firstRealRoleOption).toBeTruthy();

    await userEvent.selectOptions(requesterRoleField, firstRealRoleOption!);

    // Assert by display label and underlying value
    expect(requesterRoleField).toHaveDisplayValue(
      (firstRealRoleOption as HTMLOptionElement).textContent!
    );
    await waitFor(() =>
      expect(requesterRoleField).toHaveValue(
        (firstRealRoleOption as HTMLOptionElement).value
      )
    );
  });
});
