import React from 'react';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';

import { RoleTypeId } from 'constants/systemProfile';
import {
  getMockPersonRole,
  getMockSystemProfileData,
  result
} from 'data/mock/systemProfile';

import Team, { getTeam } from '.';

describe('System Profile Team subpage', () => {
  const resultdata = cloneDeep(result.data);
  // prettier-ignore
  resultdata.cedarSystemDetails!.roles = [
    getMockPersonRole({assigneeUsername: 'A', roleTypeID: RoleTypeId.BUSINESS_OWNER}),
    getMockPersonRole({assigneeUsername: 'B', roleTypeID: RoleTypeId.BUSINESS_OWNER}),
    getMockPersonRole({assigneeUsername: 'B', roleTypeID: RoleTypeId.PROJECT_LEAD}),
    getMockPersonRole({assigneeUsername: 'B', roleTypeID: '0'}),
    getMockPersonRole({assigneeUsername: 'C', roleTypeID: '0'}),
    getMockPersonRole({assigneeUsername: 'C', roleTypeID: '9'}),
    getMockPersonRole({assigneeUsername: 'D', roleTypeID: '9'})
  ];

  const systemProfileData = getMockSystemProfileData(resultdata);

  it('matches snapshot', async () => {
    const { asFragment } = render(<Team system={systemProfileData} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('team grouped by sections', () => {
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
            { "application": "alfabet", "objectID": "", "roleTypeID": "238-17-0", "assigneeType": "PERSON", "assigneeUsername": "A", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" }
          ]
        },
        {
          "assigneeUsername": "B",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "238-17-0", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "238-32-0", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "0", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" }
          ]
        }
      ],
      "projectLeads": [
        {
          "assigneeUsername": "B",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "238-17-0", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "238-32-0", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "0", "assigneeType": "PERSON", "assigneeUsername": "B", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" }
          ]
        }
      ],
      "additional": [
        {
          "assigneeUsername": "C",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "0", "assigneeType": "PERSON", "assigneeUsername": "C", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" },
            { "application": "alfabet", "objectID": "", "roleTypeID": "9", "assigneeType": "PERSON", "assigneeUsername": "C", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" }
          ]
        },
        {
          "assigneeUsername": "D",
          "roles": [
            { "application": "alfabet", "objectID": "", "roleTypeID": "9", "assigneeType": "PERSON", "assigneeUsername": "D", "assigneeEmail": null, "assigneeOrgID": null, "assigneeOrgName": null, "assigneeFirstName": null, "assigneeLastName": null, "roleTypeName": null, "roleID": null, "__typename": "CedarRole" }
          ]
        }
      ]
    };

    const team = getTeam(systemProfileData);
    expect(team).toEqual(expected);
  });
});
