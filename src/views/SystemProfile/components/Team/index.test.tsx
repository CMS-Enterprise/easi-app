import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { cloneDeep, uniqueId } from 'lodash';

import { TEAM_SECTION_MEMBER_COUNT_CAP } from 'constants/systemProfile';
import {
  getMockPersonRole,
  getMockSystemProfileData,
  result
} from 'data/mock/systemProfile';
import { RoleTypeName } from 'types/systemProfile';

import Team, { getTeam, TeamSection } from '.';

describe('System Profile Team subpage', () => {
  const resultdata = cloneDeep(result.data);
  // prettier-ignore
  resultdata.cedarSystemDetails!.roles = [
    getMockPersonRole({assigneeUsername: 'A', roleTypeName: RoleTypeName.BUSINESS_OWNER}),
    getMockPersonRole({assigneeUsername: 'B', roleTypeName: RoleTypeName.BUSINESS_OWNER}),
    getMockPersonRole({assigneeUsername: 'B', roleTypeName: RoleTypeName.PROJECT_LEAD}),
    getMockPersonRole({assigneeUsername: 'B', roleTypeName: '0'}),
    getMockPersonRole({assigneeUsername: 'C', roleTypeName: '0'}),
    getMockPersonRole({assigneeUsername: 'C', roleTypeName: '9'}),
    getMockPersonRole({assigneeUsername: 'D', roleTypeName: '9'})
  ];

  const systemProfileDataWithTeam = getMockSystemProfileData(resultdata);

  it('matches snapshot', () => {
    const { asFragment } = render(<Team system={systemProfileDataWithTeam} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('groups by section', () => {
    // prettier-ignore
    const expected = {
      /*
        businessOwners: [A B]
        projectLeads: [B]
        additional: [C D]
      */
      "businessOwners": [
        {
          "assigneeUsername": "A",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "A", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "Business owner", "roleID": null, "__typename": "CedarRole" }
          ]
        },
        {
          "assigneeUsername": "B",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "Business owner", "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "Project Lead", "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "0", "roleID": null, "__typename": "CedarRole" }
          ]
        }
      ],
      "projectLeads": [
        {
          "assigneeUsername": "B",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "Business owner", "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "Project Lead", "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "0", "roleID": null, "__typename": "CedarRole" }
          ]
        }
      ],
      "additional": [
        {
          "assigneeUsername": "C",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "C", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "0", "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "C", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "9", "roleID": null, "__typename": "CedarRole" }
          ]
        },
        {
          "assigneeUsername": "D",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "", "assigneeType": "PERSON", "assigneeUsername": "D", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": "9", "roleID": null, "__typename": "CedarRole" }
          ]
        }
      ]
    };

    const team = getTeam(systemProfileDataWithTeam.usernamesWithRoles);
    expect(team).toEqual(expected);
  });

  it('displays alert on no members in all 3 team sections', () => {
    const res = cloneDeep(result.data);
    res.cedarSystemDetails!.roles = [];
    const dataWithoutTeam = getMockSystemProfileData(res);
    const { getAllByTestId } = render(<Team system={dataWithoutTeam} />);
    expect(getAllByTestId('alert')).toHaveLength(3);
  });
});

describe(`System Profile Team section collapse/expand toggle at ${TEAM_SECTION_MEMBER_COUNT_CAP}`, () => {
  const buttonExpandToggleMatchOpt = { name: /show more/i };

  function fillRolesUniqueWithType(roleTypeName: string, count: number) {
    return Array(count)
      .fill(0)
      .map(_ =>
        getMockPersonRole({ assigneeUsername: uniqueId(), roleTypeName })
      );
  }

  it(`doesn't show toggles for all sections`, () => {
    const res = cloneDeep(result.data);

    // Doesn't show the button expand toggle at cap
    res.cedarSystemDetails!.roles = [
      ...fillRolesUniqueWithType(
        RoleTypeName.BUSINESS_OWNER,
        TEAM_SECTION_MEMBER_COUNT_CAP
      ),
      ...fillRolesUniqueWithType(
        RoleTypeName.PROJECT_LEAD,
        TEAM_SECTION_MEMBER_COUNT_CAP
      ),
      ...fillRolesUniqueWithType('0', TEAM_SECTION_MEMBER_COUNT_CAP)
    ];
    const data = getMockSystemProfileData(res);
    const { queryAllByRole } = render(<Team system={data} />);
    expect(queryAllByRole('button', buttonExpandToggleMatchOpt)).toHaveLength(
      0
    );
  });

  it(`section init collapsed & expands`, async () => {
    const res = cloneDeep(result.data);

    // Fill more members than the cap
    const total = TEAM_SECTION_MEMBER_COUNT_CAP + 10;
    res.cedarSystemDetails!.roles = fillRolesUniqueWithType('0', total);
    const data = getMockSystemProfileData(res);
    const { getByRole, getAllByTestId } = render(
      <TeamSection
        usernamesWithRoles={data.usernamesWithRoles}
        section="additional"
      />
    );

    // Check count when collapsed
    expect(getAllByTestId('Card')).toHaveLength(TEAM_SECTION_MEMBER_COUNT_CAP);

    // Toggle expand
    fireEvent.click(getByRole('button', buttonExpandToggleMatchOpt));
    await waitFor(() => {
      expect(getByRole('button', { name: /show fewer/i })).toBeInTheDocument();
    });

    // Expanded count
    expect(getAllByTestId('Card')).toHaveLength(total);
  });
});
