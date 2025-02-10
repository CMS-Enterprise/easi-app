import React from 'react';
import { CardGroup, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import { HelpLinkType } from 'i18n/en-US/systemWorkspace';

import SystemHelpCard from './SystemHelpCard';

type OperationalSolutionsHelpProps = {
  className?: string;
  cards: HelpLinkType[];
  linkSearchQuery: string | undefined;
};

const HelpCardGroup = ({
  className,
  cards,
  linkSearchQuery
}: OperationalSolutionsHelpProps) => {
  return (
    <div
      className={classNames(
        className,
        'padding-bottom-6 text-white margin-bottom-neg-7'
      )}
    >
      <CardGroup className={className}>
        {cards.map(card => {
          // Add the `linkSearchQuery` for a couple of starting request cards
          let { link } = card;
          if (
            linkSearchQuery &&
            (link === '/system/request-type' || link === '/trb/start')
          ) {
            link += `?${linkSearchQuery}`;
          }

          return (
            <Grid
              tablet={{ col: 6 }}
              desktop={{ col: 4 }}
              key={card.header.replace(' ', '-').toLowerCase()}
              className="display-flex flex-align-stretch"
            >
              <SystemHelpCard
                header={card.header}
                link={link}
                linkText={card.linkText}
                external={card.external}
                modalType={card.modalType}
              />
            </Grid>
          );
        })}
      </CardGroup>
    </div>
  );
};

export default HelpCardGroup;
