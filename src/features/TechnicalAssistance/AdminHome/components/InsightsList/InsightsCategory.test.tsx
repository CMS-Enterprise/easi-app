import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { TRBGuidanceLetterInsightCategory } from 'gql/generated/graphql';
import { guidanceLetter, trbRequest } from 'tests/mock/trbRequest';

import VerboseMockedProvider from 'utils/testing/VerboseMockedProvider';

import InsightsCategory from './InsightsCategory';

const { insights } = guidanceLetter;

describe('Insights category', () => {
  it('renders the category', () => {
    const recommendations = insights.filter(
      insight =>
        insight.category === TRBGuidanceLetterInsightCategory.RECOMMENDATION
    );

    render(
      <VerboseMockedProvider>
        <InsightsCategory
          trbRequestId={trbRequest.id}
          category={TRBGuidanceLetterInsightCategory.RECOMMENDATION}
          insights={recommendations}
        />
      </VerboseMockedProvider>
    );

    expect(screen.getByRole('heading', { name: 'Recommendations' }));

    expect(
      screen.getByText(
        'A recommendation indicates that the project team should strongly consider implementing this change, as it will benefit both the project team and CMS.'
      )
    );

    const insightsList = within(
      screen.getByRole('list', { name: 'Recommendations' })
    );

    const insightsListItems = insightsList.getAllByTestId('insights_list-item');

    expect(insightsListItems).toHaveLength(recommendations.length);
  });

  it('renders uncategorized insights', () => {
    const uncategorized = {
      ...insights[0],
      category: TRBGuidanceLetterInsightCategory.UNCATEGORIZED
    };

    render(
      <VerboseMockedProvider>
        <InsightsCategory
          trbRequestId={trbRequest.id}
          category={TRBGuidanceLetterInsightCategory.UNCATEGORIZED}
          insights={[uncategorized]}
          editable
        />
      </VerboseMockedProvider>
    );

    expect(screen.getByRole('heading', { name: 'Uncategorized' }));

    expect(
      screen.getByText(
        'Past advice letters (now guidance letters) will not have categorized advice. You may edit each existing item to add it to a category.'
      )
    );
  });
});
