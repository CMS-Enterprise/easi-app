import React from 'react';
import { render } from '@testing-library/react';

import { TRBFeedbackAction } from 'types/graphql-global-types';

import TrbRequestFeedbackList from './TrbRequestFeedbackList';

describe('TrbRequestFeedbackList', () => {
  it('renders', async () => {
    const { asFragment } = render(
      <TrbRequestFeedbackList
        feedback={[
          {
            id: '1429ea1b-d046-47a8-965f-73e5678675a4',
            action: TRBFeedbackAction.REQUEST_EDITS,
            feedbackMessage: 'Please',
            author: {
              commonName: 'Adeline Aarons',
              __typename: 'UserInfo'
            },
            createdAt: '2023-03-27T16:31:35.958568Z',
            __typename: 'TRBRequestFeedback'
          },
          {
            id: '9d4c7f42-1c06-4934-99c8-d0a855e099c3',
            action: TRBFeedbackAction.REQUEST_EDITS,
            feedbackMessage: 'Thank you',
            author: {
              commonName: 'Adeline Aarons',
              __typename: 'UserInfo'
            },
            createdAt: '2023-03-27T18:03:01.623278Z',
            __typename: 'TRBRequestFeedback'
          }
        ]}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
