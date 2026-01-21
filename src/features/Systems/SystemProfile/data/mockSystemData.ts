// Temporary extension of CEDAR types under BE integration complete

import { GetCedarSystemsQuery } from 'gql/generated/graphql';

export type tempProductsProp = {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  tags?: string[];
  version: string;
  edition?: string;
};

export const mockSystemInfo: NonNullable<GetCedarSystemsQuery['cedarSystems']> =
  [
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
    Sollicitudin donec aliquam dui sed odio porta.`,
      isBookmarked: false,
      atoExpirationDate: null,
      linkedTrbRequests: [],
      linkedSystemIntakes: []
    },
    {
      __typename: 'CedarSystem',
      id: '326-1-0',
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
    Sollicitudin donec aliquam dui sed odio porta.`,
      isBookmarked: false,
      atoExpirationDate: null,
      linkedTrbRequests: [],
      linkedSystemIntakes: []
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
    Sollicitudin donec aliquam dui sed odio porta.`,
      isBookmarked: false,
      atoExpirationDate: null,
      linkedTrbRequests: [],
      linkedSystemIntakes: []
    },
    {
      __typename: 'CedarSystem',
      id: '326-9-0',
      acronym: 'BBC',
      status: 'Approved',
      name: 'Medicare Beneficiary Contact Center',
      description: `The Beneficiary Contact Center (BCC) provides an unbiased
    central point of contact for Medicare Beneficiaries and their caregivers with
    scripted responses on coverage information, health care choices, claims, and
    preventive services.The Balanced Budget Act of 1997 mandated a toll free
    line for beneficiaries. CMS created a 1-800-Medicare`,
      businessOwnerOrg: 'Division of Call Center Systems',
      businessOwnerOrgComp: 'Geraldine Hobbs',
      systemMaintainerOrg: 'Jan 6 2022',
      systemMaintainerOrgComp: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
    feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
    Sollicitudin donec aliquam dui sed odio porta.`,
      isBookmarked: false,
      atoExpirationDate: null,
      linkedTrbRequests: [],
      linkedSystemIntakes: []
    }
  ];

export const mockVendors = [
  {
    vendors: ['TechSystems, Inc', 'Massive Dynamic'],
    contractAwardDate: 'March 19, 2021',
    popStartDate: 'March 20, 2021',
    popEndDate: 'March 21, 2021',
    contractNumber: 'GS1234567890BA-987654321',
    technologyFunctions: [
      'Application',
      'Delivery',
      'End User',
      'IT Management',
      'Platform',
      'Security & Compliance'
    ],
    assetsOrServices: ['External Labor', 'Software']
  },
  {
    vendors: ['SkyNet'],
    contractAwardDate: 'April 19, 2021',
    popStartDate: 'April 20, 2021',
    popEndDate: 'April 21, 2021',
    contractNumber: 'GS1234567890BA-123456789',
    technologyFunctions: ['Network', 'Storage'],
    assetsOrServices: ['Outside Services']
  }
];
