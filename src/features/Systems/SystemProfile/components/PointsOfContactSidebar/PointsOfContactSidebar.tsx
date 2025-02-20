import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Link } from '@trussworks/react-uswds';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import {
  SubpageKey,
  SystemProfileSubviewProps,
  UsernameWithRoles
} from 'types/systemProfile';

import pointsOfContactIds from '../../data/pointsOfContactIds';
import { getPersonFullName } from '../../util';

/**
 * Get a list of subpage contacts defined by `pointsOfContactIds`.
 * Return all members of the first matching Role Type Id found in the priority list.
 */
export function getPointsOfContact(
  subpageKey: SubpageKey,
  usernamesWithRoles: UsernameWithRoles[]
): UsernameWithRoles[] {
  const subPocIds = pointsOfContactIds[subpageKey];
  let contacts: UsernameWithRoles[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const pocid of subPocIds) {
    const found = usernamesWithRoles.filter(user =>
      user.roles.find(r => r.roleTypeName === pocid)
    );
    if (found.length) {
      contacts = found;
      break;
    }
  }

  return contacts;
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

  const contactsWithRoles = getPointsOfContact(
    subpageKey,
    system.usernamesWithRoles
  );
  return (
    <>
      <p className="font-body-xs margin-top-1 margin-bottom-3">
        {t('singleSystem.pointsOfContact', { count: contactsWithRoles.length })}
      </p>
      {contactsWithRoles.length ? (
        contactsWithRoles.map(contact => {
          const role = contact.roles[0];
          return (
            <React.Fragment key={role.roleID}>
              <h3 className="system-profile__subheader margin-bottom-1">
                {getPersonFullName(role)}
              </h3>
              <div>
                {contact.roles.map(r => (
                  <h5
                    key={r.roleID}
                    className="margin-top-0 margin-bottom-05 font-sans-2xs text-normal"
                  >
                    {r.roleTypeName}
                  </h5>
                ))}
              </div>
              {role.assigneeEmail && (
                <p>
                  <Link
                    aria-label={t('singleSystem.sendEmail')}
                    className="line-height-body-5"
                    href={`mailto:${role.assigneeEmail}`}
                    target="_blank"
                  >
                    {t('singleSystem.sendEmail')}
                    <Icon.MailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
                  </Link>
                </p>
              )}
            </React.Fragment>
          );
        })
      ) : (
        // No contacts
        <Alert type="info" slim className="margin-bottom-6">
          {t(`singleSystem.noPointsOfContact`)}
        </Alert>
      )}
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
