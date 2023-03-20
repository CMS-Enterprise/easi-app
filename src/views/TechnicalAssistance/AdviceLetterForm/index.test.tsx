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
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
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
          {/* TODO: Add CreateTRBRecommendation to mocks */}
          <MockedProvider mocks={[getTrbAdviceLetterQuery]} addTypename={false}>
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

  it.only('renders the Recommendations page', async () => {
    const { getByRole, getByTestId } = renderForm('recommendations');

    await waitForPageLoad();

    // Check that recommendations are rendered
    expect(
      getByRole('heading', { name: 'Recommendation 1' })
    ).toBeInTheDocument();

    const addRecommendationButton = getByRole('button', {
      name: 'Add another recommendation'
    });
    userEvent.click(addRecommendationButton);

    expect(
      getByRole('heading', { name: 'Add a recommendation', level: 1 })
    ).toBeInTheDocument();

    // Title field
    const titleInput = getByRole('textbox', { name: 'Title *' });
    const titleText = 'Recommendation Title #3';
    userEvent.type(titleInput, titleText);
    expect(titleInput).toHaveValue(titleText);

    // Description field
    const descriptionInput = getByRole('textbox', {
      name: 'Description *'
    });
    const descriptionText = 'Recommendation description test';
    userEvent.type(descriptionInput, descriptionText);
    expect(descriptionInput).toHaveValue(descriptionText);

    // Add resource link
    const addLinkButton = getByRole('button', { name: 'Add a resource link' });
    userEvent.click(addLinkButton);

    const addAnotherLinkButton = getByRole('button', {
      name: 'Add another resource link'
    });
    // Button should be disabled while link input is blank
    expect(addAnotherLinkButton).toBeDisabled();

    let linkInput = getByTestId('links.0.link');
    const links = ['google.com', 'easi.cms.gov'];

    userEvent.type(linkInput, links[0]);
    expect(linkInput).toHaveValue(links[0]);

    userEvent.click(addAnotherLinkButton);

    linkInput = getByTestId('links.1.link');

    userEvent.type(linkInput, links[1]);
    expect(linkInput).toHaveValue(links[1]);

    // Passes but throws warning - need to add CreateTRBRecommendation to mocks
    userEvent.click(getByRole('button', { name: 'Save' }));
  });

  it('renders the Next Steps page', async () => {
    const { getByRole } = renderForm('next-steps');

    await waitForPageLoad();

    expect(getByRole('textbox', { name: 'Next steps *' })).toBeInTheDocument();
  });
});
