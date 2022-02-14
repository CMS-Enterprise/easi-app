import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  //   Alert,
  //   Button,
  //   Card,
  //   CardFooter,
  //   CardGroup,
  //   CardHeader,
  Grid,
  GridContainer,
  Link
  //   ProcessList,
  //   ProcessListHeading,
  //   ProcessListItem
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import {
  DescriptionDefinition
  //   DescriptionTerm
} from 'components/shared/DescriptionGroup';
// import Divider from 'components/shared/Divider';
import SectionWrapper from 'components/shared/SectionWrapper';
import Tag from 'components/shared/Tag';
import useCheckResponsiveScreen from 'hooks/checkMobile';
// import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import { tempCedarSystemProps } from 'views/Sandbox/mockSystemData';

type SystemDataProps = {
  system: tempCedarSystemProps; // TODO: Once additional CEDAR data is define, change to GQL generated type
};

const SystemData = ({ system }: SystemDataProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  return (
    <div id="system-data">
      <GridContainer className="padding-left-0 padding-right-0">
        <Grid row gap>
          <Grid desktop={{ col: 8 }}>
            <SectionWrapper
              borderBottom
              className="margin-bottom-4 padding-bottom-4"
            >
              <h2 className="margin-top-0">
                {t('singleSystem.systemData.header')}
              </h2>

              {/* TODO: Map and populate tags with CEDAR */}
              <h3 className="margin-top-2 margin-bottom-1">
                {t('singleSystem.systemData.recordCategories')}
              </h3>
              {system?.developmentTags?.map((tag: string) => (
                <Tag
                  key={tag}
                  className="system-profile__tag text-base-darker bg-base-lighter margin-bottom-1"
                >
                  {tag} {/* TODO: Map defined CEDAR variable once availabe */}
                </Tag>
              ))}
            </SectionWrapper>
          </Grid>
          {/* Point of contact/ miscellaneous info */}
          <Grid
            tablet={{ col: 4 }}
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
                Geraldine Hobbs
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
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SystemData;
