import React, { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';

import Breadcrumbs from 'components/Breadcrumbs';
import { useEasiFormContext } from 'components/EasiForm';
import IconButton from 'components/IconButton';
import RequiredFieldsText from 'components/RequiredFieldsText';
import StepHeader from 'components/StepHeader';

export type GRBReviewFormStepSubmit<TFieldValues extends FieldValues> = (
  values: TFieldValues & { systemIntakeID: string }
) => Promise<any>;

type GRBReviewFormStepWrapperProps<TFieldValues extends FieldValues> = {
  children: React.ReactNode;
  onSubmit?: GRBReviewFormStepSubmit<TFieldValues>;
  /** Defaults to true - shows required fields text above `children` */
  requiredFields?: boolean;
};

/** Step wrapper for the GRB review set up form */
function GRBReviewFormStepWrapper<
  TFieldValues extends FieldValues = FieldValues
>({
  children,
  onSubmit,
  requiredFields = true
}: GRBReviewFormStepWrapperProps<TFieldValues>) {
  const { t } = useTranslation('grbReview');
  const history = useHistory();

  const { systemId, step } = useParams<{ systemId: string; step: string }>();

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  const formSteps: Array<{ label: string; description: string; key: string }> =
    t('setUpGrbReviewForm.steps', {
      returnObjects: true
    });

  const currentStepIndex: number = useMemo(() => {
    if (!step) return 0;

    return formSteps.findIndex(({ key }) => key === step);
  }, [formSteps, step]);

  const {
    handleSubmit,
    formState: { isValid }
  } = useEasiFormContext<TFieldValues>();

  return (
    <>
      <StepHeader
        step={currentStepIndex + 1}
        heading={t('setUpGrbReviewForm.heading')}
        text={t('setUpGrbReviewForm.text')}
        subText={t('setUpGrbReviewForm.subText')}
        hideSteps={currentStepIndex < 0}
        steps={formSteps.map((formStep, index) => {
          return {
            ...formStep,
            completed: index <= currentStepIndex,
            onClick: () => history.push(`${grbReviewPath}/${formStep.key}`)
          };
        })}
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
              if (!isValid) {
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
                  `${grbReviewPath}/${formSteps[currentStepIndex + 1].key}`
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
                      `${grbReviewPath}/${formSteps[currentStepIndex - 1].key}`
                    )
                }
              }
              saveExitText={t('setUpGrbReviewForm.saveAndReturn')}
              taskListUrl={grbReviewPath}
              submitDisabled={!isValid}
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
