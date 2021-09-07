const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const FilmListTypes = {
  ALL_MOVIES: {
    title: 'All movies. Upcoming',
    isHidden: true,
    isExtra: false,
  },
  TOP_MOVIES: {
    title: 'Top rated',
    isHidden: false,
    isExtra: true,
  },
  COMMENTED_MOVIES: {
    title: 'Most commented',
    isHidden: false,
    isExtra: true,
  },
};

const FilmControlTypes = {
  WATCHLIST: 'watchlist',
  WATCHED: 'alreadyWatched',
  FAVORITE: 'favorite',
};

const FilterTypes = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  FilmListTypes,
  emotions,
  FilmControlTypes,
  FilterTypes,
  UserAction,
  UpdateType
};
