import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';

export const mockSystemInfo: CedarSystemProps[] = [
  {
    __typename: 'CedarSystem',
    id: '1',
    acronym: 'HAM',
    status: 'Approved',
    name: 'Happiness Achievement Module',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`,
    businessOwnerOrg: 'CMMI',
    businessOwnerOrgComp: 'Good to go!',
    systemMaintainerOrg: 'success',
    systemMaintainerOrgComp: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`
  },
  {
    __typename: 'CedarSystem',
    id: '326-74-0',
    acronym: 'ASD',
    status: null,
    name: 'Systems',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`,
    businessOwnerOrg: 'CMMI',
    businessOwnerOrgComp: 'Good to go!',
    systemMaintainerOrg: 'success',
    systemMaintainerOrgComp: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`
  },
  {
    __typename: 'CedarSystem',
    id: '3',
    acronym: 'ZXC',
    status: 'Draft',
    name: 'Government',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`,
    businessOwnerOrg: 'CMMI',
    businessOwnerOrgComp: 'Good to go!',
    systemMaintainerOrg: 'success',
    systemMaintainerOrgComp: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`
  }
];

export interface CedarSystemBookMark {
  euaUserId: string;
  cedarSystemId: string;
}

export const mockBookmarkInfo: CedarSystemBookMark[] = [
  {
    euaUserId: 'A',
    cedarSystemId: '326-7-0'
  },
  {
    euaUserId: 'A',
    cedarSystemId: '326-74-0'
  },
  {
    euaUserId: 'A',
    cedarSystemId: '326-99-0'
  }
];
