let creationStep = 0;
const creationSteps = [
  'race', 'subrace', 'class', 'subclass', 'abilities',
  'background', 'feats', 'equipment', 'spells', 'finish'
];

function showCreator() {
  const main = document.getElementById('main-content');
  main.innerHTML = `<h2>Создание персонажа</h2>
    <div id="progress">Шаг ${creationStep+1} из ${creationSteps.length}</div>
    <div id="creator-container"></div>`;
  renderStep();
}

function nextStep() {
  if (creationStep < creationSteps.length - 1) {
    creationStep++;
    renderStep();
  } else {
    // Завершение
    document.getElementById('creator-container').innerHTML = '<h3>Персонаж создан!</h3>';
    character.save();
  }
}

function prevStep() {
  if (creationStep > 0) {
    creationStep--;
    renderStep();
  }
}

function renderStep() {
  const container = document.getElementById('creator-container');
  container.innerHTML = '';
  const step = creationSteps[creationStep];

  switch (step) {
    case 'race':
      renderRaceStep(container);
      break;
    case 'subrace':
      renderSubraceStep(container);
      break;
    case 'class':
      renderClassStep(container);
      break;
    case 'subclass':
      renderSubclassStep(container);
      break;
    case 'abilities':
      renderAbilitiesStep(container);
      break;
    case 'background':
      renderBackgroundStep(container);
      break;
    case 'feats':
      renderFeatsStep(container);
      break;
    case 'equipment':
      renderEquipmentStep(container);
      break;
    case 'spells':
      renderSpellsStep(container);
      break;
    case 'finish':
      container.innerHTML = '<h3>Создание завершено!</h3><p>Ваш персонаж готов.</p>';
      character.save();
      break;
  }

  // Кнопки навигации
  const nav = document.createElement('div');
  nav.style.marginTop = '20px';
  if (creationStep > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'tg-btn';
    prevBtn.textContent = 'Назад';
    prevBtn.onclick = prevStep;
    nav.appendChild(prevBtn);
  }
  const nextBtn = document.createElement('button');
  nextBtn.className = 'tg-btn';
  nextBtn.textContent = creationStep === creationSteps.length - 1 ? 'Завершить' : 'Далее';
  nextBtn.onclick = () => {
    if (step === 'abilities') {
      // Проверка, что очки распределены
      const spent = Object.values(character.abilities).reduce((a,b)=>a+b, 0);
      if (spent !== 72) return alert('Распределите все очки (стандартные значения 15,14,13,12,10,8)');
    }
    if (step === 'spells' && character.classData?.spellcasting) {
      // Если заклинатель, проверяем, что выбраны заклинания
    }
    nextStep();
  };
  nav.appendChild(nextBtn);
  container.appendChild(nav);
}

function renderRaceStep(container) {
  container.innerHTML = '<h3>Выберите расу</h3>';
  const list = document.createElement('div');
  Object.keys(RACES).forEach(raceKey => {
    const race = RACES[raceKey];
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<b>${race.name}</b> — ${Object.entries(race.abilityBonuses).map(([k,v])=>`${k} +${v}`).join(', ')}`;
    div.onclick = () => {
      character.setRace(raceKey);
      // Если у расы нет подрас, пропускаем шаг подрасы
      if (!race.subraces) {
        creationStep++; // пропустить subrace
      }
      renderStep();
    };
    list.appendChild(div);
  });
  container.appendChild(list);
}

function renderSubraceStep(container) {
  const race = RACES[character.race];
  if (!race.subraces) {
    nextStep();
    return;
  }
  container.innerHTML = '<h3>Выберите подрасу</h3>';
  const list = document.createElement('div');
  Object.entries(race.subraces).forEach(([subKey, sub]) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<b>${subKey}</b> ${sub.abilityBonuses ? Object.entries(sub.abilityBonuses).map(([k,v])=>`${k} +${v}`).join(', ') : ''}`;
    div.onclick = () => {
      character.setSubrace(subKey);
      renderStep();
    };
    list.appendChild(div);
  });
  container.appendChild(list);
}

function renderClassStep(container) {
  container.innerHTML = '<h3>Выберите класс</h3>';
  const list = document.createElement('div');
  Object.keys(CLASSES).forEach(classKey => {
    const cls = CLASSES[classKey];
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<b>${cls.name}</b> (хит дайс: к${cls.hitDie})`;
    div.onclick = () => {
      character.setClass(classKey);
      // Если у класса обязательный подкласс (на 1-3 уровне), будет выбор на шаге subclass
      if (!cls.subclasses) {
        creationStep++; // пропустить шаг подкласса
      }
      renderStep();
    };
    list.appendChild(div);
  });
  container.appendChild(list);
}

function renderSubclassStep(container) {
  const cls = CLASSES[character.className];
  if (!cls.subclasses) {
    nextStep();
    return;
  }
  container.innerHTML = '<h3>Выберите подкласс</h3>';
  const list = document.createElement('div');
  Object.keys(cls.subclasses).forEach(subKey => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.textContent = subKey;
    div.onclick = () => {
      character.setSubclass(subKey);
      renderStep();
    };
    list.appendChild(div);
  });
  container.appendChild(list);
}

function renderAbilitiesStep(container) {
  // Стандартный набор 15,14,13,12,10,8
  container.innerHTML = '<h3>Распределите характеристики</h3><p>Стандартные значения: 15, 14, 13, 12, 10, 8</p>';
  const abilities = ['Сила','Ловкость','Телосложение','Интеллект','Мудрость','Харизма'];
  const defaults = [15,14,13,12,10,8];
  if (!character.abilities || Object.values(character.abilities).every(v=>v===10)) {
    abilities.forEach((ab, i) => {
      character.abilities[ab] = defaults[i];
    });
  }
  abilities.forEach(ab => {
    const div = document.createElement('div');
    div.innerHTML = `${ab}: <input type="number" id="abl-${ab}" value="${character.abilities[ab]}" min="3" max="20">`;
    container.appendChild(div);
  });
  // Обработчик на кнопке "Далее" проверит сумму
}

function renderBackgroundStep(container) {
  container.innerHTML = '<h3>Выберите предысторию</h3>';
  const list = document.createElement('div');
  BACKGROUNDS.forEach(bg => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<b>${bg.name}</b> — ${bg.skills.join(', ')}`;
    div.onclick = () => {
      character.setBackground(bg);
      renderStep();
    };
    list.appendChild(div);
  });
  container.appendChild(list);
}

function renderFeatsStep(container) {
  // Если персонаж получает черту (например, человек альтернативный) или уровень 4/8/12/16/19
  container.innerHTML = '<h3>Выберите черту</h3>';
  const available = FEATS.filter(f => !character.feats.includes(f.name));
  if (available.length === 0) {
    container.innerHTML += '<p>Нет доступных черт</p>';
    return;
  }
  const list = document.createElement('div');
  available.forEach(feat => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<b>${feat.name}</b> — ${feat.desc || ''}`;
    div.onclick = () => {
      character.feats.push(feat.name);
      character.applyFeat(feat);
      renderStep();
    };
    list.appendChild(div);
  });
  container.appendChild(list);
}

function renderEquipmentStep(container) {
  container.innerHTML = '<h3>Начальное снаряжение</h3><p>Снаряжение выбрано автоматически из класса и предыстории. В полной версии можно изменить.</p>';
  // Автоматически заполнить из класса/предыстории
  character.equipment = character.startingEquipment();
  container.innerHTML += '<pre>' + character.equipment.map(e => e.name).join('\n') + '</pre>';
}

function renderSpellsStep(container) {
  const cls = CLASSES[character.className];
  if (!cls.spellcasting) {
    nextStep();
    return;
  }
  container.innerHTML = '<h3>Выберите заклинания</h3>';
  const classId = cls.spellcasting.classId; // индекс класса: 0-бард, 1-жрец и т.д.
  const availableSpells = SPELLS.filter(s => s.classes.includes(classId) && s.level <= character.maxSpellLevel());
  // Упрощённо: выбираем количество, указанное в features класса для 1 уровня
  const feature = cls.features.find(f => f.type === 'spellcasting' && f.level === 1);
  if (!feature) return;
  const selectCount = feature.cantrips + feature.spells; // нужно разделить выбор заговоров и заклинаний
  // Показываем полный список с чекбоксами
  const list = document.createElement('div');
  availableSpells.forEach(spell => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<b>${spell.name}</b> (ур.${spell.level})`;
    div.onclick = () => {
      if (character.spells.length < selectCount && !character.spells.includes(spell.id)) {
        character.spells.push(spell.id);
        div.style.backgroundColor = '#d4edda';
      } else if (character.spells.includes(spell.id)) {
        character.spells = character.spells.filter(s => s !== spell.id);
        div.style.backgroundColor = '';
      }
    };
    list.appendChild(div);
  });
  container.appendChild(list);
}