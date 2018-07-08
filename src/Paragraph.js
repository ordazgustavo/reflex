import Reflex, { Fragment } from '../reflex';

const paragraph = ({ title, children }) => {
  return (
    <Fragment>
      <h3>{title}</h3>
      <hr />
      <p style={{ textIndent: '15px' }}>{children}</p>
    </Fragment>
  );
};

export default paragraph;
