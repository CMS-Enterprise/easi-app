import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { IconArrowBack, IconFileDownload } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Divider from 'components/shared/Divider';
import IconButton from 'components/shared/IconButton';
import IconLink from 'components/shared/IconLink';
import useCacheQuery from 'hooks/useCacheQuery';
import GetGovernanceRequestFeedbackQuery from 'queries/GetGovernanceRequestFeedbackQuery';
import {
  GetGovernanceRequestFeedback,
  GetGovernanceRequestFeedbackVariables
} from 'queries/types/GetGovernanceRequestFeedback';

import FeedbackItem from './FeedbackItem';

type FeedbackListProps = {
  systemIntakeId: string;
  /** Props for optional link to return to task list, form, etc */
  returnLink?: {
    text: string;
    path: string;
  };
};

/**
 * List of feedback items for intake requests
 *
 * Includes functionality to download feedback as PDF
 */
const FeedbackList = ({ systemIntakeId, returnLink }: FeedbackListProps) => {
  const { t } = useTranslation('taskList');

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: `Feedback for ${systemIntakeId}.pdf`,
    content: () => printRef.current,
    pageStyle: `
      @page {
        margin: auto;
      }
    `
  });

  const { data, loading } = useCacheQuery<
    GetGovernanceRequestFeedback,
    GetGovernanceRequestFeedbackVariables
  >(GetGovernanceRequestFeedbackQuery, {
    variables: {
      intakeID: systemIntakeId
    }
  });

  const feedback = data?.systemIntake?.governanceRequestFeedbacks || [];

  /** Return and PDF download links */
  const ActionLinks = () => (
    <div className="tablet:display-flex">
      {!!returnLink && (
        <>
          <IconLink
            to={returnLink.path}
            icon={<IconArrowBack />}
            className="margin-bottom-1 tablet:margin-bottom-0"
          >
            {returnLink.text}
          </IconLink>
          <span className="margin-x-2 text-base-light display-none tablet:display-block">
            |
          </span>
        </>
      )}
      <IconButton
        type="button"
        onClick={handlePrint}
        icon={<IconFileDownload />}
        unstyled
      >
        {t('feedbackV2.downloadAsPDF')}
      </IconButton>
    </div>
  );

  if (loading) return <PageLoading />;

  return (
    <>
      <ActionLinks />

      <div ref={printRef}>
        <PageHeading className="easi-only-print">
          {t('governanceReviewTeam:feedback.title')}
        </PageHeading>

        <ul
          className="usa-list--unstyled margin-top-4"
          data-testid="feedback-list"
        >
          {[...feedback].reverse().map(item => (
            <FeedbackItem key={item.id} {...item} />
          ))}
        </ul>
      </div>

      <Divider className="margin-bottom-4 easi-no-print" />

      <ActionLinks />
    </>
  );
};

export default FeedbackList;
