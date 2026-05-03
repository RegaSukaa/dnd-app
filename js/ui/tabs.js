document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const tabName = tab.dataset.tab;
    if (tabName === 'create') showCreator();
    else if (tabName === 'sheet') showSheet();
    else if (tabName === 'spells') showSpells();
  });
});