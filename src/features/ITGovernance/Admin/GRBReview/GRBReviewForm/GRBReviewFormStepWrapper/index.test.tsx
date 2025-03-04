import React, { ComponentProps } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { grbReview } from 'tests/mock/grbReview';

import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { MessageProvider } from 'hooks/useMessage';

import GRBReviewFormStepWrapper from '.';

describe('GRB review form step wrapper', () => {
  /** Returns form provider for unit tests */
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useEasiForm();

    return <EasiFormProvider {...form}>{children}</EasiFormProvider>;
  };

  const renderComponent = (
    props?: Partial<ComponentProps<typeof GRBReviewFormStepWrapper>>
  ) =>
    render(
      <MemoryRouter
        initialEntries={[
          `/it-governance/${grbReview.id}/grb-review/review-type`
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
                <div />
              </GRBReviewFormStepWrapper>
            </Wrapper>
          </Route>
        </MessageProvider>
      </MemoryRouter>
    );

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
        grbPresentationLinks: {
          __typename: 'SystemIntakeGRBPresentationLinks',
          recordingLink: 'https://test.com'
        }
      }
    });

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
      'false'
    );

    expect(await screen.findByTestId('stepIndicator-3')).toHaveAttribute(
      'aria-disabled',
      'false'
    );
  });

  it('hides required fields text', () => {
    renderComponent({ requiredFields: false });

    expect(
      screen.queryByText('Fields marked with an asterisk', { exact: false })
    ).toBeNull();
  });

  it('navigates to next step', async () => {
    renderComponent();

    expect(await screen.findByTestId('stepIndicator-0'));

    expect(screen.getAllByText('Review type')).not.toBeNull();

    // Click next step in header
    userEvent.click(screen.getByTestId('stepIndicator-1'));

    // Next step should be selected
    expect(await screen.findByTestId('stepIndicator-1')).toHaveAttribute(
      'aria-current',
      'true'
    );
  });
});
