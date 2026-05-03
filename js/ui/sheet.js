function showSheet() {
  const main = document.getElementById('main-content');
  const c = character;
  main.innerHTML = `
    <h2>${c.name || 'Безымянный герой'}</h2>
    <p>Раса: ${c.race} ${c.subrace || ''}</p>
    <p>Класс: ${c.className} (уровень ${c.level})</p>
    <h3>Характеристики</h3>
    <ul>
      ${Object.entries(c.abilities).map(([k,v]) => `<li>${k}: ${v} (${c.abilitiesMod(k)>=0?'+':''}${c.abilitiesMod(k)})</li>`).join('')}
    </ul>
    <p>Хиты: ${c.currentHP}/${c.maxHP}</p>
    <p>КД: ${c.armorClass}</p>
    <p>Инициатива: ${c.abilitiesMod('Ловкость')>=0?'+':''}${c.abilitiesMod('Ловкость')}</p>
    <p>Скорость: ${c.speed} фт</p>
    <button onclick="rollCheck('Внимательность')">Проверка Внимательности</button>
  `;
}