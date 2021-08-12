import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import {RenderPosition} from './const.js';

const HOUR = 60;
const BREAKDOWN_RANGE_DAY = 'day';

dayjs.extend(relativeTime);

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrayElement(array) {
  return array[getRandomInteger(0, array.length - 1)];
}

const getHumanizeDate = (date, template = 'D YYYY') => dayjs(date).format(template);

const getHumanizeFilmDuration = (runtime) => `${Math.floor(runtime / HOUR)}h ${runtime % HOUR}m`;

const getRelativeDate = (date) => dayjs(date).fromNow();
const getDateDifferenceFromNow = (date, breakdownRange=BREAKDOWN_RANGE_DAY) => dayjs().diff(date, breakdownRange);

const sortFilmByRating = (filmA, filmB) => {
  const totalRatingA = filmA.filmInfo.totalRating;
  const totalRatingB = filmB.filmInfo.totalRating;
  return totalRatingB - totalRatingA;
};

const sortFilmByComments = (filmA, filmB) => {
  const commentsCountA = filmA.comments.length;
  const commentsCountB = filmB.comments.length;
  return commentsCountB - commentsCountA;
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
  }
};

const createElement = (template) => {
  const element = document.createElement('div');
  element.innerHTML = template;
  return element.firstChild;
};

export {
  render,
  createElement,
  getRandomInteger,
  getRandomArrayElement,
  getHumanizeDate,
  getHumanizeFilmDuration,
  sortFilmByRating,
  sortFilmByComments,
  getRelativeDate,
  getDateDifferenceFromNow
};
