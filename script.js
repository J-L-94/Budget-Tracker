const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');
const budgetInput = document.getElementById('budget');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = parseFloat(localStorage.getItem('budget')) || 0;
budgetInput.value = budget || '';

function updateList() {
  list.innerHTML = '';
  let income = 0;
  let spending = 0;

  expenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${exp.type === 'income' ? '+' : '-'} ${exp.name}: $${exp.amount.toFixed(2)}</span>
      <button onclick="deleteItem(${index})">❌</button>
    `;
    list.appendChild(li);

    if (exp.type === 'income') {
      income += exp.amount;
    } else {
      spending += exp.amount;
    }
  });

  const totalBalance = income - spending;
  totalDisplay.textContent = totalBalance.toFixed(2);

  const remaining = budget - spending;
  document.getElementById('remaining').textContent = `Remaining this week: $${remaining.toFixed(2)}`;

  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function deleteItem(index) {
  expenses.splice(index, 1);
  updateList();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  console.log(`Adding ${name} with amount: $${amount} as ${type}`);

  if (name && !isNaN(amount)) {
    expenses.push({ name, amount, type, date: new Date().toISOString() });
    updateList();
    form.reset();
  } else {
    console.error('Please make sure all fields are filled correctly.');
  }
});

budgetInput.addEventListener('change', function () {
  budget = parseFloat(budgetInput.value);
  localStorage.setItem('budget', budget);
  updateList();
});

updateList();
