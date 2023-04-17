import React from 'react';
import { Trans } from 'react-i18next';
import i18next from 'i18next';

import AdminAction from 'components/shared/AdminAction';
import CollapsableLink from 'components/shared/CollapsableLink';
import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import { TrbAdminPath } from 'types/technicalAssistance';

import useTrbAdminActionButtons from './useTrbAdminActionButtons';

type TrbAdminActionProps = {
  trbRequestId: string;
  activePage: TrbAdminPath;
  status: TRBRequestStatus;
  state: TRBRequestState;
};

type ActionText = {
  title: string;
  description?: string;
  list?: {
    label: string;
    text?: string;
    unorderedItems?: string[];
    orderedItems?: string[];
    note?: string;
  };
};

export default function TrbAdminAction({
  trbRequestId,
  activePage,
  status,
  state
}: TrbAdminActionProps) {
  const translationKey = `technicalAssistance:adminAction.statuses.${
    state === TRBRequestState.CLOSED ? state : status
  }`;
  const text: ActionText = i18next.t(translationKey, { returnObjects: true });
  const { list } = text || {};
  const actionButtons = useTrbAdminActionButtons({
    trbRequestId,
    activePage,
    status,
    state
  });
  return (
    <AdminAction
      title={text.title}
      description={text.description}
      buttons={actionButtons}
    >
      {list && (
        <CollapsableLink
          id="trbAdminActionContent"
          className="margin-y-2 text-bold display-flex flex-align-center"
          label={list.label}
        >
          {list.text && <p className="margin-y-0">{list.text}</p>}
          {list.unorderedItems && (
            <ul className="margin-y-05">
              {list.unorderedItems.map((item, index) => (
                <li key={item}>
                  <Trans
                    i18nKey={`${translationKey}.list.unorderedItems.${index}`}
                    components={{ b: <span className="text-bold" /> }}
                  />
                </li>
              ))}
            </ul>
          )}
          {list.orderedItems && (
            <ol className="margin-y-05">
              {list.orderedItems.map((item, index) => (
                <li key={item}>
                  <Trans
                    i18nKey={`${translationKey}.list.orderedItems.${index}`}
                    components={{ b: <span className="text-bold" /> }}
                  />
                </li>
              ))}
            </ol>
          )}
          {list.note && <p className="margin-y-0">{list.note}</p>}
        </CollapsableLink>
      )}
    </AdminAction>
  );
}
