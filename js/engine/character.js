class Character {
  constructor() {
    this.reset();
  }
  reset() {
    this.name = "";
    this.race = null;
    this.subrace = null;
    this.className = null;
    this.subclass = null;
    this.level = 1;
    this.background = null;
    this.abilities = { Сила: 10, Ловкость: 10, Телосложение: 10, Интеллект: 10, Мудрость: 10, Харизма: 10 };
    this.racialBonuses = {};
    this.featBonuses = {};
    this.skills = [];
    this.tools = [];
    this.languages = ["Общий"];
    this.feats = [];
    this.equipment = [];
    this.spells = [];
    this.hitDie = 0;
    this.maxHP = 0;
    this.currentHP = 0;
    this.armorClass = 10;
    this.initiative = 0;
    this.speed = 30;
    this.proficiency = 2;
    this.classFeatures = []; // список полученных умений класса
    this.raceFeatures = [];
    this.backgroundFeatures = [];
    this.spellSlots = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    this.spellDC = 8;
  }

  setRace(raceKey) {
    const race = RACES[raceKey];
    this.race = raceKey;
    this.abilityBonuses = { ...race.abilityBonuses };
    this.speed = race.speed;
    this.languages = [...race.languages];
    this.raceFeatures = [...race.traits];
    this.applyRacialTraits(race.traits);
    if (race.subraces) {
      // ожидаем выбор подрасы позже
    }
  }

  setSubrace(subraceKey) {
    const race = RACES[this.race];
    const subrace = race.subraces[subraceKey];
    this.subrace = subraceKey;
    Object.entries(subrace.abilityBonuses).forEach(([stat, val]) => {
      this.racialBonuses[stat] = (this.racialBonuses[stat] || 0) + val;
    });
    this.applyRacialTraits(subrace.traits);
  }

  applyRacialTraits(traits) {
    traits.forEach(t => {
      switch (t.type) {
        case "darkvision": // запомним
          break;
        case "skill": if (t.skills) this.skills.push(...t.skills); break;
        case "proficiency": break; // уже в raceFeatures
        // другие типы
      }
    });
  }

  calculateStats() {
    // пересчет характеристик с учетом расовых бонусов и черт
    for (let stat in this.abilities) {
      this.abilities[stat] = 10 + (this.racialBonuses[stat] || 0) + (this.featBonuses[stat] || 0);
    }
    this.updateProficiency();
    this.updateHP();
    this.updateAC();
  }

  updateProficiency() {
    this.proficiency = 2 + Math.floor((this.level - 1) / 4);
  }

  updateHP() {
    if (!this.className) return;
    const cls = CLASSES[this.className];
    this.maxHP = cls.hitDie + (this.abilitiesMod("Телосложение") * this.level);
  }

  abilitiesMod(ab) {
    return Math.floor((this.abilities[ab] - 10) / 2);
  }

  updateAC() {
    // базовая формула; могут модифицировать умения
    this.armorClass = 10 + this.abilitiesMod("Ловкость");
  }

  save() {
    const data = {
      name: this.name,
      race: this.race,
      subrace: this.subrace,
      className: this.className,
      level: this.level,
      abilities: this.abilities,
      feats: this.feats,
      spells: this.spells,
      equipment: this.equipment,
      // ...
    };
    localStorage.setItem('dnd_character', JSON.stringify(data));
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem('dnd_character', JSON.stringify(data));
    }
  }

  load() {
    const data = localStorage.getItem('dnd_character');
    if (data) {
      const obj = JSON.parse(data);
      Object.assign(this, obj);
    }
  }
}