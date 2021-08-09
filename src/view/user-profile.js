const EDGE_NOVICE = 10;
const EDGE_FAN = 20;

const getUserRank = (watchedFilmsCount) => {
  if (watchedFilmsCount <= EDGE_NOVICE) {
    return 'Novice';
  }
  if (watchedFilmsCount <= EDGE_FAN) {
    return 'Fan';
  }
  return 'Movie Buff';
};

const createUserRank = (rank) => `<p class="profile__rating">${rank}</p>`;

export const createUserProfile = (watchedFilmsCount) => `
    <section class="header__profile profile">
      ${watchedFilmsCount ? createUserRank(getUserRank(watchedFilmsCount)) : ''}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
