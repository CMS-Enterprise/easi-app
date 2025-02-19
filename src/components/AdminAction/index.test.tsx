import React from 'react';
import { render } from '@testing-library/react';
import { ActionText } from 'features/TechnicalAssistance/AdminHome/components/TrbAdminWrapper';
import i18next from 'i18next';

import AdminAction from '.';

describe('admin action component', () => {
  const text: ActionText = i18next.t(
    'technicalAssistance:adminAction.statuses.REQUEST_FORM_COMPLETE',
    { returnObjects: true }
  );
  it('Matches the snapshot', () => {
    const { asFragment } = render(
      <AdminAction
        title={text.title}
        description={text.description}
        buttons={[
          {
            label: i18next.t(
              'technicalAssistance:adminAction.buttons.requestEdits'
            ),
            onClick: () => null,
            outline: true
          },
          {
            label: i18next.t(
              'technicalAssistance:adminAction.buttons.readyForConsult'
            ),
            onClick: () => null,
            outline: true
          },
          {
            label: i18next.t(
              'technicalAssistance:adminAction.buttons.orCloseRequest'
            ),
            onClick: () => null,
            unstyled: true
          }
        ]}
      >
        {text.list?.label}
        <ul>
          {(text.list?.unorderedItems || []).map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </AdminAction>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
