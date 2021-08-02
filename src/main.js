import {createUserProfile} from './view/user-profile.js';
import {createMainNavigation} from './view/main-navigation.js';
import {createSortMenu} from './view/sort-menu.js';
import {createFilmsBoard} from './view/films-board.js';
import {createFooterStatistics} from './view/footer-statistics.js';
import {createPopup} from './view/popup.js';
import {createFilmList} from './view/film-list.js';
import {createFilmCard} from './view/film-card.js';
import {createShowMoreButton} from './view/show-more.js';

const CARDS_START_VIEW = 5;
const CARDS_EXTRA_VIEW = 2;
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
const films = new Array(5).fill(null);
const viewAllFilms = films
  .slice(0, CARDS_START_VIEW)
  .map(createFilmCard)
  .join('');
const viewExtraFilms = films
  .slice(0, CARDS_EXTRA_VIEW)
  .map(createFilmCard)
  .join('');

function render(container, template, place='beforeend') {
  container.insertAdjacentHTML(place, template);
}

render(headerElement, createUserProfile());
render(mainElement, createMainNavigation());
render(mainElement, createSortMenu());
render(mainElement, createFilmsBoard(films));

const filmBoard = document.querySelector('.films');
render(filmBoard, createFilmList(FilmListTypes.ALL_MOVIES));

const allMovieSection = filmBoard.querySelector('.films-list');
render(allMovieSection, createShowMoreButton());

render(filmBoard, createFilmList(FilmListTypes.TOP_MOVIES));
render(filmBoard, createFilmList(FilmListTypes.COMMENTED_MOVIES));

const allMoviesList = allMovieSection.querySelector('.films-list__container');
const [topMoviesList, commentMoviesList] = filmBoard.querySelectorAll('.films-list--extra .films-list__container');
render(allMoviesList, viewAllFilms);
render(topMoviesList, viewExtraFilms);
render(commentMoviesList, viewExtraFilms);


render(footerStatisticsElement, createFooterStatistics());
render(footerElement, createPopup(), 'afterend');
