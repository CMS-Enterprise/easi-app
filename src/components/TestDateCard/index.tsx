import React from 'react';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import { formatDate } from 'utils/date';

type TestDateCardProps = {
  date: string; // ISO string
  type: 'INITIAL' | 'REMEDIATION';
  testIndex: number;
  score: number | null; // A whole number representing tenths of a percent
  requestId: string;
  id: string;
};

const TestDateCard = ({
  date,
  type,
  testIndex,
  score,
  requestId,
  id
}: TestDateCardProps) => {
  const testScore = () => {
    if (score === 0) {
      return '0%';
    }

    return score ? `${(score / 10).toFixed(1)}%` : 'Score not added';
  };
  return (
    <div className="bg-gray-10 padding-2 line-height-body-4 margin-bottom-2">
      <div className="text-bold margin-bottom-1">
        Test {testIndex}: {type === 'INITIAL' ? 'Initial' : 'Remediation'}
      </div>
      <div className="margin-bottom-1">
        <div className="display-inline-block margin-right-2">
          {formatDate(date)}
        </div>
        <div
          className="display-inline-block text-base-dark"
          data-testid="score"
        >
          {testScore()}
        </div>
      </div>
      <div>
        <UswdsLink
          asCustom={Link}
          to={`/508/requests/${requestId}/test-date/${id}`}
          aria-label={`Edit test ${testIndex} ${type}`}
        >
          Edit
        </UswdsLink>
        {/* <Link href="/" aria-label={`Remove test ${testIndex} ${type}`}>
          Remove
        </Link> */}
      </div>
    </div>
  );
};

export default TestDateCard;
