# Reflex

Reflex is a JavaScript library based on [Gooact](https://github.com/sweetpalma/gooact) a React clone.

# Installation & Usage

Download or clone the repo.

Import the package

```js
import Reflex from '../reflex';
```

Create your custom components in the `./src` folder.

Use:

```
npm start
```

To serve the package on localhost

```
npm run build
```

To compile "production ready" (disclaimer: you shouldn't actually use this in production 💩)

# What's the diference?

Support for `setState` callbacks:

```js
this.setState(
  prevState => ({
    count: prevState.count + 1
  }),
  () => console.log(this.state)
);
```

Reflex includes support for fragments, so you can avoid using `div`'s to wrap components

```js
import Reflex, { Fragment } from '../reflex';

export const paragraph = ({ title, children }) => {
  return (
    <Fragment>
      <h3>{title}</h3>
      <p>{children}</p>
    </Fragment>
  );
};
```

Removed

```js
componentWillMount();
componentWillUpdate();
componentWillReceiveProps();
```

As this methods are considered **UNSAFE** by React

# License

This package is under MIT License son you can do whatever you want with it.
