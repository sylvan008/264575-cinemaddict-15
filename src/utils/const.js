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

const NavigationTypes = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

export {
  FilmListTypes,
  emotions,
  FilmControlTypes,
  NavigationTypes
};
