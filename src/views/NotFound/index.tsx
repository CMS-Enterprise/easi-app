import React from 'react';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import Header from 'components/Header';
import MainContent from 'components/MainContent';

import './index.scss';

const NotFound = () => {
  return (
    <div className="easi-not-found">
      <Header />
      <MainContent className="grid-container">
        <div className="margin-y-7">
          <h1 className="font-heading-3xl">This page cannot be found.</h1>
          <p>Here is a list of things you could try to check and fix:</p>

          <ul className="easi-not-found__error_suggestions">
            <li>Please check if the address you typed in is correct.</li>
            <li>
              If you&apos;ve typed the address right checking the spelling.
            </li>
            <li>
              If you&apos;ve copied and apasted the address, check that
              you&apos;ve copied the entire address.
            </li>
          </ul>
          <p className="margin-bottom-5">
            If none of the above have solted the problem, please return to the
            home page and try again.
          </p>
          <UswdsLink className="usa-button" variant="unstyled" href="/">
            Go back to the home page
          </UswdsLink>
        </div>
      </MainContent>
    </div>
  );
};

export default NotFound;
