import {emotions} from '../utils/const.js';
import {getRandomArrayElement} from '../utils';
import {generateNames, generateDate, generateText} from './mock-helpers.js';

const generateEmotion = () => (getRandomArrayElement(emotions));

const createIdGenerator = (numberId=100) => {
  const idList = [];
  for (let i = 1; i <= numberId; i++) {
    idList.push(i);
  }
  return () => {
    if (idList.length === 0) {
      return;
    }
    return idList.shift();
  };
};

const generateId = createIdGenerator();

const generateComment = () => ({
  id: generateId(),
  author: generateNames(),
  comment: generateText(3),
  date: generateDate(2019, 2021),
  emotion: generateEmotion(),
});

export {
  generateComment
};
