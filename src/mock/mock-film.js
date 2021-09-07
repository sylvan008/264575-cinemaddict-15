import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomArrayElement} from '../utils/common.js';
import {generateNames, generateDate, generateText} from './mock-helpers.js';

const generatePoster = () => {
  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];
  return `./images/posters/${getRandomArrayElement(posters)}`;
};

const generateTitle = () => {
  const titles = [
    ['Крестный отец', 'The Godfather'],
    ['Побег из Шоушенка', 'The Shawshank Redemption'],
    ['Темный рыцарь', 'The Dark Knight'],
    ['12 разгневанных мужчин', '12 Angry Men'],
    ['Список Шиндлера', 'Schindler\'s List'],
    ['Властелин колец: Возвращение короля', 'The Lord of the Rings: The Return of the King'],
    ['Криминальное чтиво', 'Pulp Fiction'],
    ['Хороший, плохой, злой', 'Il buono, il brutto, il cattivo'],
    ['Бойцовский клуб', 'Fight Club'],
    ['Форрест Гамп', 'Forrest Gump'],
  ];
  return getRandomArrayElement(titles);
};

const generateRating = () => {
  const rating = Number.parseFloat((Math.random() * 11).toFixed(1));
  return Math.min (rating, 10);
};

const generateGenre = () => {
  const genres = [
    'Action',
    'Adventure',
    'Animation',
    'Biography',
    'Comedy',
    'Crime',
    'Drama',
    'Family',
    'Fantasy',
    'Film-Noir',
    'History',
    'Horror',
    'Music',
    'Musical',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Sport',
    'Thriller',
    'War',
    'Western',
  ];
  const countGenres = getRandomInteger(1, 3);
  return new Array(countGenres).fill().map(() => getRandomArrayElement(genres));
};

const generateCountry = () => {
  const country = ['USA', 'Russia', 'France', 'Germany', 'Japan', 'Finland', 'Norway'];
  return getRandomArrayElement(country);
};

const generateAgeRating = () => {
  const ageRatings = [0, 6, 12, 6, 18];
  return `${getRandomArrayElement(ageRatings)}+`;
};

const generateUserDetails = () => {
  const watchlist = Boolean(getRandomInteger());
  const alreadyWatched = Boolean(getRandomInteger());
  const watchingDate = alreadyWatched ? generateDate([1990, dayjs().year()]) : null;
  const favorite = Boolean(getRandomInteger());
  return {
    watchlist,
    alreadyWatched,
    watchingDate,
    favorite,
  };
};

const generateComments = (maxCommentsCount=5) => (
  new Array(getRandomInteger(0, maxCommentsCount))
    .fill()
    .map(() => getRandomInteger(0, 100).toString())
);

const generateFilm = () => {
  const [title, originalTitle] = generateTitle();
  return {
    filmInfo: {
      id: nanoid(),
      title,
      originalTitle,
      poster: generatePoster(),
      description: generateText(),
      totalRating: generateRating(),
      runtime: getRandomInteger(60, 200),
      genre: generateGenre(),
      release: {
        date: generateDate(),
        country: generateCountry(),
      },
      director: generateNames(),
      writers: generateNames(3),
      actors: generateNames(3),
      ageRating: generateAgeRating(),
    },
    comments: generateComments(),
    userDetails: generateUserDetails(),
  };
};

export {
  generateFilm
};
