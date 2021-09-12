import {nanoid} from 'nanoid';
import he from 'he';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const getId = () => nanoid();

const encodeUnsafeSymbols = (str) => he.encode(str);

export {
  getRandomInteger,
  getRandomArrayElement,
  isEscapeKey,
  getId,
  encodeUnsafeSymbols
};
