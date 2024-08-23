import { teamRolesIndex } from 'constants/sortIndexes';
import {
  CedarRoleAssigneePerson,
  UsernameWithRoles
} from 'types/systemProfile';

/**
 * Get a list of people by their usernames with of a nested list of their Cedar Roles.
 * Assignees appear to be listed in order. The returned list keeps that order.
 */
export default function getUsernamesWithRoles(
  personRoles: CedarRoleAssigneePerson[]
): UsernameWithRoles[] {
  const people: UsernameWithRoles[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const role of personRoles) {
    const { assigneeUsername } = role;
    if (assigneeUsername) {
      let person = people.find(
        p => p.assigneeUsername === role.assigneeUsername
      );
      if (!person) {
        person = { assigneeUsername, roles: [] };
        people.push(person);
      }

      person.roles.push(role);
    }
  }

  const rolesIndexEnd = Object.keys(teamRolesIndex()).length;

  // eslint-disable-next-line no-restricted-syntax
  for (const p of people) {
    p.roles.sort((a, b) => {
      return (
        (teamRolesIndex()[a.roleTypeName || ''] ?? rolesIndexEnd) -
        (teamRolesIndex()[b.roleTypeName || ''] ?? rolesIndexEnd)
      );
    });
  }

  return people;
}
