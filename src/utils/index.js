import dayjs from 'dayjs';

const HOUR = 60;

function getRandomInteger(a=0, b=1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrayElement(array) {
  return array[getRandomInteger(0, array.length - 1)];
}

const getHumanizeDate = (date, template='D YYYY') => dayjs(date).format(template);

const getHumanizeFilmDuration = (runtime) => `${Math.floor(runtime / HOUR)}h ${runtime % HOUR}m`;

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

export {
  getRandomInteger,
  getRandomArrayElement,
  getHumanizeDate,
  getHumanizeFilmDuration,
  sortFilmByRating,
  sortFilmByComments
};
