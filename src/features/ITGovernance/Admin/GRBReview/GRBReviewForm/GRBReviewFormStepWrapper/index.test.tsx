import React, { ComponentProps } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  SystemIntakeGRBReviewType,
  SystemIntakeStatusAdmin
} from 'gql/generated/graphql';
import { grbReview } from 'tests/mock/grbReview';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { MessageProvider } from 'hooks/useMessage';
import { GrbReviewFormStepKey } from 'types/grbReview';

import GRBReviewFormStepWrapper from '.';

describe('GRB review form step wrapper', () => {
  /** Returns form provider for unit tests */
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useEasiForm();

    return <EasiFormProvider {...form}>{children}</EasiFormProvider>;
  };

  /** Renders empty GRB Review form wrapper */
  const renderComponent = (
    props?: Partial<ComponentProps<typeof GRBReviewFormStepWrapper>> & {
      step?: GrbReviewFormStepKey;
    }
  ) => {
    return render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${grbReview.id}/grb-review/${props?.step || 'review-type'}`
        ]}
      >
        <MessageProvider>
          <Route path="/it-governance/:systemId/grb-review/:step">
            <Wrapper>
              <GRBReviewFormStepWrapper
                onSubmit={props?.onSubmit || vi.fn()}
                grbReview={props?.grbReview || grbReview}
                {...props}
              >
                <h1>Test</h1>
              </GRBReviewFormStepWrapper>
            </Wrapper>
          </Route>
        </MessageProvider>
      </MemoryRouter>
    );
  };

  it('matches the snapshot', async () => {
    const { asFragment } = renderComponent();

    // Wait for steps to format
    expect(
      await screen.findByTestId('grbReviewForm-stepContentWrapper')
    ).toBeInTheDocument();

    // Wraps content in `form`
    expect(
      screen.getByTestId('grbReviewForm-stepContentWrapper')
    ).toHaveAttribute('role', 'form');

    expect(screen.getByRole('heading', { name: 'Test' }));

    expect(asFragment()).toMatchSnapshot();
  });

  it('disables steps for new form', async () => {
    renderComponent();

    expect(await screen.findByTestId('stepIndicator-0')).toHaveAttribute(
      'aria-disabled',
      'false'
    );

    expect(await screen.findByTestId('stepIndicator-1')).toHaveAttribute(
      'aria-disabled',
      'false'
    );

    expect(await screen.findByTestId('stepIndicator-2')).toHaveAttribute(
      'aria-disabled',
      'true'
    );

    expect(await screen.findByTestId('stepIndicator-3')).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('enables all steps after step 2 is completed', async () => {
    renderComponent({
      grbReview: {
        ...grbReview,
        grbDate: '2021-10-13T00:00:00.000Z',
        grbReviewType: SystemIntakeGRBReviewType.STANDARD,
        grbPresentationLinks: {
          __typename: 'SystemIntakeGRBPresentationLinks',
          recordingLink: 'https://test.com',
          presentationDeckFileName: 'test.pdf'
        }
      }
    });

    // Wait for the async step-formatting effect to complete
    await waitFor(() =>
      expect(screen.getByTestId('stepIndicator-0')).toHaveAttribute(
        'aria-disabled',
        'false'
      )
    );

    await waitFor(() =>
      expect(screen.getByTestId('stepIndicator-1')).toHaveAttribute(
        'aria-disabled',
        'false'
      )
    );

    await waitFor(() =>
      expect(screen.getByTestId('stepIndicator-2')).toHaveAttribute(
        'aria-disabled',
        'false'
      )
    );

    await waitFor(() =>
      expect(screen.getByTestId('stepIndicator-3')).toHaveAttribute(
        'aria-disabled',
        'false'
      )
    );
  });

  it('redirects user if step is disabled', async () => {
    renderComponent({ step: 'participants' });

    // Participants step is disabled, so redirects to Presentation step
    expect(
      await screen.findByRole('heading', {
        name: 'Step 2 of 4 Presentation'
      })
    ).toBeInTheDocument();
  });

  it('hides required fields text', async () => {
    renderComponent({ requiredFields: false });

    // Wait for steps to format
    expect(
      await screen.findByTestId('grbReviewForm-stepContentWrapper')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Fields marked with an asterisk', { exact: false })
    ).toBeNull();
  });

  it('navigates to next step', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({});
    const user = userEvent.setup();
    renderComponent({ onSubmit: mockOnSubmit });

    expect(await screen.findByTestId('stepIndicator-0'));

    expect(screen.getAllByText('Review type')).not.toBeNull();

    // Click next step in header
    await user.click(screen.getByTestId('stepIndicator-1'));

    await waitFor(() => {
      expect(screen.getByTestId('stepIndicator-1')).toHaveAttribute(
        'aria-current',
        'true'
      );
    });
  });

  it('disables submit if review cannot be started yet', async () => {
    renderComponent({
      step: 'participants',
      grbReview: {
        ...grbReview,
        grbReviewStartedAt: null,
        statusAdmin: SystemIntakeStatusAdmin.FINAL_BUSINESS_CASE_SUBMITTED,
        grbDate: '2021-10-13T00:00:00.000Z',
        grbReviewType: SystemIntakeGRBReviewType.STANDARD,
        grbPresentationLinks: {
          __typename: 'SystemIntakeGRBPresentationLinks',
          recordingLink: 'https://test.com',
          presentationDeckFileName: 'test.pdf'
        }
      }
    });

    expect(
      await screen.findByRole('button', { name: 'Complete and begin review' })
    ).toBeDisabled();
  });
});
