export const createFilmList = (listProps) => {
  const {title, isHidden, isExtra} = listProps;
  const filmListClasses = isExtra ? 'films-list--extra' : '';
  const titleClasses = isHidden ? 'visually-hidden' : '';
  return `
    <section class="films-list ${filmListClasses}">
      <h2 class="films-list__title ${titleClasses}">${title}</h2>

      <div class="films-list__container"></div>
    </section>
  `;
};
