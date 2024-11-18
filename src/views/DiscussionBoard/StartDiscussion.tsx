import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

type StartDiscussionProps = {
  systemIntakeId: string;
  closeModal: () => void;
};

/**
 * Form to start new discussion post
 */
const StartDiscussion = ({
  systemIntakeId,
  closeModal
}: StartDiscussionProps) => {
  const { t } = useTranslation('discussions');

  return (
    <div>
      <h1 className="margin-bottom-205">
        {t('general.startDiscussion.heading')}
      </h1>
      <p className="line-height-body-5 margin-bottom-5">
        {t('general.startDiscussion.description')}
      </p>

      <ButtonGroup>
        <Button type="button" outline onClick={closeModal}>
          {t('general.cancel')}
        </Button>
        <Button type="submit" onClick={closeModal}>
          {t('general.saveDiscussion')}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default StartDiscussion;
