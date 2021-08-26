import {getDatesDifference} from './date.js';

const SortTypes = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
  COMMENTS: 'comments',
};

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

const sortFilmByDate = (filmA, filmB) => {
  const dateA = filmA.filmInfo.release.date;
  const dateB = filmB.filmInfo.release.date;
  return getDatesDifference(dateB, dateA);
};

export {
  SortTypes,
  sortFilmByRating,
  sortFilmByComments,
  sortFilmByDate
};
