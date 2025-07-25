import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Icon, Label } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import Alert from 'components/Alert';
import AutoSave from 'components/AutoSave';
import CollapsableLink from 'components/CollapsableLink';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';
import PageNumber from 'components/PageNumber';
import RequiredAsterisk from 'components/RequiredAsterisk';
import TextAreaField from 'components/TextAreaField';
import { BusinessCaseModel, RequestDescriptionForm } from 'types/businessCase';
import flattenErrors from 'utils/flattenErrors';
import { BusinessCaseSchema } from 'validations/businessCaseSchema';

import BusinessCaseStepWrapper from '../BusinessCaseStepWrapper';

type RequestDescriptionProps = {
  businessCase: BusinessCaseModel;
  formikRef: any;
  dispatchSave: () => void;
  isFinal: boolean;
};

const RequestDescription = ({
  businessCase,
  formikRef,
  dispatchSave,
  isFinal
}: RequestDescriptionProps) => {
  const { t } = useTranslation('businessCase');
  const history = useHistory();

  const initialValues = {
    businessNeed: businessCase.businessNeed,
    collaborationNeeded: businessCase.collaborationNeeded,
    currentSolutionSummary: businessCase.currentSolutionSummary,
    cmsBenefit: businessCase.cmsBenefit,
    priorityAlignment: businessCase.priorityAlignment,
    successIndicators: businessCase.successIndicators,
    responseToGRTFeedback: businessCase.responseToGRTFeedback
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={dispatchSave}
      validationSchema={BusinessCaseSchema(isFinal).requestDescription}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<RequestDescriptionForm>) => {
        const { values, errors, setErrors, validateForm } = formikProps;
        const flatErrors = flattenErrors(errors);

        return (
          <BusinessCaseStepWrapper
            systemIntakeId={businessCase.systemIntakeId}
            title={t('requestDescription')}
            data-testid="request-description"
            errors={flatErrors}
          >
            <Form className="tablet:grid-col-9 margin-bottom-6">
              {/* Required fields help text and alert */}
              <HelpText className="margin-top-1 text-base">
                <Trans
                  i18nKey="businessCase:requiredFields"
                  components={{ red: <span className="text-red" /> }}
                />
              </HelpText>

              {!isFinal && (
                <Alert
                  type="info"
                  className="margin-top-2"
                  data-testid="draft-business-case-fields-alert"
                  slim
                >
                  {t('businessCase:draftAlert')}
                </Alert>
              )}

              <FieldGroup
                scrollElement="businessNeed"
                error={!!flatErrors.businessNeed}
              >
                <Label
                  htmlFor="BusinessCase-BusinessNeed"
                  className="maxw-none"
                >
                  {t('businessNeed.label')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-BusinessNeedHelp"
                  className="margin-top-1"
                >
                  {t('businessNeed.include')}
                  <ul className="margin-top-1 padding-left-205">
                    <li>{t('businessNeed.mandates')}</li>
                    <li>{t('businessNeed.investmentBenefits')}</li>
                    <li>{t('businessNeed.deadlines')}</li>
                    <li>{t('businessNeed.solutionBenefits')}</li>
                  </ul>
                </HelpText>
                <FieldErrorMsg>{flatErrors.businessNeed}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.businessNeed}
                  id="BusinessCase-BusinessNeed"
                  maxLength={2000}
                  name="businessNeed"
                  aria-describedby="BusinessCase-BusinessNeedCounter BusinessCase-BusinessNeedHelp"
                />
              </FieldGroup>

              <FieldGroup
                scrollElement="collaborationNeeded"
                error={!!flatErrors.collaborationNeeded}
              >
                <Label
                  htmlFor="BusinessCase-CollaborationNeeded"
                  className="maxw-none"
                >
                  {t('collaborationNeeded')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-CollaborationNeededHelp"
                  className="margin-top-1"
                >
                  {t('collaborationNeededHelpText')}
                </HelpText>
                <FieldErrorMsg>{flatErrors.collaborationNeeded}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.collaborationNeeded}
                  id="BusinessCase-CollaborationNeeded"
                  maxLength={2000}
                  name="collaborationNeeded"
                  aria-describedby="BusinessCase-CollaborationNeededCounter BusinessCase-CollaborationNeededHelp"
                />
              </FieldGroup>

              <FieldGroup
                scrollElement="currentSolutionSummary"
                error={!!flatErrors.currentSolutionSummary}
              >
                <Label
                  htmlFor="BusinessCase-CurrentSolutionSummary"
                  className="maxw-none"
                >
                  {t('currentSolutionSummary')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-CurrentSolutionSummaryHelp"
                  className="margin-top-1"
                >
                  {t('currentSolutionSummaryHelpText')}
                </HelpText>
                <FieldErrorMsg>
                  {flatErrors.currentSolutionSummary}
                </FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.currentSolutionSummary}
                  id="BusinessCase-CurrentSolutionSummary"
                  maxLength={2000}
                  name="currentSolutionSummary"
                  aria-describedby="BusinessCase-CurrentSolutionSummaryCounter BusinessCase-CurrentSolutionSummaryHelp"
                />
              </FieldGroup>
              <FieldGroup
                scrollElement="cmsBenefit"
                error={!!flatErrors.cmsBenefit}
              >
                <Label htmlFor="BusinessCase-CmsBenefit" className="maxw-none">
                  {t('cmsBenefit')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-CmsBenefitHelp"
                  className="margin-top-1"
                >
                  {t('cmsBenefitHelpText')}
                </HelpText>
                <FieldErrorMsg>{flatErrors.cmsBenefit}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.cmsBenefit}
                  id="BusinessCase-CmsBenefit"
                  maxLength={2000}
                  name="cmsBenefit"
                  aria-describedby="BusinessCase-CmsBenefitCounter BusinessCase-CmsBenefitHelp"
                />
              </FieldGroup>
              <FieldGroup
                scrollElement="priorityAlignment"
                error={!!flatErrors.priorityAlignment}
              >
                <Label
                  htmlFor="BusinessCase-PriorityAlignment"
                  className="maxw-none"
                >
                  {t('priorityAlignment')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-PriorityAlignmentHelp"
                  className="margin-top-1"
                >
                  {t('priorityAlignmentHelpText')}
                </HelpText>
                <CollapsableLink
                  id="BusinessCase-examplePriorityAlignment"
                  label={t('priorityAlignmentExample.label')}
                  className="margin-top-1 margin-bottom-1"
                >
                  <div className="line-height-sans-4">
                    {t('priorityAlignmentExample.description')}
                  </div>
                </CollapsableLink>
                <FieldErrorMsg>{flatErrors.priorityAlignment}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.priorityAlignment}
                  id="BusinessCase-PriorityAlignment"
                  maxLength={2000}
                  name="priorityAlignment"
                  aria-describedby="BusinessCase-PriorityAlignmentCounter BusinessCase-PriorityAlignmentHelp"
                />
              </FieldGroup>
              <FieldGroup
                scrollElement="successIndicators"
                error={!!flatErrors.successIndicators}
              >
                <Label
                  htmlFor="BusinessCase-SuccessIndicators"
                  className="maxw-none"
                >
                  {t('successIndicators')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-SuccessIndicatorsHelp"
                  className="margin-top-1"
                >
                  {t('successIndicatorsHelpText')}
                </HelpText>
                <CollapsableLink
                  id="BusinessCase-exampleSuccessIndicators"
                  label={t('successIndicatorsExamples.label')}
                  className="margin-top-1 margin-bottom-1"
                >
                  <div className="line-height-sans-4">
                    {t('successIndicatorsExamples.description')}
                  </div>
                </CollapsableLink>
                <FieldErrorMsg>{flatErrors.successIndicators}</FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.successIndicators}
                  id="BusinessCase-SuccessIndicators"
                  maxLength={2000}
                  name="successIndicators"
                  aria-describedby="BusinessCase-SuccessIndicatorsCounter BusinessCase-SuccessIndicatorsHelp"
                />
              </FieldGroup>

              <FieldGroup
                scrollElement="responseToGRTFeedback"
                error={!!flatErrors.responseToGRTFeedback}
              >
                <Label
                  htmlFor="BusinessCase-ResponseToGRTFeedback"
                  className="maxw-none"
                >
                  {t('responseToGRTFeedback')}
                  <RequiredAsterisk />
                </Label>
                <HelpText
                  id="BusinessCase-ResponseToGRTFeedbackHelp"
                  className="margin-top-1"
                >
                  {t('responseToGRTFeedbackHelpText')}
                </HelpText>
                <FieldErrorMsg>
                  {flatErrors.responseToGRTFeedback}
                </FieldErrorMsg>
                <Field
                  as={TextAreaField}
                  error={!!flatErrors.responseToGRTFeedback}
                  id="BusinessCase-ResponseToGRTFeedback"
                  maxLength={2000}
                  name="responseToGRTFeedback"
                  aria-describedby="BusinessCase-ResponseToGRTFeedbackCounter BusinessCase-ResponseToGRTFeedbackHelp"
                />
              </FieldGroup>
            </Form>

            <ButtonGroup>
              <Button
                type="button"
                outline
                onClick={() => {
                  dispatchSave();
                  setErrors({});
                  const newUrl = 'general-request-info';
                  history.push(newUrl);
                }}
              >
                {t('Back')}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  validateForm().then(err => {
                    if (Object.keys(err).length === 0) {
                      dispatchSave();
                      const newUrl = 'alternative-analysis';
                      history.push(newUrl);
                    } else {
                      window.scrollTo(0, 0);
                    }
                  });
                }}
              >
                {t('Next')}
              </Button>
            </ButtonGroup>

            <IconButton
              type="button"
              icon={<Icon.ArrowBack aria-hidden />}
              className="margin-bottom-3 margin-top-2"
              onClick={() => {
                dispatchSave();
                history.push(
                  `/governance-task-list/${businessCase.systemIntakeId}`
                );
              }}
              unstyled
            >
              {t('saveAndExit')}
            </IconButton>

            <PageNumber currentPage={2} totalPages={4} />

            <AutoSave
              values={values}
              onSave={dispatchSave}
              debounceDelay={1000 * 3}
            />
          </BusinessCaseStepWrapper>
        );
      }}
    </Formik>
  );
};

export default RequestDescription;
