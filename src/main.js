import {createUserProfile} from './view/user-profile.js';
import {createMainNavigation} from './view/main-navigation.js';
import {createSortMenu} from './view/sort-menu.js';
import {createFilmsBoard} from './view/films-board.js';
import {createFooterStatistics} from './view/footer-statistics.js';
import {createPopup} from './view/popup.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');
const films = {
  allFilms: new Array(5).fill(null),
  mostRecommended: new Array(2).fill(null),
  topRated: new Array (2).fill(null),
};

function render(container, template, place) {
  container.insertAdjacentHTML(place, template);
}

render(headerElement, createUserProfile(), 'beforeend');
render(mainElement, createMainNavigation(), 'beforeend');
render(mainElement, createSortMenu(), 'beforeend');
render(mainElement, createFilmsBoard(films), 'beforeend');
render(footerStatisticsElement, createFooterStatistics(), 'beforeend');
render(footerElement, createPopup(), 'afterend');
