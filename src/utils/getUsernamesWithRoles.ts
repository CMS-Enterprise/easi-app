import {
  CedarRoleAssigneePerson,
  UsernameWithRoles
} from 'types/systemProfile';

/**
 * Get a list of people by their usernames with of a nested list of their Cedar Roles.
 * Assignees appear to be listed in order. The returned list keeps that order.
 */
export default function getUsernamesWithRoles(
  personRoles: CedarRoleAssigneePerson[] | undefined
): UsernameWithRoles[] {
  const people: UsernameWithRoles[] = [];

  (personRoles || []).forEach(role => {
    const { assigneeUsername } = role;
    if (!assigneeUsername) return;

    let person = people.find(p => p.assigneeUsername === assigneeUsername);
    if (!person) {
      person = { assigneeUsername, roles: [] };
      people.push(person);
    }

    person.roles.push(role);
  });

  return people;
}
