const SortTypes = {
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

export {
  SortTypes,
  sortFilmByRating,
  sortFilmByComments
};
