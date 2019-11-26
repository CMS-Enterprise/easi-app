import React from 'react';
import Header from 'components/Header';

type MainState = {
  name: string;
};

type MainProps = {};

class Main extends React.Component<MainProps, MainState> {
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
    return (
      <div>
        <Header />
        <h1>{name}</h1>
      </div>
    );
  }
}

export default Main;
