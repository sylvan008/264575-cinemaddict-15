import {createUserProfile} from './view/user-profile.js';
import {createMainNavigation} from './view/main-navigation.js';
import {createSortMenu} from './view/sort-menu.js';
import {createFilmsBoard} from './view/films-board.js';
import {createFooterStatistics} from './view/footer-statistics.js';
import {createPopup} from './view/popup.js';
import {createFilmList} from './view/film-list.js';
import {createFilmCard} from './view/film-card.js';
import {createShowMoreButton} from './view/show-more.js';
import {createComments} from './view/comments.js';
import {createNewComment} from './view/new-comment.js';
import {generateFilm} from './mock/mock-film.js';
import {generateComment} from './mock/mock-comment.js';
import {getRandomInteger, render, sortFilmByComments, sortFilmByRating} from './utils';
import {NavigationTypes, FilmListTypes} from './utils/const.js';

const CARDS_LOAD_STEP = 5;
const CARDS_EXTRA_LOAD_STEP = 2;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(22).fill('').map(generateFilm);
const topFilmsData = filmsData.slice().sort(sortFilmByRating);
const commentsFilmsData = filmsData.slice().sort(sortFilmByComments);
const selectedMovie = filmsData[getRandomInteger(0, filmsData.length - 1)];
const selectedMovieComments = selectedMovie.comments
  .map((movieCommentId) => commentsData.find(({id}) => id === movieCommentId));
const countUserStatistic = (filmsList, propertyName) => (
  filmsList.reduce((acc, {userDetails}) => acc + Number(userDetails[propertyName]), 0)
);
const watchlistFilmsCount = countUserStatistic(filmsData,'watchlist');
const watchedFilmsCount = countUserStatistic(filmsData, 'alreadyWatched');
const favoriteFilmsCount = countUserStatistic(filmsData, 'favorite');
const navigationStatistics = {
  [NavigationTypes.WATCHLIST]: watchlistFilmsCount,
  [NavigationTypes.HISTORY]: watchedFilmsCount,
  [NavigationTypes.FAVORITES]: favoriteFilmsCount,
};

const renderCards = (container, films) => {
  films.forEach((film) => render(container, createFilmCard(film)));
};

render(headerElement, createUserProfile(watchedFilmsCount));
render(mainElement, createMainNavigation(navigationStatistics));
render(mainElement, createSortMenu());
render(mainElement, createFilmsBoard(filmsData));

const filmBoard = document.querySelector('.films');
render(filmBoard, createFilmList(FilmListTypes.ALL_MOVIES));

const allMovieSection = filmBoard.querySelector('.films-list');

render(filmBoard, createFilmList(FilmListTypes.TOP_MOVIES));
render(filmBoard, createFilmList(FilmListTypes.COMMENTED_MOVIES));

const allMoviesList = allMovieSection.querySelector('.films-list__container');
const [topMoviesList, commentMoviesList] = filmBoard.querySelectorAll('.films-list--extra .films-list__container');
renderCards(allMoviesList, filmsData.slice(0, CARDS_LOAD_STEP));
renderCards(topMoviesList, topFilmsData.slice(0, CARDS_EXTRA_LOAD_STEP));
renderCards(commentMoviesList, commentsFilmsData.slice(0, CARDS_EXTRA_LOAD_STEP) );

render(footerStatisticsElement, createFooterStatistics(filmsData.length));
render(footerElement, createPopup(selectedMovie), 'afterend');

const filmDetailBottomContainer = document.querySelector('.film-details .film-details__bottom-container');
render(filmDetailBottomContainer, createComments(selectedMovieComments));

const commentsContainer = filmDetailBottomContainer.querySelector('.film-details__comments-wrap');
render(commentsContainer, createNewComment());

if (filmsData.length > CARDS_LOAD_STEP) {
  let renderedCardCount = CARDS_LOAD_STEP;
  render(allMovieSection, createShowMoreButton());
  const loadMoreButton = allMovieSection.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    const nextCards = Math.min(filmsData.length, renderedCardCount + CARDS_LOAD_STEP);
    renderCards(allMoviesList, filmsData.slice(renderedCardCount, nextCards));
    renderedCardCount = nextCards;
    if (renderedCardCount >= filmsData.length) {
      loadMoreButton.remove();
    }
  });
}
