import he from 'he';

const EDGE_NOVICE = 10;
const EDGE_FAN = 20;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const encodeUnsafeSymbols = (str) => he.encode(str);

const getUserRank = (watchedFilmsCount) => {
  if (watchedFilmsCount <= EDGE_NOVICE) {
    return 'Novice';
  }
  if (watchedFilmsCount <= EDGE_FAN) {
    return 'Fan';
  }
  return 'Movie Buff';
};

export {
  getRandomInteger,
  getRandomArrayElement,
  isEscapeKey,
  encodeUnsafeSymbols,
  getUserRank
};
