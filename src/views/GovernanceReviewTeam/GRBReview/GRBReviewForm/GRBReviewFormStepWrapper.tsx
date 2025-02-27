import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, GridContainer, Icon } from '@trussworks/react-uswds';

import RequiredFieldsText from 'components/RequiredFieldsText';
import Breadcrumbs from 'components/shared/Breadcrumbs';
import IconButton from 'components/shared/IconButton';
import StepHeader from 'components/StepHeader';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

type GRBReviewFormStepWrapperProps = {
  children: React.ReactNode;
  /** Defaults to true - shows required fields text above `children` */
  requiredFields?: boolean;
};

/** Step wrapper for the GRB review set up form */
const GRBReviewFormStepWrapper = ({
  children,
  requiredFields = true
}: GRBReviewFormStepWrapperProps) => {
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

  return (
    <>
      <StepHeader
        step={currentStepIndex + 1}
        heading={t('setUpGrbReviewForm.heading')}
        text={t('setUpGrbReviewForm.text')}
        subText={t('setUpGrbReviewForm.subText')}
        hideSteps={currentStepIndex < 0}
        steps={formSteps.map((formStep, index) => ({
          ...formStep,
          // TODO: Fix step props
          completed: index <= currentStepIndex,
          disabled: index === currentStepIndex,
          onClick: () => history.push(`${grbReviewPath}/${formStep.key}`)
        }))}
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
            onClick={() =>
              // TODO: Save form before returning to request

              history.push(grbReviewPath)
            }
            unstyled
          >
            {t('setUpGrbReviewForm.saveAndReturn')}
          </IconButton>
        )}
      </StepHeader>

      <GridContainer className="padding-bottom-10">
        <Grid>
          {requiredFields && <RequiredFieldsText />}

          {children}

          <Pager
            next={{
              type: 'submit'
            }}
            back={{
              type: 'button'
            }}
            saveExitText={t('setUpGrbReviewForm.saveAndReturn')}
            taskListUrl={grbReviewPath}
            border={false}
            className="margin-top-8 margin-bottom-3"
          />
        </Grid>
      </GridContainer>
    </>
  );
};

export default GRBReviewFormStepWrapper;
