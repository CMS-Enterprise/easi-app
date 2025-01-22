import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';

// import { JobCode } from 'constants/jobCodes';
import { grbPresentationLinks as grbPresentationLinksMock } from 'data/mock/systemIntake';
import { MessageProvider } from 'hooks/useMessage';
import { SystemIntakeDocumentStatus } from 'types/graphql-global-types';
import easiMockStore from 'utils/testing/easiMockStore';
import { getExpectedAlertType } from 'utils/testing/helpers';

import ITGovAdminContext from '../ITGovAdminContext';

import PresentationLinksCard, {
  PresentationLinksCardProps
} from './PresentationLinksCard';

describe('Async Presentation Links Card', () => {
  function renderCard(
    grbPresentationLinks: PresentationLinksCardProps['grbPresentationLinks'],
    isAdmin: boolean = true
    // Default to render in the itgo admin context since thats where most of the render conditions are
    // groups: JobCode[] = ['EASI_D_GOVTEAM', 'EASI_P_GOVTEAM']
  ) {
    // const mockStore = easiMockStore({
    //   groups
    // });
    const mockStore = easiMockStore({
      groups: []
    });

    const { systemIntakeID } = grbPresentationLinksMock!;

    return render(
      <MemoryRouter
        initialEntries={[`/it-governance/${systemIntakeID}/grb-review`]}
      >
        <Provider store={mockStore}>
          <MessageProvider>
            <MockedProvider>
              <ITGovAdminContext.Provider value={isAdmin}>
                <PresentationLinksCard
                  systemIntakeID={systemIntakeID}
                  grbPresentationLinks={grbPresentationLinks}
                />
              </ITGovAdminContext.Provider>
            </MockedProvider>
          </MessageProvider>
        </Provider>
      </MemoryRouter>
    );
  }

  it('Admin empty state', () => {
    renderCard({
      ...grbPresentationLinksMock!,
      recordingLink: null,
      transcriptFileStatus: SystemIntakeDocumentStatus.UNAVAILABLE,
      presentationDeckFileStatus: SystemIntakeDocumentStatus.UNAVAILABLE
    });

    expect(getExpectedAlertType('info')).toHaveTextContent(
      'If this GRB review has an asynchronous presentation and recording, you may add that content to EASi to provide additional information for GRB reviews.'
    );

    screen.getByRole('link', { name: 'Add asynchronous presentation links' });
  });

  it('With all transcript link)', () => {
    renderCard(grbPresentationLinksMock);

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: 'Add asynchronous presentation links'
      })
    ).not.toBeInTheDocument();

    screen.getByRole('link', { name: 'Edit presentation links' });
    screen.getByRole('button', { name: 'Remove all presentation links' });
    screen.getByRole('link', { name: 'View recording' });
    screen.getByText('(Passcode: 123456)');
    screen.getByRole('link', { name: 'View transcript' });
    screen.getByRole('link', { name: 'View slide deck' });
  });

  it('No passcode', () => {
    renderCard({
      ...grbPresentationLinksMock!,
      transcriptFileStatus: SystemIntakeDocumentStatus.UNAVAILABLE,
      presentationDeckFileStatus: SystemIntakeDocumentStatus.UNAVAILABLE
    });

    expect(screen.queryByTestId('alert')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('link', {
        name: 'Add asynchronous presentation links'
      })
    ).not.toBeInTheDocument();

    screen.getByRole('link', { name: 'View recording' });

    expect(screen.queryByText('Passcode')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'View transcript' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'View slide deck' })
    ).not.toBeInTheDocument();
  });

  it('wont render if empty links and not admin', () => {
    renderCard(
      {
        ...grbPresentationLinksMock!,
        recordingLink: null,
        transcriptFileStatus: SystemIntakeDocumentStatus.UNAVAILABLE,
        presentationDeckFileStatus: SystemIntakeDocumentStatus.UNAVAILABLE
      },
      false
    );

    expect(
      screen.queryByRole('header', { name: 'Asynchronous presentation' })
    ).not.toBeInTheDocument();
  });
});
