import React from 'react';
import { Link } from '@trussworks/react-uswds';

type TestDatesProps = {
  date: string;
  isInitial: boolean;
  testIndex: number;
  score?: string; // This type might need to be changed based on API model
};

const TestDates = ({ date, isInitial, testIndex, score }: TestDatesProps) => {
  return (
    <div className="bg-gray-10 padding-2 line-height-body-4">
      <div className="text-bold margin-bottom-1">
        Test {testIndex}: {isInitial ? 'Initial' : 'Remediation'}
      </div>
      <div className="margin-bottom-1">
        <div className="display-inline-block margin-right-2">{date}</div>
        <div
          className="display-inline-block text-base-dark"
          data-testid="score"
        >
          {score || 'Score not added'}
        </div>
      </div>
      <div>
        <Link href="/" className="margin-right-2">
          Edit
        </Link>
        <Link href="/">Remove</Link>
      </div>
    </div>
  );
};

export default TestDates;
