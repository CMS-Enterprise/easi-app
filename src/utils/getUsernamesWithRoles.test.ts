import { CedarAssigneeType } from 'gql/generated/graphql';

import { CedarRoleAssigneePerson } from 'types/systemProfile';

import getUsernamesWithRoles from './getUsernamesWithRoles';

describe('getUsernamesWithRoles', () => {
  const mockRole = (
    overrides: Partial<CedarRoleAssigneePerson> = {}
  ): CedarRoleAssigneePerson =>
    ({
      assigneeType: CedarAssigneeType.PERSON,
      assigneeUsername: overrides.assigneeUsername,
      ...overrides
    }) as CedarRoleAssigneePerson;

  it('groups roles by assigneeUsername and preserves order', () => {
    const roles: CedarRoleAssigneePerson[] = [
      mockRole({ assigneeUsername: 'alice' }),
      mockRole({ assigneeUsername: 'bob' }),
      mockRole({ assigneeUsername: 'alice' })
    ];

    const result = getUsernamesWithRoles(roles);

    expect(result).toHaveLength(2);
    expect(result[0].assigneeUsername).toBe('alice');
    expect(result[0].roles).toEqual([roles[0], roles[2]]);
    expect(result[1].assigneeUsername).toBe('bob');
    expect(result[1].roles).toEqual([roles[1]]);
  });

  it('ignores roles without an assigneeUsername', () => {
    const roles: CedarRoleAssigneePerson[] = [
      mockRole({ assigneeUsername: undefined } as CedarRoleAssigneePerson),
      mockRole({ assigneeUsername: 'alice' })
    ];

    const result = getUsernamesWithRoles(roles);

    expect(result).toHaveLength(1);
    expect(result[0].assigneeUsername).toBe('alice');
  });

  it('returns an empty array when personRoles is undefined', () => {
    const result = getUsernamesWithRoles(undefined);

    expect(result).toEqual([]);
  });
});
