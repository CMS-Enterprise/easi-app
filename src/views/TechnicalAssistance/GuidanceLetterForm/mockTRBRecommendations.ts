import { TRBRecommendation } from 'queries/types/TRBRecommendation';

export enum TRBGuidanceLetterRecommendationCategory {
  REQUIREMENT = 'REQUIREMENT',
  RECOMMENDATION = 'RECOMMENDATION',
  CONSIDERATION = 'CONSIDERATION'
}

export interface MockTRBRecommendation extends TRBRecommendation {
  category: TRBGuidanceLetterRecommendationCategory;
}

export type MockTRBRecommendationsObject = Record<
  TRBGuidanceLetterRecommendationCategory,
  Array<MockTRBRecommendation>
>;

export const mockRecommendations: MockTRBRecommendationsObject = {
  [TRBGuidanceLetterRecommendationCategory.RECOMMENDATION]: [
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: 'd0c1d0d0-332c-4b14-92da-22586ff12507',
      title: 'Recommendation #1',
      category: TRBGuidanceLetterRecommendationCategory.RECOMMENDATION,
      recommendation:
        '<p>This is the description for recommendation number one.</p>',
      links: ['google.com', 'easi.cms.gov']
    },
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: 'f1946c15-76c5-4695-887d-a3cd3939e7cc',
      title: 'Recommendation #2',
      category: TRBGuidanceLetterRecommendationCategory.RECOMMENDATION,
      recommendation:
        '<p>This is the description for recommendation number two.</p>',
      links: []
    },
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: '4ab94f44-b1dc-4e48-ad32-3c3925e011b3',
      title: 'Recommendation #3',
      category: TRBGuidanceLetterRecommendationCategory.RECOMMENDATION,
      recommendation:
        '<p>This is the description for recommendation number three.</p>',
      links: []
    }
  ],
  [TRBGuidanceLetterRecommendationCategory.REQUIREMENT]: [
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: 'f5f0a47a-eda1-4571-a60f-4fe333fbc36a',
      title: 'Requirement #1',
      category: TRBGuidanceLetterRecommendationCategory.REQUIREMENT,
      recommendation:
        '<p>This is the description for requirement number one.</p>',
      links: ['google.com', 'easi.cms.gov']
    },
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: 'd6e0621c-dabd-458c-ab89-d5628b7f653a',
      title: 'Requirement #2',
      category: TRBGuidanceLetterRecommendationCategory.REQUIREMENT,
      recommendation:
        '<p>This is the description for requirement number two.</p>',
      links: []
    },
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: '1cb0f86d-3bae-4ece-97e2-69b989df1d30',
      title: 'Requirement #3',
      category: TRBGuidanceLetterRecommendationCategory.REQUIREMENT,
      recommendation:
        '<p>This is the description for requirement number three.</p>',
      links: []
    }
  ],
  [TRBGuidanceLetterRecommendationCategory.CONSIDERATION]: [
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: '51a9a6ec-8bd3-4e1f-98c4-c1697c9af381',
      title: 'Consideration #1',
      category: TRBGuidanceLetterRecommendationCategory.CONSIDERATION,
      recommendation:
        '<p>This is the description for consideration number one.</p>',
      links: ['google.com', 'easi.cms.gov']
    },
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: '0a5db0a7-73a8-435a-80f0-dd8f7c4756e8',
      title: 'Consideration #2',
      category: TRBGuidanceLetterRecommendationCategory.CONSIDERATION,
      recommendation:
        '<p>This is the description for consideration number two.</p>',
      links: []
    },
    {
      __typename: 'TRBGuidanceLetterRecommendation',
      id: '0a8e2ea1-63e0-4111-bbba-a616dbb88b4f',
      title: 'Consideration #3',
      category: TRBGuidanceLetterRecommendationCategory.CONSIDERATION,
      recommendation:
        '<p>This is the description for consideration number three.</p>',
      links: []
    }
  ]
};
