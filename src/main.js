import {createUserProfile} from './views/user-profile.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

function render(container, template, place) {
  container.insertAdjacentHTML(place, template);
}

render(headerElement, createUserProfile(), 'beforeend');
