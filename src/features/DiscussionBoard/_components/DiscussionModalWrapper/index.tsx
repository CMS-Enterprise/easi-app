import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import { SystemIntakeGRBDiscussionBoardType } from 'gql/generated/graphql';

import Sidepanel from 'components/Sidepanel';

type DiscussionModalWrapperProps = {
  discussionBoardType: SystemIntakeGRBDiscussionBoardType;
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

const DiscussionModalWrapper = ({
  discussionBoardType,
  isOpen,
  closeModal,
  children
}: DiscussionModalWrapperProps) => {
  const { t } = useTranslation('discussions');

  return (
    <Sidepanel
      ariaLabel={t(`discussionBoardType.${discussionBoardType}`)}
      closeModal={closeModal}
      isOpen={isOpen}
      modalHeading={t(`discussionBoardType.${discussionBoardType}`)}
      testid="discussion-modal"
    >
      <GridContainer className="easi-discussions padding-top-4 padding-bottom-8">
        <Grid desktop={{ col: 12 }}>{children}</Grid>
      </GridContainer>
    </Sidepanel>
  );
};

export default DiscussionModalWrapper;
