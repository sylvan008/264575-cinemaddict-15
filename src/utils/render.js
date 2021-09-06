import AbstractComponent from '../abstract-component.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
  BEFOREBEGIN: 'beforebegin',
};

const render = (container, child, place = RenderPosition.BEFOREEND) => {
  if (container instanceof AbstractComponent) {
    container = container.getElement();
  }
  if (child instanceof AbstractComponent) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTEREND:
      container.after(child);
      break;
    case RenderPosition.BEFOREBEGIN:
      container.before(child);
      break;
  }
};

const createElement = (template) => {
  const element = document.createElement('div');
  element.innerHTML = template;
  return element.firstChild;
};

const remove = (component) => {
  if (!(component instanceof AbstractComponent)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
  component.removeElement();
};

const replace = (newChild, oldChild) => {
  if (newChild instanceof AbstractComponent) {
    newChild = newChild.getElement();
  }
  if (oldChild instanceof AbstractComponent) {
    oldChild = oldChild.getElement();
  }
  const parent = oldChild.parentElement;
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t  replace unexisting elements');
  }
  parent.replaceChild(newChild, oldChild);
};

export {
  render,
  remove,
  replace,
  createElement,
  RenderPosition
};
