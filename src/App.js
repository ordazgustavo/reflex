import Reflex, { Component } from '../reflex';
import Button from './Button';
import Paragraph from './Paragraph';
import Logo from './Logo';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  clickCounterHandler = () => {
    this.setState(
      prevState => ({
        count: prevState.count + 1
      }),
      () => console.log(this.state)
    );
  };

  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: '#031926',
            height: 150,
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Logo />
          <h1 style={{ color: '#FFFFFF' }}>Welcome to Reflex</h1>
        </div>
        <div style={{ padding: '15px 25%' }}>
          <Paragraph title="Getting started">
            Create your custom components inside the <code>./src</code> folder.
          </Paragraph>
          <Paragraph title="Event handlers">
            <Button clicked={this.clickCounterHandler}>Add</Button>{' '}
            {this.state.count}
          </Paragraph>
        </div>
      </div>
    );
  }
}

export default App;
