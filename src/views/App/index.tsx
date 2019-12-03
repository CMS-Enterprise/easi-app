import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { SecureRoute, ImplicitCallback } from '@okta/okta-react';
import AuthenticationWrapper from 'views/AuthenticationWrapper';
import Header from 'components/Header';
import Home from 'views/Home';
import Login from 'views/Login';
import SuperSecret from 'views/SuperSecret';
import './index.scss';

type MainState = {
  name: string;
};

type MainProps = {};

class App extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      name: 'Isaac'
    };
  }

  componentDidMount(): void {
    fetch('http://localhost:8080')
      .then(res => res.json())
      .then(data => {
        this.setState({ name: data.SystemOwners[0] });
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
  }

  render() {
    const { name } = this.state;
    console.log(name);
    return (
      <div>
        <BrowserRouter>
          <AuthenticationWrapper>
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <SecureRoute path="/protected" exact component={SuperSecret} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </AuthenticationWrapper>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
