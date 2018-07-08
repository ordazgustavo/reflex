(exports => {
  'use strict';

  const createElement = function(type, props, ...children) {
    return {
      type,
      props: props || {},
      children
    };
  };

  const setAttribute = function(dom, key, value) {
    if (value instanceof Function && key.startsWith('on')) {
      const eventType = key.slice(2).toLowerCase();
      dom.__reflexHandlers = dom.__reflexHandlers || {};
      dom.removeEventListener(eventType, dom.__reflexHandlers[eventType]);
      dom.__reflexHandlers[eventType] = value;
      dom.addEventListener(eventType, dom.__reflexHandlers[eventType]);
    } else if (key === 'checked' || key === 'value' || key === 'className') {
      dom[key] = value;
    } else if (key === 'style' && value instanceof Object) {
      Object.assign(dom.style, value);
    } else if (key === 'ref' && value instanceof Function) {
      value(dom);
    } else if (key === 'key') {
      dom.__reflexKey = value;
    } else if (!(value instanceof Object) && !(value instanceof Function)) {
      dom.setAttribute(key, value);
    }
  };

  const render = function(vdom, parent = null) {
    const mount = parent ? el => parent.appendChild(el) : el => el;
    if (vdom instanceof DocumentFragment) {
      return mount(vdom);
    } else if (typeof vdom === 'string' || typeof vdom === 'number') {
      return mount(document.createTextNode(vdom));
    } else if (typeof vdom === 'boolean' || vdom === null) {
      return mount(document.createTextNode(''));
    } else if (vdom instanceof Object && vdom.type instanceof Function) {
      return Component.render(vdom, parent);
    } else if (vdom instanceof Object && typeof vdom.type == 'string') {
      const dom = mount(document.createElement(vdom.type));
      for (const child of [].concat(...vdom.children)) render(child, dom);
      for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
      return dom;
    } else {
      throw new Error(`Invalid VDOM: ${vdom}.`);
    }
  };

  const patch = function(dom, vdom, parent = dom.parentNode) {
    const replace = parent
      ? el => parent.replaceChild(el, dom) && el
      : el => el;
    if (vdom instanceof DocumentFragment) {
      return replace(render(vdom, parent));
    } else if (vdom instanceof Object && vdom.type instanceof Function) {
      return Component.patch(dom, vdom, parent);
    } else if (!(vdom instanceof Object) && dom instanceof Text) {
      return dom.textContent !== vdom ? replace(render(vdom, parent)) : dom;
    } else if (vdom instanceof Object && dom instanceof Text) {
      return replace(render(vdom, parent));
    } else if (
      vdom instanceof Object &&
      dom.nodeName !== vdom.type.toUpperCase()
    ) {
      return replace(render(vdom, parent));
    } else if (
      vdom instanceof Object &&
      dom.nodeName === vdom.type.toUpperCase()
    ) {
      const pool = {};
      const active = document.activeElement;
      [].concat(...dom.childNodes).map((child, index) => {
        const key = child.__reflexKey || `__index_${index}`;
        pool[key] = child;
      });
      [].concat(...vdom.children).map((child, index) => {
        const key = (child.props && child.props.key) || `__index_${index}`;
        if (pool[key]) {
          dom.appendChild(patch(pool[key], child));
        } else {
          if (child.children instanceof Array) {
            child.children.forEach(el => {
              dom.appendChild(render(el, dom));
            });
          } else {
            dom.appendChild(render(child, dom));
          }
        }
        delete pool[key];
      });
      for (const key in pool) {
        const instance = pool[key].__reflexInstance;
        if (instance) instance.componentWillUnmount();
        pool[key].remove();
      }
      for (const attr of dom.attributes) dom.removeAttribute(attr.name);
      for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop]);
      active.focus();
      return dom;
    }
  };

  const Fragment = function({ children }) {
    const fragment = document.createDocumentFragment();
    for (const element of children) {
      fragment.appendChild(render(element));
    }
    return fragment;
  };

  class Component {
    constructor(props) {
      this.props = props || {};
      this.state = null;
    }

    static render(vdom, parent = null) {
      const props = { ...vdom.props, children: vdom.children };
      if (Component.isPrototypeOf(vdom.type)) {
        const instance = new vdom.type(props);
        instance.base = render(instance.render(), parent);
        instance.base.__reflexInstance = instance;
        instance.base.__reflexKey = vdom.props.key;
        instance.componentDidMount();
        return instance.base;
      } else {
        return render(vdom.type(props), parent);
      }
    }

    static patch(dom, vdom, parent = dom.parentNode) {
      const props = { ...vdom.props, children: vdom.children };
      if (
        dom.__reflexInstance &&
        dom.__reflexInstance.constructor == vdom.type
      ) {
        dom.__reflexInstance.props = props;
        return patch(dom, dom.__reflexInstance.render(), parent);
      } else if (Component.isPrototypeOf(vdom.type)) {
        const ndom = Component.render(vdom, parent);
        return parent ? parent.replaceChild(ndom, dom) && ndom : ndom;
      } else if (!Component.isPrototypeOf(vdom.type)) {
        return patch(dom, vdom.type(props), parent);
      }
    }

    setState(nextState, callback) {
      const prevState = this.state;
      let newState = nextState;
      if (nextState instanceof Function) newState = nextState(prevState);
      if (this.base && this.shouldComponentUpdate(this.props, newState)) {
        this.state = newState;
        patch(this.base, this.render());
        this.componentDidUpdate(this.props, prevState);
      } else {
        this.state = newState;
      }
      if (callback instanceof Function) callback();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextProps !== this.props || nextState !== this.state;
    }

    componentDidUpdate(prevProps, prevState) {
      return undefined;
    }

    componentDidMount() {
      return undefined;
    }

    componentWillUnmount() {
      return undefined;
    }
  }
  if (typeof module !== 'undefined') {
    module.exports = { createElement, render, Component, Fragment };
  }
  if (typeof module === 'undefined') {
    window.Reflex = { createElement, render, Component, Fragment };
  }
})();
