import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useCacheQuery from 'hooks/useCacheQuery';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import {
  ITGovDraftBusinessCaseStatus,
  ITGovFinalBusinessCaseStatus,
  SystemIntakeStep
} from 'types/graphql-global-types';

type BusinessCaseStepWrapperProps = {
  /** Form page title */
  title: string;
  systemIntakeId: string;
  /** Form step content and fields */
  children: React.ReactNode;
  /** Form errors object */
  errors?: Record<string, string>;
  description?: React.ReactNode;
  /** Whether to show "all fields are mandatory" alert - defaults to false */
  fieldsMandatory?: boolean;
  className?: string;
  'data-testid'?: string;
};

/**
 * Wrapper for Business Case form steps
 *
 * Wraps `children` in form step title, error alert, and feedback banner
 */
const BusinessCaseStepWrapper = ({
  title,
  description,
  systemIntakeId,
  errors,
  children,
  fieldsMandatory = false,
  className,
  ...props
}: BusinessCaseStepWrapperProps) => {
  const { t } = useTranslation('form');

  const { data } = useCacheQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: systemIntakeId
    }
  });

  const isFinal: boolean =
    data?.systemIntake?.step === SystemIntakeStep.FINAL_BUSINESS_CASE;

  /** Whether or not Business Case has edits requested */
  const hasEditsRequested: boolean = useMemo(() => {
    const { bizCaseDraftStatus, bizCaseFinalStatus } =
      data?.systemIntake?.itGovTaskStatuses || {};

    if (isFinal) {
      return (
        bizCaseFinalStatus === ITGovFinalBusinessCaseStatus.EDITS_REQUESTED
      );
    }

    return bizCaseDraftStatus === ITGovDraftBusinessCaseStatus.EDITS_REQUESTED;
  }, [data, isFinal]);

  return (
    <div className={classNames('grid-container', className)} {...props}>
      {errors && Object.keys(errors).length > 0 && (
        <ErrorAlert
          classNames="margin-top-3"
          heading={t('inputError.checkFix')}
          testId="formik-validation-errors"
        >
          {Object.keys(errors).map(key => {
            return (
              <ErrorAlertMessage
                key={`Error.${key}`}
                errorKey={key}
                message={errors[key]}
              />
            );
          })}
        </ErrorAlert>
      )}

      <PageHeading className="margin-bottom-4">{title}</PageHeading>

      {hasEditsRequested && (
        <FeedbackBanner
          id={systemIntakeId}
          type={isFinal ? 'Final Business Case' : 'Draft Business Case'}
          className="margin-top-3"
        />
      )}

      <div className="line-height-body-6 tablet:grid-col-9">
        {typeof description === 'string' ? <p>{description}</p> : description}
      </div>

      {fieldsMandatory && (
        <MandatoryFieldsAlert className="tablet:grid-col-5" />
      )}

      {children}
    </div>
  );
};

export default BusinessCaseStepWrapper;
