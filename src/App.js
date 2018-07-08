import Reflex, { Component, Fragment } from '../reflex';
import Button from './Button';
import Glosary from './Glosary';
import Paragraph from './Paragraph';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      nothing: null
    };
  }
  addListElementHandler = () => {
    this.setState(
      prevState => ({
        count: prevState.count + 1
      }),
      () => console.log(this.state)
    );
  };

  componentDidCatch() {
    return <div>Ups something went wrong</div>;
  }

  render() {
    console.log('render');

    const liArray = ['One', 'Two', 'Three'];
    const items = [
      { id: 1, term: 'term1', description: 'desc1' },
      { id: 2, term: 'term2', description: 'desc2' }
    ];
    return (
      <div>
        <h1 style={{ color: 'red', fontSize: '20px' }}>Title</h1>
        <Button clicked={this.addListElementHandler}>Add number</Button>
        {this.state.count}
        <ul>{liArray.map(el => <li>{el}</li>)}</ul>
        <Paragraph title="Example">Text content</Paragraph>
        <Glosary items={items} />
        <Fragment>
          <p>Hola soy un parrafo dentro de un Fragment</p>
          <p>Hola, soy otro parrafo dentro de un Fragment</p>
        </Fragment>
      </div>
    );
  }
}

export default App;
