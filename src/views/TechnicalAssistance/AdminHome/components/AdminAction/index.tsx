import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import { CreateTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  CreateTrbAdviceLetter,
  CreateTrbAdviceLetterVariables
} from 'queries/types/CreateTrbAdviceLetter';

type AdminActionProps = {
  trbRequestId: string;
  className?: string;
};

/**
 * Admin action component for TRB admin home subpages
 * TODO: complete work on component - this is just a placeholder
 */
const AdminAction = ({ trbRequestId, className }: AdminActionProps) => {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();

  const [createAdviceLetter] = useMutation<
    CreateTrbAdviceLetter,
    CreateTrbAdviceLetterVariables
  >(CreateTrbAdviceLetterQuery, {
    variables: {
      trbRequestId
    }
  });

  return (
    <div
      className={classNames(
        'trb-admin-home__admin-action usa-summary-box',
        className
      )}
      data-testid="trb-admin-home__admin-action"
    >
      <h5 className="text-base-dark text-uppercase margin-top-0 margin-bottom-05 line-height-body-1 text-normal text-body-xs">
        {t('adminAction')}
      </h5>
      <h3 className="margin-y-0">Draft Advice Letter</h3>
      <p className="margin-y-0 line-height-body-5">
        Compile an advice letter for the requester and project team. Once you
        send the advice letter, the requester will get a notification and be
        able to see any recommendations, feedback, and next steps you include.
      </p>
      <CollapsableLink
        id="test"
        className="margin-y-2 text-bold display-flex flex-align-center"
        label="What should I include in the advice letter?"
      >
        Test link content
      </CollapsableLink>
      <div className="margin-top-4">
        <Button
          type="button"
          className="usa-button margin-right-2"
          onClick={
            () =>
              createAdviceLetter()
                .then(
                  result =>
                    !result.errors &&
                    history.push(`/trb/${trbRequestId}/advice/summary`)
                )
                // TODO: Error handling
                .catch(err => console.log(err)) // eslint-disable-line no-console
          }
        >
          {t('Create advice letter')}
        </Button>
        <UswdsReactLink to="/">{t('or, close this request')}</UswdsReactLink>
      </div>
    </div>
  );
};

export default AdminAction;
