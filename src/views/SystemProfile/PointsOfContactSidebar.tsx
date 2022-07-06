import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLaunch, Link } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { DescriptionDefinition } from 'components/shared/DescriptionGroup';
import {
  RoleTypeId,
  SubpageKey,
  SystemProfileSubviewProps,
  UsernameWithRoles
} from 'types/systemProfile';

import pointsOfContactIds from './pointsOfContactIds';
import { getPersonFullName } from '.';

/**
 * Get a list of subpage contacts defined by `pointsOfContactIds`.
 */
export function getSubpagePoc(
  subpageKey: SubpageKey,
  usernamesWithRoles: UsernameWithRoles[]
) {
  const subPocIds = pointsOfContactIds[subpageKey];

  // Check people for matching poc role ids
  // Add that person once if some ids match
  return usernamesWithRoles.filter(person =>
    person.roles.some(({ roleTypeID }) =>
      subPocIds.includes(roleTypeID as RoleTypeId)
    )
  );
}

interface PointsOfContactSidebarProps extends SystemProfileSubviewProps {
  subpageKey: SubpageKey;
  systemId: string;
}

const PointsOfContactSidebar = ({
  system,
  subpageKey,
  systemId
}: PointsOfContactSidebarProps) => {
  const { t } = useTranslation('systemProfile');
  const contactsWithRoles = getSubpagePoc(
    subpageKey,
    system.usernamesWithRoles
  );
  return (
    <>
      <p className="font-body-xs margin-top-1 margin-bottom-3">
        {t('singleSystem.pointsOfContact', { count: contactsWithRoles.length })}
      </p>
      {contactsWithRoles.map(contact => {
        const role = contact.roles[0];
        return (
          <React.Fragment key={role.roleID}>
            <h3 className="system-profile__subheader margin-bottom-1">
              {getPersonFullName(role)}
            </h3>
            {role.roleTypeName && (
              <DescriptionDefinition definition={role.roleTypeName} />
            )}
            {role.assigneeEmail && (
              <p>
                <Link
                  aria-label={t('singleSystem.sendEmail')}
                  className="line-height-body-5"
                  href={`mailto:${role.assigneeEmail}`}
                  target="_blank"
                >
                  {t('singleSystem.sendEmail')}
                  <IconLaunch className="margin-left-05 margin-bottom-2px text-tbottom" />
                </Link>
              </p>
            )}
          </React.Fragment>
        );
      })}
      {subpageKey !== 'team' && (
        <p>
          <UswdsReactLink
            aria-label={t('singleSystem.moreContact')}
            className="line-height-body-5"
            to={`/systems/${systemId}/team`}
          >
            {t('singleSystem.moreContact')}
            <span aria-hidden>&nbsp;</span>
            <span aria-hidden>&rarr; </span>
          </UswdsReactLink>
        </p>
      )}
    </>
  );
};

export default PointsOfContactSidebar;
