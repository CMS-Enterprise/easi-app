import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import {
  GetSystemIntakeGRBDiscussionsDocument,
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables
} from 'gql/generated/graphql';
import { mockDiscussions } from 'tests/mock/discussions';
import { systemIntake } from 'tests/mock/systemIntake';

import { MockedQuery } from 'types/util';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import Discussions from '.';

const getSystemIntakeGRBDiscussions: MockedQuery<
  GetSystemIntakeGRBDiscussionsQuery,
  GetSystemIntakeGRBDiscussionsQueryVariables
> = {
  request: {
    query: GetSystemIntakeGRBDiscussionsDocument,
    variables: {
      id: systemIntake.id
    }
  },
  result: {
    data: {
      __typename: 'Query',
      systemIntake: {
        __typename: 'SystemIntake',
        id: systemIntake.id,
        grbDiscussionsInternal: mockDiscussions(),
        grbDiscussionsPrimary: mockDiscussions()
      }
    }
  }
};

describe('Discussions', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <VerboseMockedProvider mocks={[getSystemIntakeGRBDiscussions]}>
          <Discussions
            grbReviewers={[]}
            systemIntakeID={systemIntake.id}
            grbReviewStartedAt="2025-03-11T01:50:35.146458Z"
          />
        </VerboseMockedProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Discussions')).toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });
});
