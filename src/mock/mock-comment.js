import dayjs from 'dayjs';
import {emotions} from '../utils/const.js';
import {getRandomArrayElement} from '../utils/common.js';
import {generateNames, generateDate, generateText} from './mock-helpers.js';

const generateEmotion = () => (getRandomArrayElement(emotions));

const createIdGenerator = (numberId = 100) => {
  const idList = [];
  for (let i = 1; i <= numberId; i++) {
    idList.push(i);
  }
  return () => {
    if (idList.length === 0) {
      return;
    }
    return idList.shift().toString();
  };
};

const generateId = createIdGenerator();

const generateComment = () => {
  const now = dayjs();
  const nowYear = now.year();
  const nowMonth = now.month() + 1;
  const dayNow = now.date();
  return {
    id: generateId(),
    author: generateNames(),
    comment: generateText(3),
    date: generateDate(
      [nowYear, nowYear],
      [nowMonth, nowMonth],
      [now.subtract(3, 'day').date(), dayNow],
    ),
    emotion: generateEmotion(),
  };
};

export {
  generateComment
};
