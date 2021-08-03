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
import {sortFilmByComments, sortFilmByRating} from './utils';

const CARDS_LOAD_STEP = 5;
const CARDS_EXTRA_LOAD_STEP = 2;
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

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const commentsData = new Array(100).fill().map(generateComment);
const filmsData = new Array(22).fill().map(generateFilm);
const topFilmsData = filmsData.slice().sort(sortFilmByRating);
const commentsFilmsData = filmsData.slice().sort(sortFilmByComments);

const render = (container, template, place='beforeend') => {
  container.insertAdjacentHTML(place, template);
};
const renderFilmCards = (filmList, loadStep, target) => {
  for (let i = 0; i < Math.min(filmList.length, loadStep); i++) {
    const {filmInfo, comments} = filmList[i];
    const commentsCount = comments.length;
    render(target, createFilmCard(filmInfo, commentsCount));
  }
};

render(headerElement, createUserProfile());
render(mainElement, createMainNavigation());
render(mainElement, createSortMenu());
render(mainElement, createFilmsBoard(filmsData));

const filmBoard = document.querySelector('.films');
render(filmBoard, createFilmList(FilmListTypes.ALL_MOVIES));

const allMovieSection = filmBoard.querySelector('.films-list');
render(allMovieSection, createShowMoreButton());

render(filmBoard, createFilmList(FilmListTypes.TOP_MOVIES));
render(filmBoard, createFilmList(FilmListTypes.COMMENTED_MOVIES));

const allMoviesList = allMovieSection.querySelector('.films-list__container');
const [topMoviesList, commentMoviesList] = filmBoard.querySelectorAll('.films-list--extra .films-list__container');
renderFilmCards(filmsData, CARDS_LOAD_STEP, allMoviesList);
renderFilmCards(topFilmsData, CARDS_EXTRA_LOAD_STEP, topMoviesList);
renderFilmCards(commentsFilmsData, CARDS_EXTRA_LOAD_STEP, commentMoviesList);


render(footerStatisticsElement, createFooterStatistics());
render(footerElement, createPopup(), 'afterend');

const filmDetailBottomContainer = document.querySelector('.film-details .film-details__bottom-container');
render(filmDetailBottomContainer, createComments());

const commentsContainer = filmDetailBottomContainer.querySelector('.film-details__comments-wrap');
render(commentsContainer, createNewComment());
