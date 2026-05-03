// Обработка выбора умений персонажа

/**
 * Открывает модальное окно с выбором из списка options.
 * @param {string} title - заголовок окна
 * @param {Array} options - массив строк или объектов {name, desc}
 * @param {number} maxCount - сколько можно выбрать
 * @param {function} callback - вызывается с массивом выбранных значений
 */
function openSelectionModal(title, options, maxCount, callback) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  body.innerHTML = `<h3>${title}</h3>`;
  const selected = [];

  options.forEach((opt, index) => {
    const label = document.createElement('label');
    label.className = 'list-item';
    const input = document.createElement('input');
    input.type = maxCount > 1 ? 'checkbox' : 'radio';
    input.name = 'selection';
    input.value = index;
    input.addEventListener('change', () => {
      if (maxCount === 1) {
        selected.length = 0;
        selected.push(opt.name || opt);
        document.querySelectorAll('#modal-body input').forEach(inp => inp.checked = false);
        input.checked = true;
      } else {
        if (input.checked) {
          if (selected.length < maxCount) selected.push(opt.name || opt);
          else input.checked = false;
        } else {
          const idx = selected.indexOf(opt.name || opt);
          if (idx > -1) selected.splice(idx, 1);
        }
      }
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + (opt.name || opt)));
    if (opt.desc) {
      const hint = document.createElement('small');
      hint.textContent = ` — ${opt.desc}`;
      label.appendChild(hint);
    }
    body.appendChild(label);
  });

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'tg-btn';
  confirmBtn.textContent = 'Подтвердить';
  confirmBtn.onclick = () => {
    if (selected.length === 0) return alert('Сделайте выбор');
    modal.classList.add('hidden');
    callback(selected);
  };
  body.appendChild(confirmBtn);

  document.querySelector('.modal .close').onclick = () => {
    modal.classList.add('hidden');
  };
  modal.classList.remove('hidden');
}

/**
 * Применить выбор умения к персонажу
 * @param {Character} character
 * @param {object} feature - объект умения (из класса, расы и т.п.)
 * @param {Array} selected - массив выбранных строк/идентификаторов
 */
function applyFeatureChoice(character, feature, selected) {
  switch (feature.type) {
    case 'skill':
      character.skills.push(...selected);
      break;
    case 'tool':
      character.tools.push(...selected);
      break;
    case 'language':
      character.languages.push(...selected);
      break;
    case 'feat':
      selected.forEach(f => character.feats.push(f));
      break;
    case 'fighting_style':
      character.fightingStyle = selected[0];
      // Применить бонусы (можно хранить отдельно)
      break;
    case 'battle_technique':
      if (!character.techniques) character.techniques = [];
      character.techniques.push(selected[0]);
      break;
    case 'appeal':
      if (!character.appeals) character.appeals = [];
      character.appeals.push(selected[0]);
      break;
    case 'totem':
      character.totem = selected[0];
      break;
    case 'aspect':
      if (!character.aspects) character.aspects = [];
      character.aspects.push(selected[0]);
      break;
    default:
      console.warn('Неизвестный тип умения:', feature.type);
  }
  character.save();
}

/**
 * Обработчик умения, который может требовать выбора.
 * @param {Character} character
 * @param {object} feature - объект умения
 * @param {function} onApplied - опциональный callback после применения
 */
function processFeature(character, feature, onApplied) {
  if (!feature.chooseCount || feature.chooseCount === 0) {
    // Ничего не выбираем, просто применяем пассивное свойство
    if (feature.type === 'passive' || feature.type === 'darkvision' || feature.type === 'proficiency') {
      // уже учтено в данных расы/класса
    }
    if (onApplied) onApplied();
    return;
  }

  let options = feature.options || [];
  if (options.length === 0) {
    // Попробуем определить список из данных
    if (feature.type === 'skill') options = ALL_SKILLS;
    else if (feature.type === 'tool') options = ALL_TOOLS;
    else if (feature.type === 'language') options = ALL_LANGUAGES;
    else if (feature.type === 'fighting_style') options = BATTLE_STYLES;
    else if (feature.type === 'battle_technique') options = FIGHTING_TECHNIQUES;
    else if (feature.type === 'appeal') options = APPEALS.filter(a => a.reqLevel <= character.level);
    else if (feature.type === 'feat') options = FEATS.filter(f => !character.feats.includes(f.name) && (!f.prereq || character.skills.length || character.spells.length)); // упрощённо
    else if (feature.type === 'totem') options = [{ name: "Волк" }, { name: "Медведь" }, { name: "Орёл" }];
    else if (feature.type === 'aspect') options = [{ name: "Волк" }, { name: "Медведь" }, { name: "Орёл" }];
  }

  openSelectionModal(
    `Выберите ${feature.name || 'опции'} (до ${feature.chooseCount})`,
    options,
    feature.chooseCount,
    (selected) => {
      applyFeatureChoice(character, feature, selected);
      if (onApplied) onApplied();
    }
  );
}