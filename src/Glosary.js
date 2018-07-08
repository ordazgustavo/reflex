import Reflex, { Fragment } from '../reflex';

const glosary = ({ items }) => (
  <dl>
    {items.map(item => (
      <Fragment key={item.id}>
        <dt className="dtclass">{item.term}</dt>
        <dd>{item.description}</dd>
      </Fragment>
    ))}
  </dl>
);

export default glosary;
