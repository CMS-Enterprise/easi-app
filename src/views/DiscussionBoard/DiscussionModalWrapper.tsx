import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import Sidepanel from 'components/Sidepanel';

type DiscussionModalWrapperProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

const DiscussionModalWrapper = ({
  isOpen,
  closeModal,
  children
}: DiscussionModalWrapperProps) => {
  const { t } = useTranslation('discussions');

  return (
    <Sidepanel
      ariaLabel={t('ariaLabel')}
      closeModal={closeModal}
      isOpen={isOpen}
      modalHeading={t('modalHeading')}
      testid="discussion-modal"
    >
      <GridContainer className="padding-y-6">
        <Grid desktop={{ col: 12 }}>{children}</Grid>
      </GridContainer>
    </Sidepanel>
  );
};

export default DiscussionModalWrapper;
