import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Button, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import useCheckResponsiveScreen from 'hooks/checkMobile';
import { SubpageKey, SystemProfileData } from 'types/systemProfile';

import sideNavItems from '..';

import './index.scss';

type SystemSubNavProps = {
  subinfo: string;
  system: SystemProfileData;
  systemProfileHiddenFields: boolean;
  modal?: boolean;
  setModalSubpage?: (key: SubpageKey) => void;
};

const SystemSubNav = ({
  subinfo,
  system,
  systemProfileHiddenFields,
  modal,
  setModalSubpage
}: SystemSubNavProps) => {
  const { t } = useTranslation('systemProfile');
  const isMobile = useCheckResponsiveScreen('tablet');
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fixes edge case: subnavigation remains open when user (when in small screen size) expands window to large size really fast (using window manager)
    if (!isMobile) {
      setIsAccordionOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="system-detail__subNav-accordion">
      <button
        type="button"
        className="usa-menu-btn easi-header__basic width-full"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        aria-expanded={isAccordionOpen}
        aria-controls="system-detail__subNav"
      >
        <h3 className="padding-left-1">{t(`navigation.${subinfo}`)}</h3>
        {!isAccordionOpen ? (
          <Icon.ExpandMore aria-hidden size={3} />
        ) : (
          <Icon.ExpandLess size={3} aria-hidden />
        )}
      </button>
      {isAccordionOpen && (
        <div
          id="system-detail__subNav"
          className="system-detail__subNav__list-container bg-primary-dark"
        >
          <ul className="system-detail__subNav__list subNav">
            {Object.keys(sideNavItems(system, systemProfileHiddenFields)).map(
              (key: string) => (
                <li
                  key={key}
                  className={classnames({
                    'subNav__item--group-border': sideNavItems(
                      system,
                      systemProfileHiddenFields
                    )[key].groupEnd
                  })}
                >
                  {modal && setModalSubpage ? (
                    <Button
                      className={classnames({
                        'subNav--current': key === subinfo
                      })}
                      type="button"
                      onClick={() => {
                        setModalSubpage(key as SubpageKey);
                        setIsAccordionOpen(!isAccordionOpen);
                      }}
                      unstyled
                    >
                      {t(`navigation.${key}`)}
                    </Button>
                  ) : (
                    <NavLink
                      to={
                        sideNavItems(system, systemProfileHiddenFields)[key]
                          .route
                      }
                      key={key}
                      className={classnames({
                        'subNav--current': key === subinfo
                      })}
                      onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    >
                      {t(`navigation.${key}`)}
                    </NavLink>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemSubNav;
