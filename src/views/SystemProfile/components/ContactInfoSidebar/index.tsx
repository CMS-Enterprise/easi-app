import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Link } from '@trussworks/react-uswds';
import classnames from 'classnames';

import { DescriptionDefinition } from 'components/shared/DescriptionGroup';
import useCheckResponsiveScreen from 'hooks/checkMobile';

const ContactInfoSidebar = () => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <Grid
      desktop={{ col: 4 }}
      className={classnames({
        'sticky-nav': !isMobile
      })}
    >
      {/* Setting a ref here to reference the grid width for the fixed side nav */}
      <div className="side-divider">
        <div className="top-divider" />
        <p className="font-body-xs margin-top-1 margin-bottom-3">
          {t('singleSystem.pointOfContact')}
        </p>
        <h3 className="system-profile__subheader margin-bottom-1">
          Geraldine Hobbs {/* TODO: Get from CEDAR */}
        </h3>
        <DescriptionDefinition
          definition={t('singleSystem.summary.subheader2')}
        />
        <p>
          <Link
            aria-label={t('singleSystem.sendEmail')}
            className="line-height-body-5"
            href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
            variant="external"
            target="_blank"
          >
            {t('singleSystem.sendEmail')}
            <span aria-hidden>&nbsp;</span>
          </Link>
        </p>
        <p>
          <Link
            aria-label={t('singleSystem.moreContact')}
            className="line-height-body-5"
            href="mailto:patrick.segura@oddball.io" // TODO: Get link from CEDAR?
            target="_blank"
          >
            {t('singleSystem.moreContact')}
            <span aria-hidden>&nbsp;</span>
            <span aria-hidden>&rarr; </span>
          </Link>
        </p>
      </div>
    </Grid>
  );
};

export default ContactInfoSidebar;
