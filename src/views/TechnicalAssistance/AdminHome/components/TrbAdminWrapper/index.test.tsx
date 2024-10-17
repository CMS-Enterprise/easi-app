import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ModalRef } from '@trussworks/react-uswds';

import {
  getTrbGuidanceLetterQuery,
  taskStatuses,
  trbRequestSummary
} from 'data/mock/trbRequest';
import {
  TRBFeedbackStatus,
  TRBFormStatus,
  TRBRequestState,
  TRBRequestStatus
} from 'types/graphql-global-types';
import { TrbAdminPath, TrbRequestIdRef } from 'types/technicalAssistance';
import easiMockStore from 'utils/testing/easiMockStore';
import mockTranslation from 'utils/testing/mockTranslation';
import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import TrbAdminWrapper from '.';

const store = easiMockStore({ groups: ['EASI_TRB_ADMIN_D'] });

const trbRequest: typeof trbRequestSummary = {
  ...trbRequestSummary,
  status: TRBRequestStatus.REQUEST_FORM_COMPLETE,
  taskStatuses: {
    ...taskStatuses,
    formStatus: TRBFormStatus.COMPLETED,
    feedbackStatus: TRBFeedbackStatus.READY_TO_START
  }
};

const assignLeadModalRef = React.createRef<ModalRef>();
const assignLeadModalTrbRequestIdRef = React.createRef<TrbRequestIdRef>();

const { t } = mockTranslation('technicalAssistance');

describe('TRB Admin Wrapper', () => {
  const renderWrapper = (
    activePage: TrbAdminPath,
    status: TRBRequestStatus,
    state: TRBRequestState = TRBRequestState.OPEN
  ) =>
    render(
      <Provider store={store}>
        <VerboseMockedProvider mocks={[getTrbGuidanceLetterQuery]}>
          <MemoryRouter>
            <TrbAdminWrapper
              activePage={activePage}
              trbRequestId={trbRequest.id}
              title="Admin page title"
              noteCount={0}
              disableStep={false}
              adminActionProps={{
                status,
                state,
                assignLeadModalTrbRequestIdRef,
                assignLeadModalRef
              }}
            >
              <div />
            </TrbAdminWrapper>
          </MemoryRouter>
        </VerboseMockedProvider>
      </Provider>
    );

  it('matches the snapshot', () => {
    const { asFragment } = renderWrapper(
      'request',
      trbRequest.status,
      trbRequest.state
    );

    expect(asFragment()).toMatchSnapshot();
  });

  const statuses = {
    REQUEST_FORM_COMPLETE: ['viewRequestForm', 'orCloseRequest'],
    READY_FOR_CONSULT: ['addDateTime', 'assignTrbLead', 'orCloseRequest'],
    CONSULT_SCHEDULED: [
      'viewRequestForm',
      'viewSupportingDocuments',
      'assignTrbLead',
      'orCloseRequest'
    ],
    CONSULT_COMPLETE: ['viewGuidanceLetter', 'orCloseRequest'],
    GUIDANCE_LETTER_IN_REVIEW: ['viewGuidanceLetter', 'orCloseRequest'],
    GUIDANCE_LETTER_SENT: ['closeRequest']
  };
  const statusKeys = Object.keys(statuses);

  // Test request home admin action text and buttons
  test.each(statusKeys)(`renders request home status %j`, async status => {
    const { getByRole, getByText } = renderWrapper(
      'request',
      status as TRBRequestStatus
    );

    expect(
      getByRole('heading', {
        name: t(`adminAction.statuses.${status}.title`)
      })
    ).toBeInTheDocument();

    expect(
      getByText(t<string>(`adminAction.statuses.${status}.description`))
    ).toBeInTheDocument();

    const buttons = statuses[status as keyof typeof statuses];
    if (buttons)
      buttons.forEach(button => {
        expect(
          getByText(t<string>(`adminAction.buttons.${button}`))
        ).toBeInTheDocument();
      });
  });

  it('renders re-open request admin action', () => {
    const { getByRole } = renderWrapper(
      'notes',
      TRBRequestStatus.GUIDANCE_LETTER_SENT,
      TRBRequestState.CLOSED
    );

    expect(
      getByRole('link', { name: t('adminAction.buttons.reopenRequest') })
    ).toBeInTheDocument();
  });
});
