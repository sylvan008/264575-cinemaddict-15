const getUserRank = (watchedFilmsCount) => {
  if (watchedFilmsCount <= 10) {
    return 'Novice';
  }
  if (watchedFilmsCount <= 20) {
    return 'Fan';
  }
  return 'Movie Buff';
};

const createUserRank = (rank) => `<p class="profile__rating">${rank}</p>`;

export const createUserProfile = (watchedFilmsCount) => {
  const isViewRating = Boolean(watchedFilmsCount);
  const ratingTemplate = isViewRating ? createUserRank(getUserRank(watchedFilmsCount)) : '';
  return `
    <section class="header__profile profile">
      ${ratingTemplate}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};
