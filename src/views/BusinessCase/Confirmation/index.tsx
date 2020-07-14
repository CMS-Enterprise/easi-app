import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Confirmation = () => {
  const { businessCaseId } = useParams();
  return (
    <div className="margin-bottom-7">
      <div className="grid-container">
        <h1 className="font-heading-xl margin-top-4">
          Your Business Case has been submitted
        </h1>
        <h2 className="margin-bottom-8 text-normal">
          Your reference ID is: {businessCaseId}
        </h2>
        <p className="margin-y-8">
          Help us improve EASi.{' '}
          <a
            href="https://www.surveymonkey.com/r/JNYSMZP"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open EASi survey in a new tab"
          >
            Tell us what you think of this service (opens in a new tab)
          </a>
        </p>
        <div>
          <Link to="/">
            <i className="fa fa-angle-left margin-x-05" aria-hidden />
            Go back to EASi homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
