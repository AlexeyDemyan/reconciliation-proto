const MOCK_DATA = {
  journal_entries: [
    {
      amount: 100,
      id: 'j1',
      type: 'journal',
    },
    {
      amount: 150,
      id: 'j2',
      type: 'journal',
    },
  ],
  payment_entries: [
    {
      amount: 80,
      id: 'p1',
      type: 'payment',
    },
    {
      amount: 70,
      id: 'p2',
      type: 'payment',
    },
  ],
};

let entriesToReconcile = [];

const journalEntriesElement = document.querySelector('.journal-entries-field');
const paymentEntriesElement = document.querySelector('.payment-entries-field');
const reconciledEntriesElement = document.querySelector('.reconciled-entries-filed');
const entryTemplate = document.querySelector('#entry').content;
const reconciledEntryTemplate =
  document.querySelector('#reconciled-entry').content;
const executeButton = document.querySelector('.execute');

const calculate = (entries) => {
  let sum = 0;
  entries.forEach((entry) => {
    if (entry.type === 'payment') {
      sum += Number(entry.amount);
    } else if (entry.type === 'journal') {
      sum -= Number(entry.amount);
    } else {
      throw new Error('incorrect entry type');
    }
  });

  return sum;
};

const renderEntry = (entry, element) => {
  const entryElement = entryTemplate.cloneNode(true);
  const amount = entryElement.querySelector('.entry-amount');
  amount.textContent = entry.amount;
  entryElement.querySelector('.entry').dataset.amount = entry.amount;
  const id = entryElement.querySelector('.entry-id');
  id.textContent = entry.id;
  entryElement.querySelector('.entry').dataset.id = entry.id;
  entryElement.querySelector('.entry').dataset.type = entry.type;
  element.appendChild(entryElement);
};

MOCK_DATA.journal_entries.forEach((entry) => {
  renderEntry(entry, journalEntriesElement);
});

MOCK_DATA.payment_entries.forEach((entry) => {
  renderEntry(entry, paymentEntriesElement);
});

const renderReconciledEntry = (entriesToReconcile) => {
  let reconciledEntriesIds = []
  const reconciledEntryElement = reconciledEntryTemplate.cloneNode(true);
  const calculation = reconciledEntryElement.querySelector('.calculation');
  calculation.textContent = calculate(entriesToReconcile);
  reconciledEntryElement.querySelector('.entry').dataset.amount =
    calculate(entriesToReconcile);
  const ids = reconciledEntryElement.querySelector('.entry-ids');
  entriesToReconcile.forEach((entry) => {
    reconciledEntriesIds.push(entry.id);
  })
  ids.textContent = reconciledEntriesIds.join(';');
  reconciledEntryElement.querySelector('.entry').dataset.id = Math.random();
  reconciledEntriesElement.appendChild(reconciledEntryElement);
};

const entryClickHandler = (elt) => {
  if (elt.classList.contains('selected')) {
    entriesToReconcile = entriesToReconcile.filter(
      (element) => element.id !== elt.dataset.id
    );
  } else {
    entriesToReconcile.push({
      amount: elt.dataset.amount,
      id: elt.dataset.id,
      type: elt.dataset.type,
    });
  }
};

const selectedToggler = (elt) => {
  elt.classList.toggle('selected');
};

const entries = document.querySelectorAll('.entry');

entries.forEach((entry) => {
  entry.addEventListener('mouseenter', () => {
    entry.classList.add('hovered');
  });
  entry.addEventListener('mouseleave', () => {
    entry.classList.remove('hovered');
  });
  entry.addEventListener('click', () => {
    entryClickHandler(entry);
    selectedToggler(entry);
  });
});

executeButton.addEventListener('click', () => {
  console.log(entriesToReconcile);
  renderReconciledEntry(entriesToReconcile);
});
