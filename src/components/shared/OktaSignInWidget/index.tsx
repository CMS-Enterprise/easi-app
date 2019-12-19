// src/OktaSignInWidget.js

import React, { Component } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';

type OktaSignInWidgetProps = {
  onSuccess: (auth: any) => any;
  onError: () => void;
};

export default class OktaSignInWidget extends Component<
  OktaSignInWidgetProps,
  {}
> {
  widget: any;

  componentDidMount() {
    const { onSuccess, onError } = this.props;
    this.widget = new OktaSignIn({
      baseUrl: process.env.REACT_APP_OKTA_DOMAIN,
      clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
      redirectUri: process.env.REACT_APP_OKTA_REDIRECT_URI,
      authParams: {
        pkce: true
      }
    });
    this.widget.renderEl({ el: '#sign-in-widget' }, onSuccess, onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return (
      <div>
        <div id="sign-in-widget" />
      </div>
    );
  }
}
