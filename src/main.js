import {createUserProfile} from './view/user-profile.js';
import {createMainNavigation} from './view/main-navigation.js';
import {createSortMenu} from './view/sort-menu.js';
import {createFilmsBoard} from './view/films-board.js';
import {createFooterStatistics} from './view/footer-statistics.js';
import {createPopup} from './view/popup.js';

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
const films = {
  allFilms: new Array(5).fill(null),
  mostRecommended: new Array(2).fill(null),
  topRated: new Array (2).fill(null),
};

function render(container, template, place='beforeend') {
  container.insertAdjacentHTML(place, template);
}

render(headerElement, createUserProfile());
render(mainElement, createMainNavigation());
render(mainElement, createSortMenu());
render(mainElement, createFilmsBoard(films));
render(footerStatisticsElement, createFooterStatistics());
render(footerElement, createPopup(), 'afterend');
