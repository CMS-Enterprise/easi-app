import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ConfirmationMessage from './index';

describe('The confirmation message', () => {
  it('renders without errors', () => {
    shallow(
      <ConfirmationMessage>
        Confirmation message without errors
      </ConfirmationMessage>
    );
  });

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <ConfirmationMessage>
          Confirmation message without errors
        </ConfirmationMessage>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
