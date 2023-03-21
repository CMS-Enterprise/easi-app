import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';

import { trbRequestAdviceLetter } from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import {
  CreateTrbRecommendationQuery,
  GetTrbAdviceLetterQuery
} from 'queries/TrbAdviceLetterQueries';
import { GetTrbAdviceLetter } from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';

import AdviceLetterForm from '.';

const trbRequestId = 'fd1eec78-dff5-4c26-8924-44872a2b0414';

const adviceLetterQueryResponse: GetTrbAdviceLetter = {
  trbRequest: {
    __typename: 'TRBRequest',
    name: 'Test advice letter',
    adviceLetter: trbRequestAdviceLetter,
    taskStatuses: {
      __typename: 'TRBTaskStatuses',
      adviceLetterStatus: TRBAdviceLetterStatus.IN_PROGRESS
    }
  }
};

const getTrbAdviceLetterQuery = {
  request: {
    query: GetTrbAdviceLetterQuery,
    variables: {
      id: trbRequestId
    }
  },
  result: {
    data: adviceLetterQueryResponse
  }
};

const mockRecommendation = {
  title: 'Recommendation 3',
  recommendation: 'Recommendation description text',
  links: ['google.com', 'easi.cms.gov']
};

const createTrbRecommendationQuery = {
  request: {
    query: CreateTrbRecommendationQuery,
    variables: {
      input: { trbRequestId, ...mockRecommendation }
    }
  },
  result: {
    data: {
      createTRBAdviceLetterRecommendation: {
        id: '670fdf6d-761b-415f-a108-2ebc814288c3',
        ...mockRecommendation
      }
    }
  }
};

const mockStore = configureMockStore();

const defaultStore = mockStore({
  auth: {
    euaId: 'SF13',
    name: 'Jerry Seinfeld',
    isUserSet: true,
    groups: ['EASI_TRB_ADMIN_D']
  }
});

const renderForm = (step: string) => {
  return render(
    <MemoryRouter initialEntries={[`/trb/${trbRequestId}/advice/${step}`]}>
      <MessageProvider>
        <Provider store={defaultStore}>
          <MockedProvider
            mocks={[getTrbAdviceLetterQuery, createTrbRecommendationQuery]}
            addTypename={false}
          >
            <Route path="/trb/:id/advice/:formStep/:subpage?">
              <AdviceLetterForm />
            </Route>
          </MockedProvider>
        </Provider>
      </MessageProvider>
    </MemoryRouter>
  );
};

const waitForPageLoad = async () =>
  waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

describe('TRB Advice Letter Form', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = renderForm('summary');

    await waitForPageLoad();

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the recommendations form', async () => {
    const { findByRole, findByTestId } = renderForm('recommendations');

    const button = await findByRole('button', {
      name: 'Add another recommendation'
    });

    userEvent.click(button);

    // Title field
    const titleInput = await findByRole('textbox', { name: 'Title *' });
    userEvent.type(titleInput, mockRecommendation.title);
    expect(titleInput).toHaveValue(mockRecommendation.title);

    // Description field
    const descriptionInput = await findByRole('textbox', {
      name: 'Description *'
    });
    userEvent.type(descriptionInput, mockRecommendation.recommendation);
    expect(descriptionInput).toHaveValue(mockRecommendation.recommendation);

    // Add resource link
    const addLinkButton = await findByRole('button', {
      name: 'Add a resource link'
    });
    userEvent.click(addLinkButton);

    const addAnotherLinkButton = await findByRole('button', {
      name: 'Add another resource link'
    });
    // Button should be disabled while link input is blank
    expect(addAnotherLinkButton).toBeDisabled();

    let linkInput = await findByTestId('links.0.link');

    userEvent.type(linkInput, mockRecommendation.links[0]);
    expect(linkInput).toHaveValue(mockRecommendation.links[0]);

    userEvent.click(addAnotherLinkButton);

    linkInput = await findByTestId('links.1.link');

    const linkText = `https://www.${mockRecommendation.links[1]}`;
    userEvent.type(linkInput, linkText);
    expect(linkInput).toHaveValue(linkText);
  });

  it.only('renders the Next Steps form', async () => {
    const { findByRole, getByRole } = renderForm('next-steps');

    const nextStepsInput = await findByRole('textbox', {
      name: 'Next steps *'
    });

    expect(nextStepsInput).toHaveValue(trbRequestAdviceLetter.nextSteps);

    expect(
      getByRole('radio', {
        name: 'Yes, a follow-up is recommended'
      })
    ).toBeChecked();

    const followupPointInput = getByRole('textbox', { name: 'When?' });
    expect(followupPointInput).toHaveValue(
      trbRequestAdviceLetter.followupPoint
    );

    // Check that followup point input is hidden when followup radio field is false
    userEvent.click(getByRole('radio', { name: 'Not necessary' }));
    expect(followupPointInput).not.toBeInTheDocument();
  });
});
