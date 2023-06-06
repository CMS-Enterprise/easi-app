import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';

type AdminView = 'TRB' | 'GRT';

type AdminHomeProps = { isTrbAdmin: boolean; isGrtReviewer: boolean };

/**
 * Admin homepage view
 */
const AdminHome = ({ isTrbAdmin, isGrtReviewer }: AdminHomeProps) => {
  const { t } = useTranslation('home');

  /**
   * Which admin view to display
   *
   * Defaults to TRB if user is both TRB and GRT admin
   */
  const [adminView] = useState<AdminView | undefined>(() => {
    if (isTrbAdmin) return 'TRB';
    if (isGrtReviewer) return 'GRT';
    return undefined;
  });

  const { message } = useMessage();

  // Hide admin view if user is not TRB or GRT admin
  if (!adminView) return null;

  return (
    <div>
      {message && (
        <div className="grid-container margin-top-6">
          <Alert type="success" role="alert">
            {message}
          </Alert>
        </div>
      )}
      <GridContainer>
        <PageHeading className="margin-bottom-1">
          {t(`adminHome.${adminView}.title`)}
        </PageHeading>

        <p className="font-body-lg line-height-body-5 text-light margin-top-105">
          {t(`adminHome.${adminView}.description`)}
        </p>
      </GridContainer>
    </div>
  );
};

export default AdminHome;
