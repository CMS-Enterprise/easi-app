import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import i18next from 'i18next';

import { MessageProvider } from 'hooks/useMessage';

import PresentationDeckUpload from '.';

describe('UploadForm page', () => {
  it('renders correct navigation text if admin', async () => {
    const { findByText } = render(
      <MemoryRouter>
        <MockedProvider>
          <MessageProvider>
            <PresentationDeckUpload type="admin" />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      findByText(
        i18next.t<string>(
          'grbReview:presentationLinks.presentationDeckUpload:dontUploadAdmin'
        )[0]
      )
    );
  });

  it('renders correct navigation text if requester and takes a snapshot', async () => {
    const { asFragment, findByText } = render(
      <MemoryRouter>
        <MockedProvider>
          <MessageProvider>
            <PresentationDeckUpload type="requester" />
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(
      findByText(
        i18next.t<string>(
          'grbReview:presentationLinks.presentationDeckUpload:dontUploadRequester'
        )[0]
      )
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
