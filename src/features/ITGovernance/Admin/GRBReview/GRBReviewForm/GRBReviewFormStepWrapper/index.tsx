import React, { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { FetchResult } from '@apollo/client';
import { Form, GridContainer, Icon } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import { SystemIntakeGRBReviewFragment } from 'gql/generated/graphql';

import AutoSave from 'components/AutoSave';
import Breadcrumbs from 'components/Breadcrumbs';
import { useEasiFormContext } from 'components/EasiForm';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import RequiredFieldsText from 'components/RequiredFieldsText';
import StepHeader, { StepHeaderStepProps } from 'components/StepHeader';
import useMessage from 'hooks/useMessage';
import { grbReviewFormSteps } from 'i18n/en-US/grbReview';
import { GrbReviewFormStepKey } from 'types/grbReview';
import { GrbReviewFormSchema } from 'validations/grbReviewSchema';

export type GRBReviewFormStepSubmit<
  TFieldValues extends FieldValues = FieldValues
> = (values: TFieldValues & { systemIntakeID: string }) => Promise<FetchResult>;

type GRBReviewFormStepWrapperProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  children: React.ReactNode;
  grbReview: SystemIntakeGRBReviewFragment;
  /** onSubmit function for form step */
  onSubmit: GRBReviewFormStepSubmit<TFieldValues>;
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

  const {
    handleSubmit,
    watch,
    formState: { isValid, isDirty }
  } = useEasiFormContext<TFieldValues>();

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  const currentStepIndex: number = grbReviewFormSteps.findIndex(
    ({ key }) => key === step
  );

  const previousStep: StepHeaderStepProps | undefined =
    currentStepIndex > -1 ? steps[currentStepIndex - 1] : undefined;

  const nextStep: StepHeaderStepProps | undefined =
    currentStepIndex > -1 ? steps[currentStepIndex + 1] : undefined;

  /** Submits form step and redirects user */
  const submitStep = useCallback(
    async ({
      shouldValidate = true,
      path = ''
    }: {
      /** If false, does not submit if fields are invalid. Defaults to true. */
      shouldValidate?: boolean;
      /** Appends to `grbReviewPath` - leave undefined to return to GRB review tab after submit */
      path?: string;
    }) => {
      // Redirect user without submit if no changes or skipping validation
      if (!isDirty || (!shouldValidate && !isValid)) {
        return history.push(`${grbReviewPath}/${path}`);
      }

      return handleSubmit(values =>
        onSubmit({ systemIntakeID: systemId, ...values })
          .then(() => history.push(`${grbReviewPath}/${path}`))
          // Show error message if validating fields, otherwise redirect
          .catch(() => {
            if (shouldValidate) {
              showMessage(t('setUpGrbReviewForm.error'), { type: 'error' });
            } else {
              history.push(`${grbReviewPath}/${path}`);
            }
          })
      )();
    },
    [
      grbReviewPath,
      isValid,
      isDirty,
      handleSubmit,
      onSubmit,
      history,
      systemId,
      showMessage,
      t
    ]
  );

  /**
   * Formats form steps for stepped header
   */
  const formatSteps = useCallback(async () => {
    const { grbReviewType, grbReviewers, grbDate } = grbReview;

    // Validate form steps with Yup

    const reviewTypeIsValid = await GrbReviewFormSchema.reviewType.isValid({
      grbReviewType
    });

    // console.log(grbDate, grbReviewType);
    const presentationIsValid = await GrbReviewFormSchema.presentation.isValid({
      grbDate,
      grbReviewType
    });
    console.log(presentationIsValid);

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
          onClick: () => submitStep({ path: value.key })
        };

        return acc;
      },
      [...grbReviewFormSteps]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grbReview, submitStep, disabled]);

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
            onClick={() => submitStep({ shouldValidate: false })}
            unstyled
          >
            {t('setUpGrbReviewForm.saveAndReturn')}
          </IconButton>
        )}
      </StepHeader>

      <GridContainer className={`grb-review-form-${step} padding-bottom-10`}>
        <Form
          role="form"
          className="step-content-wrapper maxw-none"
          data-testid="grbReviewForm-stepContentWrapper"
          onSubmit={e => {
            e.preventDefault();
            submitStep({ path: nextStep?.key });
          }}
        >
          <p className="line-height-body-5 text-light font-body-sm margin-top-0 margin-bottom-1">
            {grbReviewFormSteps[currentStepIndex].description}
          </p>

          {requiredFields && (
            <RequiredFieldsText className="margin-top-0 font-body-sm" />
          )}

          {children}

          <Pager
            next={{
              disabled: !isValid,
              text: nextStep
                ? t('Next')
                : t('setUpGrbReviewForm.completeAndBeginReview')
            }}
            back={
              // Only show `back` button if there is a previous step
              previousStep && {
                type: 'button',
                // Save fields on back click if valid
                onClick: () =>
                  submitStep({ shouldValidate: false, path: previousStep.key })
              }
            }
            saveExitText={t('setUpGrbReviewForm.saveAndReturn')}
            taskListUrl={grbReviewPath}
            submitDisabled={!isValid || !isDirty}
            submit={() => submitStep({ shouldValidate: false })}
            border={false}
            className="margin-top-8 margin-bottom-3"
          />

          {isValid && isDirty && (
            <AutoSave
              values={watch()}
              onSave={() =>
                onSubmit({
                  systemIntakeID: systemId,
                  ...watch()
                })
              }
              debounceDelay={3000}
            />
          )}
        </Form>
      </GridContainer>
    </MainContent>
  );
}

export default GRBReviewFormStepWrapper;
