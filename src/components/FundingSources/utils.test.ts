import { FundingSource } from 'types/systemIntake';

import {
  formatFundingSourcesForApi,
  formatFundingSourcesForApp
} from './utils';
import { FormattedFundingSource } from '.';

const fundingSourcesForApi: FundingSource[] = [
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'eaf3b006-e9ab-45f6-959a-c24930ea8087',
    projectNumber: '111111',
    investment: 'Fed Admin'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'eaf3b006-e9ab-45f6-959a-c24930ea8087',
    projectNumber: '111111',
    investment: 'HITECH Medicare'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'ea000249-ed00-4290-a741-555356ac8753',
    projectNumber: '222222',
    investment: 'ACA 3021'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'e0ebbbbe-c248-42e8-b7f8-e49739b33707',
    projectNumber: '333333',
    investment: 'HITECH Medicaid'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'e0ebbbbe-c248-42e8-b7f8-e49739b33707',
    projectNumber: '333333',
    investment: 'MIP Base'
  },
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'e0ebbbbe-c248-42e8-b7f8-e49739b33707',
    projectNumber: '333333',
    investment: 'Prog Ops'
  }
];

const fundingSourcesForApp: FormattedFundingSource[] = [
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'eaf3b006-e9ab-45f6-959a-c24930ea8087',
    fundingNumber: '111111',
    sources: ['Fed Admin', 'HITECH Medicare']
  },
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'ea000249-ed00-4290-a741-555356ac8753',
    fundingNumber: '222222',
    sources: ['ACA 3021']
  },
  {
    __typename: 'SystemIntakeFundingSource',
    id: 'e0ebbbbe-c248-42e8-b7f8-e49739b33707',
    fundingNumber: '333333',
    sources: ['HITECH Medicaid', 'MIP Base', 'Prog Ops']
  }
];

describe('Formats funding sources', () => {
  it('formats funding sources for API', () =>
    expect(formatFundingSourcesForApi(fundingSourcesForApp)).toEqual(
      fundingSourcesForApi
    ));

  it('formats funding sources for app', () =>
    expect(formatFundingSourcesForApp(fundingSourcesForApi)).toEqual(
      fundingSourcesForApp
    ));
});
