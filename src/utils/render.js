import AbstractComponent from '../AbstractComponent.js';

const RenderPosition = {
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

const render = (container, child, place = RenderPosition.BEFOREEND) => {
  if (container instanceof AbstractComponent) {
    container = container.getElement();
  }
  if (child instanceof AbstractComponent) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTEREND:
      container.after(child);
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

export {
  render,
  remove,
  createElement,
  RenderPosition
};
