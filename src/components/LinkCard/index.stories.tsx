import React from 'react';

import LinkCard from './index';

export default {
  title: 'Link Card',
  component: LinkCard
};

export const Default = () => {
  return (
    <LinkCard link="/mylink" heading="Take me to your link">
      <div>If you click on me I will take you to a really wonderful place</div>
    </LinkCard>
  );
};
