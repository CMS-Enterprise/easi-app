import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18next from 'i18next';

import {
  getTrbGuidanceLetterQuery,
  guidanceLetter,
  taskStatuses
} from 'data/mock/trbRequest';
import { MessageProvider } from 'hooks/useMessage';
import { CreateTrbRecommendationQuery } from 'queries/TrbGuidanceLetterQueries';
import {
  CreateTRBRecommendation,
  CreateTRBRecommendationVariables
} from 'queries/types/CreateTRBRecommendation';
import {
  GetTrbGuidanceLetter,
  GetTrbGuidanceLetterVariables
} from 'queries/types/GetTrbGuidanceLetter';
import { TRBGuidanceLetterRecommendationCategory } from 'types/graphql-global-types';
import { GuidanceFormStepKey } from 'types/technicalAssistance';
import { MockedQuery } from 'types/util';
import easiMockStore from 'utils/testing/easiMockStore';
import { mockTrbRequestId } from 'utils/testing/MockTrbAttendees';
import typeRichText from 'utils/testing/typeRichText';

import GuidanceLetterForm from '.';

const mockRecommendation = {
  trbRequestId: mockTrbRequestId,
  title: 'Recommendation 3',
  recommendation: 'Recommendation description text',
  links: ['google.com', 'easi.cms.gov'],
  category: TRBGuidanceLetterRecommendationCategory.RECOMMENDATION
};

const createTrbRecommendationQuery: MockedQuery<
  CreateTRBRecommendation,
  CreateTRBRecommendationVariables
> = {
  request: {
    query: CreateTrbRecommendationQuery,
    variables: {
      input: mockRecommendation
    }
  },
  result: {
    data: {
      createTRBGuidanceLetterRecommendation: {
        __typename: 'TRBGuidanceLetterRecommendation',
        id: '670fdf6d-761b-415f-a108-2ebc814288c3',
        ...mockRecommendation
      }
    }
  }
};

const defaultStore = easiMockStore({
  euaUserId: 'SF13',
  groups: ['EASI_TRB_ADMIN_D']
});

const getGuidanceLetterCannotStart: MockedQuery<
  GetTrbGuidanceLetter,
  GetTrbGuidanceLetterVariables
> = {
  ...getTrbGuidanceLetterQuery,
  result: {
    data: {
      trbRequest: {
        ...getTrbGuidanceLetterQuery.result.data?.trbRequest!,
        guidanceLetter: null,
        taskStatuses
      }
    }
  }
};

const renderForm = (
  step: GuidanceFormStepKey,
  mocks?: MockedResponse[],
  error?: boolean
) => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn;
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: `/trb/${mockTrbRequestId}/guidance/${step}`,
          state: { error }
        }
      ]}
    >
      <MessageProvider>
        <Provider store={defaultStore}>
          <MockedProvider
            mocks={
              mocks || [getTrbGuidanceLetterQuery, createTrbRecommendationQuery]
            }
            addTypename={false}
          >
            <Route path="/trb/:id/guidance/:formStep/:subpage?">
              <GuidanceLetterForm />
            </Route>
          </MockedProvider>
        </Provider>
      </MessageProvider>
    </MemoryRouter>
  );
};

const waitForPageLoad = async () =>
  waitForElementToBeRemoved(() => screen.getByTestId('page-loading'));

describe('TRB Guidance Letter Form', () => {
  it('matches the snapshot', async () => {
    const { asFragment } = renderForm('summary');

    await waitForPageLoad();

    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders no guidance letter alert', async () => {
    renderForm('summary', [getGuidanceLetterCannotStart]);

    expect(await screen.findByTestId('alert')).toBeInTheDocument();

    expect(
      await screen.findByText(
        i18next.t<string>('technicalAssistance:guidanceLetter.alerts.info')
      )
    ).toBeInTheDocument();
  });

  it('Renders error creating guidance letter alert', async () => {
    renderForm('summary', [getGuidanceLetterCannotStart], true);

    expect(await screen.findByTestId('alert')).toBeInTheDocument();

    expect(
      await screen.findByText(
        i18next.t<string>('technicalAssistance:guidanceLetter.alerts.error')
      )
    ).toBeInTheDocument();
  });

  it('renders the recommendations form', async () => {
    const { findByRole, findByTestId } = renderForm('insights');

    const button = await findByRole('button', {
      name: 'Add additional guidance'
    });

    userEvent.click(button);

    // Title field
    const titleInput = await findByRole('textbox', { name: 'Title *' });
    userEvent.type(titleInput, mockRecommendation.title);
    expect(titleInput).toHaveValue(mockRecommendation.title);

    // Description field
    const descriptionInput = await screen.findByTestId('recommendation');
    await typeRichText(descriptionInput, mockRecommendation.recommendation);
    expect(descriptionInput).toContainHTML(
      `<p>${mockRecommendation.recommendation!}</p>`
    );

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

  it('renders the Next Steps form', async () => {
    const { getByRole } = renderForm('next-steps');

    const nextStepsInput = await screen.findByTestId('nextSteps');

    expect(nextStepsInput).toContainHTML(`<p>${guidanceLetter.nextSteps!}</p>`);

    expect(
      getByRole('radio', {
        name: 'Yes, a follow-up is recommended'
      })
    ).toBeChecked();

    const followupPointInput = getByRole('textbox', { name: 'When?' });
    expect(followupPointInput).toHaveValue(guidanceLetter.followupPoint);

    // Check that followup point input is hidden when followup radio field is false
    userEvent.click(getByRole('radio', { name: 'Not necessary' }));
    expect(followupPointInput).not.toBeInTheDocument();
  });
});
