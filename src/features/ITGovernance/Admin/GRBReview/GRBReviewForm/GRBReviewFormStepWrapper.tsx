import React, { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import { SystemIntakeGRBReviewFragment } from 'gql/generated/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import { useEasiFormContext } from 'components/EasiForm';
import IconButton from 'components/IconButton';
import RequiredFieldsText from 'components/RequiredFieldsText';
import StepHeader, { StepHeaderStepProps } from 'components/StepHeader';
import { grbReviewFormSteps } from 'i18n/en-US/grbReview';
import { GrbReviewFormStepKey } from 'types/grbReview';
import { GrbReviewFormSchema } from 'validations/grbReviewSchema';

export type GRBReviewFormStepSubmit<TFieldValues extends FieldValues> = (
  values: TFieldValues & { systemIntakeID: string }
) => Promise<any>;

type GRBReviewFormStepWrapperProps<TFieldValues extends FieldValues> = {
  children: React.ReactNode;
  grbReview: SystemIntakeGRBReviewFragment;
  onSubmit?: GRBReviewFormStepSubmit<TFieldValues>;
  /** Defaults to true - shows required fields text above `children` */
  requiredFields?: boolean;
};

/** Step wrapper for the GRB review set up form */
function GRBReviewFormStepWrapper<
  TFieldValues extends FieldValues = FieldValues
>({
  children,
  grbReview,
  onSubmit,
  requiredFields = true
}: GRBReviewFormStepWrapperProps<TFieldValues>) {
  const { t } = useTranslation('grbReview');
  const history = useHistory();

  /** Formatted steps for stepped form header */
  const [steps, setSteps] = useState<StepHeaderStepProps[] | null>(null);

  const { systemId, step } = useParams<{
    systemId: string;
    step: GrbReviewFormStepKey;
  }>();

  const {
    handleSubmit,
    formState: { isValid, isDirty }
  } = useEasiFormContext<TFieldValues>();

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  const currentStepIndex: number = grbReviewFormSteps.findIndex(
    ({ key }) => key === step
  );

  /**
   * Formats form steps for stepped header
   */
  const formatSteps = useCallback(async () => {
    const { grbReviewType, grbReviewers, grbPresentationLinks } = grbReview;

    // Validate form steps with Yup

    const reviewTypeIsValid =
      await GrbReviewFormSchema.grbReviewType.isValid(grbReviewType);

    const presentationIsValid = await GrbReviewFormSchema.presentation.isValid({
      recordingLink: grbPresentationLinks?.recordingLink,
      presentationDeckFileData: grbPresentationLinks?.presentationDeckFileName
        ? {}
        : undefined
    });

    const participantsIsValid = await GrbReviewFormSchema.participants.isValid({
      grbReviewers
    });

    return grbReviewFormSteps.reduce<StepHeaderStepProps[]>(
      (acc, value, index) => {
        let completed: boolean;

        // Get validation for each step
        switch (value.key) {
          case 'review-type':
            completed = reviewTypeIsValid;
            break;

          case 'presentation':
            completed = presentationIsValid;
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
          onClick: () => {
            if (isDirty && isValid) {
              handleSubmit(values =>
                onSubmit?.({ systemIntakeID: systemId, ...values }).then(() =>
                  history.push(`${grbReviewPath}/${value.key}`)
                )
              )();
            } else {
              history.push(`${grbReviewPath}/${value.key}`);
            }
          }
        };

        return acc;
      },
      [...grbReviewFormSteps]
    );
  }, [
    grbReview,
    grbReviewPath,
    handleSubmit,
    history,
    isDirty,
    isValid,
    onSubmit,
    systemId
  ]);

  // Set form steps
  useEffect(() => {
    formatSteps().then(values => {
      setSteps(values);
    });
  }, [grbReview, formatSteps]);

  if (!steps) return null;

  return (
    <>
      <StepHeader
        step={currentStepIndex + 1}
        heading={t('setUpGrbReviewForm.heading')}
        text={t('setUpGrbReviewForm.text')}
        subText={t('setUpGrbReviewForm.subText')}
        hideSteps={currentStepIndex < 0}
        steps={steps}
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
            onClick={() => {
              if (!isValid || !isDirty) {
                return history.push(grbReviewPath);
              }

              return handleSubmit(values =>
                onSubmit?.({ systemIntakeID: systemId, ...values }).then(() =>
                  history.push(grbReviewPath)
                )
              )();
            }}
            unstyled
          >
            {t('setUpGrbReviewForm.saveAndReturn')}
          </IconButton>
        )}
      </StepHeader>

      <GridContainer className="padding-bottom-10">
        <Grid>
          {requiredFields && <RequiredFieldsText />}

          <Form
            onSubmit={handleSubmit(values =>
              onSubmit?.({ systemIntakeID: systemId, ...values }).then(() =>
                history.push(
                  `${grbReviewPath}/${grbReviewFormSteps[currentStepIndex + 1].key}`
                )
              )
            )}
          >
            {children}

            <Pager
              next={{
                type: 'submit',
                disabled: !isValid
              }}
              back={
                currentStepIndex > 0 && {
                  type: 'button',
                  onClick: () =>
                    history.push(
                      `${grbReviewPath}/${grbReviewFormSteps[currentStepIndex - 1].key}`
                    )
                }
              }
              saveExitText={t('setUpGrbReviewForm.saveAndReturn')}
              taskListUrl={grbReviewPath}
              submitDisabled={!isValid || !isDirty}
              submit={() =>
                handleSubmit(values =>
                  onSubmit?.({ systemIntakeID: systemId, ...values }).then(() =>
                    history.push(grbReviewPath)
                  )
                )()
              }
              border={false}
              className="margin-top-8 margin-bottom-3"
            />
          </Form>
        </Grid>
      </GridContainer>
    </>
  );
}

export default GRBReviewFormStepWrapper;
