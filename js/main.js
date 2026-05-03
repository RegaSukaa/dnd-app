const character = new Character();
character.load();
if (!character.race) {
  // начинаем создание
  document.querySelector('.tab[data-tab="create"]').classList.add('active');
  showCreator();
} else {
  showSheet();
}