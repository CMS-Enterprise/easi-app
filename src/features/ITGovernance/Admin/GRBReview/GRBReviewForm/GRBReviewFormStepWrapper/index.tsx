import React, { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Form, GridContainer, Icon } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import { SystemIntakeGRBReviewFragment } from 'gql/generated/graphql';

import AutoSave from 'components/AutoSave';
import Breadcrumbs from 'components/Breadcrumbs';
import { useEasiFormContext } from 'components/EasiForm';
import { UseEasiFormReturn } from 'components/EasiForm/types';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import RequiredFieldsText from 'components/RequiredFieldsText';
import StepHeader, { StepHeaderStepProps } from 'components/StepHeader';
import useMessage from 'hooks/useMessage';
import { grbReviewFormSteps } from 'i18n/en-US/grbReview';
import { GrbReviewFormStepKey } from 'types/grbReview';
import { GrbReviewFormSchema } from 'validations/grbReviewSchema';

export type GRBReviewFormStepSubmit<TFieldValues extends FieldValues> = (
  values: TFieldValues & { systemIntakeID: string }
) => Promise<any>;

type GRBReviewFormStepWrapperProps<TFieldValues extends FieldValues> = {
  children: React.ReactNode;
  grbReview: SystemIntakeGRBReviewFragment;
  /**
   * onSubmit function for form step
   *
   * If undefined, `children` will be wrapped in `div` instead of `form`
   *
   * Component must be wrapped in `<EasiFormContextProvider>` for `onSubmit` to work
   */
  onSubmit?: GRBReviewFormStepSubmit<TFieldValues>;
  /** Defaults to true - shows required fields text above `children` */
  requiredFields?: boolean;
  disabled?: boolean;
};

/**
 * Step wrapper for the GRB review set up form
 *
 * Includes stepped header, step title/description, and form navigation buttons
 */
function GRBReviewFormStepWrapper<
  TFieldValues extends FieldValues = FieldValues
>({
  children,
  grbReview,
  onSubmit,
  requiredFields = true,
  disabled = false
}: GRBReviewFormStepWrapperProps<TFieldValues>) {
  const { t } = useTranslation('grbReview');
  const history = useHistory();
  const { Message, showMessage } = useMessage();

  /** Formatted steps for stepped form header */
  const [steps, setSteps] = useState<StepHeaderStepProps[]>(
    [...grbReviewFormSteps].map(step => ({ ...step, disabled: true }))
  );

  const { systemId, step } = useParams<{
    systemId: string;
    step: GrbReviewFormStepKey;
  }>();

  /**
   * Form context object -
   * will return `undefined` if component is not wrapped in `<EasiFormContextProvider>`
   */
  const form = useEasiFormContext<TFieldValues>() as
    | UseEasiFormReturn<TFieldValues>
    | undefined;

  const { handleSubmit, watch } = form || {};
  const { isValid, isDirty } = form?.formState || {};

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  const currentStepIndex: number = grbReviewFormSteps.findIndex(
    ({ key }) => key === step
  );

  const previousStep: StepHeaderStepProps | undefined =
    currentStepIndex > -1 ? steps[currentStepIndex - 1] : undefined;

  const nextStep: StepHeaderStepProps | undefined =
    currentStepIndex > -1 ? steps[currentStepIndex + 1] : undefined;

  /**
   * Submits step if fields are valid
   *
   * If invalid, redirects to GRB Review tab or `path` prop with no error messages
   */
  const submitStep = useCallback(
    async (path?: string) => {
      // Don't submit if invalid or no changes
      if (!isValid || !isDirty) {
        return history.push(`${grbReviewPath}/${path || ''}`);
      }

      return handleSubmit?.(values =>
        onSubmit?.({ systemIntakeID: systemId, ...values }).then(() =>
          history.push(`${grbReviewPath}/${path || ''}`)
        )
      )();
    },
    [grbReviewPath, isValid, isDirty, handleSubmit, onSubmit, history, systemId]
  );

  const formValues = form?.getValues?.();

  /**
   * Formats form steps for stepped header
   */
  const formatSteps = useCallback(async () => {
    const { grbReviewType, grbReviewers, grbDate } = grbReview;

    // Validate form steps with Yup
    const reviewTypeIsValid =
      await GrbReviewFormSchema.grbReviewType.isValid(grbReviewType);

    const presentationIsValid = formValues?.grbMeetingDate
      ? await GrbReviewFormSchema.presentation?.grbDate.isValid(
          formValues?.grbMeetingDate?.grbDate
        )
      : await GrbReviewFormSchema.presentation?.grbDate.isValid(grbDate);

    const participantsIsValid = await GrbReviewFormSchema.participants.isValid({
      grbReviewers
    });

    return grbReviewFormSteps.reduce<StepHeaderStepProps[]>(
      (acc, value, index) => {
        let completed: boolean;

        // Set whether each step is completed
        switch (value.key) {
          case 'review-type':
            completed = reviewTypeIsValid;
            break;

          case 'presentation':
            completed = !!(reviewTypeIsValid && presentationIsValid);
            break;

          case 'documents':
            completed = !!(reviewTypeIsValid && presentationIsValid);
            break;

          case 'participants':
            completed = participantsIsValid;
            break;

          default:
            completed = true;
            break;
        }

        acc[index] = {
          ...acc[index],
          completed,
          disabled: index > 0 ? !acc[index - 1].completed : false,
          onClick: () => submitStep(value.key)
        };

        return acc;
      },
      [...grbReviewFormSteps]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grbReview, submitStep, disabled]);

  /**
   * Wrapper for step content
   *
   * Returns `<Form>` if `onSubmit` prop is defined
   * */
  const StepContentWrapper = useCallback(
    ({
      // eslint-disable-next-line @typescript-eslint/no-shadow
      children,
      ...props
    }: {
      children: React.ReactNode;
    }) => {
      if (!onSubmit || !handleSubmit)
        return (
          <div className="step-content-wrapper" {...props}>
            {children}
          </div>
        );

      return (
        <Form
          className="step-content-wrapper maxw-none"
          {...props}
          role="form"
          onSubmit={handleSubmit(values => {
            if (!isDirty) {
              return history.push(`${grbReviewPath}/${nextStep?.key || ''}`);
            }

            return onSubmit({ systemIntakeID: systemId, ...values })
              .then(() =>
                // Go to next step, or back to review if end of form
                history.push(`${grbReviewPath}/${nextStep?.key || ''}`)
              )
              .catch(() =>
                showMessage(t('setUpGrbReviewForm.error'), { type: 'error' })
              );
          })}
        >
          {children}
        </Form>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grbReviewPath, isDirty, history, handleSubmit, showMessage, systemId, t]
  );

  // Format steps and redirect user if current step is disabled
  useEffect(() => {
    formatSteps().then(values => {
      if (!values) {
        return;
      }
      // If current step is disabled, redirect to last valid step or start of form
      if (values[currentStepIndex].disabled) {
        /** Returns the latest valid step or step one */
        const latestValidStep =
          // @ts-ignore
          values.findLast(value => !value.disabled) || values[0];

        history.push(`${grbReviewPath}/${latestValidStep.key}`);
      }
      setSteps(values);
    });
  }, [grbReview, formatSteps, currentStepIndex, history, grbReviewPath]);

  return (
    <MainContent>
      <StepHeader
        step={currentStepIndex + 1}
        heading={t('setUpGrbReviewForm.heading')}
        text={t('setUpGrbReviewForm.text')}
        subText={t('setUpGrbReviewForm.subText')}
        hideSteps={currentStepIndex < 0}
        // Remove description from steps to display within form wrapper instead
        steps={steps.map(({ description, ...val }) => val)}
        errorAlert={<Message className="margin-top-2" />}
        breadcrumbBar={
          <Breadcrumbs
            items={[
              { text: t('header:home'), url: '/' },
              {
                text: t('governanceReviewTeam:itGovernanceRequestDetails'),
                url: grbReviewPath
              },
              { text: t('setUpGrbReviewForm.heading') }
            ]}
          />
        }
      >
        {currentStepIndex >= 0 && (
          <IconButton
            icon={<Icon.ArrowBack />}
            type="button"
            onClick={() => submitStep()}
            unstyled
          >
            {t('setUpGrbReviewForm.saveAndReturn')}
          </IconButton>
        )}
      </StepHeader>

      <GridContainer className={`grb-review-form-${step} padding-bottom-10`}>
        <StepContentWrapper data-testid="grbReviewForm-stepContentWrapper">
          <p className="line-height-body-5 text-light font-body-sm margin-top-0 margin-bottom-1">
            {grbReviewFormSteps[currentStepIndex].description}
          </p>

          {requiredFields && (
            <RequiredFieldsText className="margin-top-0 font-body-sm" />
          )}

          {children}

          <Pager
            next={{
              type: onSubmit ? 'submit' : 'button',
              onClick: () =>
                !onSubmit &&
                history.push(`${grbReviewPath}/${nextStep?.key || ''}`),
              // Disable `next` button if next step is disabled
              disabled: !!nextStep?.disabled || disabled,
              text: nextStep
                ? t('Next')
                : t('setUpGrbReviewForm.completeAndBeginReview')
            }}
            back={
              // Only show `back` button if there is a previous step
              previousStep && {
                type: 'button',
                onClick: () =>
                  history.push(`${grbReviewPath}/${previousStep.key}`)
              }
            }
            saveExitText={t('setUpGrbReviewForm.saveAndReturn')}
            taskListUrl={grbReviewPath}
            submitDisabled={!isValid || !isDirty}
            submit={() => submitStep()}
            border={false}
            className="margin-top-8 margin-bottom-3"
          />

          {isValid && isDirty && (
            <AutoSave
              values={watch?.()}
              onSave={() =>
                onSubmit?.({
                  systemIntakeID: systemId,
                  ...(watch?.() as TFieldValues)
                })
              }
              debounceDelay={3000}
            />
          )}
        </StepContentWrapper>
      </GridContainer>
    </MainContent>
  );
}

export default GRBReviewFormStepWrapper;
