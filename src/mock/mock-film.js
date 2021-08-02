import dayjs from 'dayjs';
import {getRandomInteger, getRandomArrayElement} from '../utils';

const generateDescription = () => {
  const sentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];
  const descriptionLength = getRandomInteger(1, 5);
  return new Array(descriptionLength)
    .fill('')
    .map(() => getRandomArrayElement(sentences))
    .join(' ');
};

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

const generateDate = (fromYear=1970, toYear=2021) => {
  const year = getRandomInteger(fromYear, toYear);
  const month = getRandomInteger(1, 12);
  const day = getRandomInteger(1, 31);
  return dayjs(`${year}-${month}-${day}`).format();
};

const generateNames = (count=1) => {
  const names = [
    'Leanne Graham',
    'Ervin Howell',
    'Clementine Bauch',
    'Patricia Lebsack',
    'Chelsey Dietrich',
    'Mrs. Dennis Schulist',
    'Kurtis Weissnat',
    'Nicholas Runolfsdottir V',
    'Glenna Reichert',
    'Clementina DuBuque',
  ];
  if (count === 1) {
    return getRandomArrayElement(names);
  }
  const writersCount = getRandomInteger(1, count);
  return new Array(writersCount).fill().map(() => getRandomArrayElement(names));
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
  const watchingDate = alreadyWatched ? generateDate(1990) : null;
  const favorite = Boolean(getRandomInteger());
  return {
    watchlist,
    alreadyWatched,
    watchingDate,
    favorite,
  };
};

const generateFilm = () => {
  const [title, originalTitle] = generateTitle();
  return {
    filmInfo: {
      title,
      originalTitle,
      poster: generatePoster(),
      description: generateDescription(),
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
    comments: [1, 2],
    userDetails: generateUserDetails(),
  };
};

export {
  generateFilm
};
