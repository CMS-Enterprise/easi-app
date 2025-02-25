import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import PresentationDeckUpload from '.';

describe('UploadForm page', () => {
  it('renders correct navigation text if admin', async () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <MessageProvider>
            <PresentationDeckUpload type="admin" />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getAllByText(
        i18next.t<string>(
          'grbReview:presentationLinks.presentationUpload:dontUploadAdmin'
        )
      )[0]
    );
  });

  it('renders correct navigation text if requester and takes a snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MockedProvider>
          <MessageProvider>
            <PresentationDeckUpload type="requester" />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      screen.getAllByText(
        i18next.t<string>(
          'grbReview:presentationLinks.presentationUpload:dontUploadRequester'
        )
      )[0]
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
