import FilmsModel from './model/films.js';
import FiltersModel from './model/filters.js';
import {Board} from './presenter/board.js';
import Filter from './presenter/filter.js';
import User from './presenter/user.js';
import FooterStatisticsView from './view/footer-statistics.js';
import StatisticView from './view/statistic.js';
import {MenuTypes, UpdateType} from './utils/const.js';
import {remove, render} from './utils/render.js';
import CommentsModel from './model/comments.js';
import Api from './api.js';

const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic gjoo9fvs4njdfsii49hck439!';

const pageElement = document.querySelector('body');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const mainElement = pageElement.querySelector('.main');
const headerElement = pageElement.querySelector('.header');

const api = new Api(END_POINT, AUTHORIZATION);

const filtersModel = new FiltersModel();
const filmsModel = new FilmsModel(api);
const commentsModel = new CommentsModel(api);

const userProfilePresenter = new User(headerElement, filmsModel);
userProfilePresenter.init();

const boardPresenter = new Board(pageElement, filmsModel, commentsModel, filtersModel);
boardPresenter.init();

let statisticComponent = null;

const handleSiteMenuClick = (menuType) => {
  switch (menuType) {
    case MenuTypes.BOARD:
      if (boardPresenter.isInit) {
        return;
      }
      boardPresenter.init();
      remove(statisticComponent);
      statisticComponent = null;
      break;
    case MenuTypes.STATISTICS:
      boardPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel.films.filter((film) => film.userDetails.alreadyWatched));
      render(mainElement, statisticComponent);
      break;
  }
};

const filtersPresenter = new Filter(mainElement, filtersModel, filmsModel, handleSiteMenuClick);
filtersPresenter.init();

const renderFooterStatistic = (updateType) => {
  if (updateType === UpdateType.INIT) {
    render(footerStatisticsElement, new FooterStatisticsView(filmsModel.films.length));
    filmsModel.removeObserver(renderFooterStatistic);
  }
};

filmsModel.addObserver(renderFooterStatistic);

