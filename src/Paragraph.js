import Reflex, { Fragment } from '../reflex';

const paragraph = ({ title, children }) => {
  return (
    <Fragment>
      <h3>{title}</h3>
      <p>{children}</p>
    </Fragment>
  );
};

export default paragraph;
