import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, FormGroup, GridContainer } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import RequestRepository from 'components/RequestRepository';
import Label from 'components/shared/Label';
import useMessage from 'hooks/useMessage';
import TrbAdminTeamHome from 'views/TechnicalAssistance/TrbAdminTeamHome';

type AdminView = 'TRB' | 'GRT';

type AdminHomeProps = { isTrbAdmin: boolean; isGrtReviewer: boolean };

/**
 * Admin homepage view
 */
const AdminHome = ({ isTrbAdmin, isGrtReviewer }: AdminHomeProps) => {
  const { t } = useTranslation('home');
  const { Message } = useMessage();

  /**
   * Which admin view to display
   *
   * Defaults to TRB if user is both TRB and GRT admin
   */
  const [adminView, setAdminView] = useState<AdminView | null | undefined>(
    () => {
      if (isTrbAdmin && isGrtReviewer && localStorage.getItem('admin-view'))
        return localStorage.getItem('admin-view') as AdminView;

      if (isTrbAdmin) return 'TRB';
      if (isGrtReviewer) return 'GRT';
      return undefined;
    }
  );

  const showViewSelect: boolean = isTrbAdmin && isGrtReviewer;

  // Update local storage with admin view selection
  useEffect(() => {
    localStorage.setItem('admin-view', adminView || '');
  }, [adminView]);

  // Hide admin view if user is not TRB or GRT admin
  if (!adminView) return null;

  return (
    <div>
      <div className="grid-container margin-top-6">
        <Message />
      </div>
      <GridContainer>
        <PageHeading className="margin-bottom-1">
          {t(`adminHome.${adminView}.title`)}
        </PageHeading>

        {
          /* Admin view dropdown */
          showViewSelect && (
            <FormGroup className="tablet:display-flex tablet:flex-align-center">
              <Label htmlFor="select-admin-view" className="margin-right-2">
                {t('adminHome.selectLabel')}
              </Label>
              <Dropdown
                id="select-admin-view-field"
                name="select-admin-view"
                data-testid="select-admin-view"
                className="maxw-card tablet:margin-top-0"
                value={adminView}
                onChange={e => setAdminView(e.target.value as AdminView)}
              >
                <option value="TRB">{t('adminHome.TRB.label')}</option>
                <option value="GRT">{t('adminHome.GRT.label')}</option>
              </Dropdown>
            </FormGroup>
          )
        }

        <p className="font-body-lg line-height-body-5 text-light margin-top-105">
          {t(`adminHome.${adminView}.description`)}
        </p>
      </GridContainer>

      {
        /* Requests table */
        adminView === 'GRT' ? <RequestRepository /> : <TrbAdminTeamHome />
      }
    </div>
  );
};

export default AdminHome;
