import {getRandomArrayElement, getRandomInteger} from '../utils';
import dayjs from 'dayjs';

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

const generateText = (maxCountSentences=5) => {
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
  const descriptionLength = getRandomInteger(1, maxCountSentences);
  return new Array(descriptionLength)
    .fill('')
    .map(() => getRandomArrayElement(sentences))
    .join(' ');
};

export {
  generateDate,
  generateNames,
  generateText
};
