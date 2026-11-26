// views.js — routing and rendering for the household budget site.
// State lives in memory: `state.transactions`, `state.budgets` and
// `state.goals` start from data.js and every control updates them, then
// re-renders the current page so the change is visible at once.

const state = {
  transactions: TRANSACTIONS.slice(),
  budgets: {},
  goals: SAVINGS_GOALS.map(function (goal) { return Object.assign({}, goal); }),
  filterCategory: 'all',
  filterMonth: HOUSEHOLD.currentMonth,
};

CATEGORIES.forEach(function (category) {
  state.budgets[category.id] = category.budget;
});

const PAGES = [
  { route: 'overview', label: 'Overview', render: renderOverview },
  { route: 'transactions', label: 'Transactions', render: renderTransactions },
  { route: 'budget', label: 'Budget planner', render: renderBudget },
  { route: 'goals', label: 'Savings goals', render: renderGoals },
  { route: 'reports', label: 'Reports', render: renderReports },
];

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const known = PAGES.some(function (page) { return page.route === hash; });
  return known ? hash : 'overview';
}

function navigate(route) {
  window.location.hash = '#/' + route;
}

function renderApp() {
  const route = currentRoute();
  const nav = document.getElementById('main-nav');
  nav.innerHTML = PAGES.map(function (page) {
    const active = page.route === route ? ' class="active" aria-current="page"' : '';
    return '<a href="#/' + page.route + '"' + active + '>' + page.label + '</a>';
  }).join('');
  const page = PAGES.find(function (p) { return p.route === route; });
  document.getElementById('page').innerHTML = page.render();
  page.render.afterRender && page.render.afterRender();
}

window.addEventListener('hashchange', renderApp);

// ---- Shared helpers ----

function transactionsForMonth(month) {
  return state.transactions.filter(function (tx) { return tx.date.slice(0, 7) === month; });
}

function monthTotals(month) {
  const rows = transactionsForMonth(month);
  let income = 0;
  let spending = 0;
  rows.forEach(function (tx) {
    if (tx.kind === 'income') income += tx.amount;
    else spending += tx.amount;
  });
  return { income: income, spending: spending, saved: income - spending };
}

function spendingByCategory(month) {
  const totals = {};
  transactionsForMonth(month).forEach(function (tx) {
    if (tx.kind !== 'expense') return;
    totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
  });
  return totals;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function transactionRow(tx) {
  const category = tx.kind === 'income' ? { label: 'Income' } : categoryById(tx.category);
  const sign = tx.kind === 'income' ? '+' : '−';
  const cls = tx.kind === 'income' ? 'income' : 'expense';
  return '<tr><td>' + tx.date + '</td><td>' + escapeHtml(tx.merchant) + '</td>' +
    '<td><span class="tag">' + category.label + '</span></td>' +
    '<td class="amount ' + cls + '">' + sign + money(tx.amount) + '</td>' +
    '<td><button class="danger" data-delete="' + tx.id + '" type="button">Delete</button></td></tr>';
}

function bindDeleteButtons(root) {
  root.querySelectorAll('[data-delete]').forEach(function (button) {
    button.addEventListener('click', function () {
      state.transactions = state.transactions.filter(function (tx) { return tx.id !== button.dataset.delete; });
      renderApp();
    });
  });
}

function shortMonth(month) {
  return monthLabel(month).split(' ')[0].slice(0, 3);
}

// ---- Overview ----

function renderOverview() {
  const month = HOUSEHOLD.currentMonth;
  const totals = monthTotals(month);
  const byCategory = spendingByCategory(month);
  const recent = state.transactions.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 8);
  const overBudget = CATEGORIES.filter(function (category) {
    return (byCategory[category.id] || 0) > state.budgets[category.id];
  });
  const totalBudget = CATEGORIES.reduce(function (sum, c) { return sum + state.budgets[c.id]; }, 0);
  const savedPct = totals.income > 0 ? Math.round((totals.saved / totals.income) * 100) : 0;

  const cards = '' +
    '<div class="card summary-card accent"><div class="label">Income · ' + monthLabel(month) + '</div>' +
    '<div class="value">' + money(totals.income) + '</div>' +
    '<div class="sub">Paychecks, freelance driving &amp; cashback</div></div>' +
    '<div class="card summary-card"><div class="label">Spending · ' + monthLabel(month) + '</div>' +
    '<div class="value">' + money(totals.spending) + '</div>' +
    '<div class="sub">Of a ' + money(totalBudget) + ' monthly plan</div></div>' +
    '<div class="card summary-card"><div class="label">Saved this month</div>' +
    '<div class="value good">' + money(totals.saved) + '</div>' +
    '<div class="sub">' + savedPct + '% of income kept</div></div>' +
    '<div class="card summary-card"><div class="label">Over budget</div>' +
    '<div class="value ' + (overBudget.length ? 'warn' : 'good') + '">' + overBudget.length + ' categor' + (overBudget.length === 1 ? 'y' : 'ies') + '</div>' +
    '<div class="sub">' + (overBudget.length ? overBudget.map(function (c) { return c.label; }).join(', ') : 'Everything on track') + '</div></div>';

  const slices = CATEGORIES.map(function (category) {
    return { label: category.label, value: byCategory[category.id] || 0, color: category.color };
  }).filter(function (slice) { return slice.value > 0; });
  const legend = slices.map(function (slice) {
    return '<li><span class="swatch" style="background:' + slice.color + '"></span>' + slice.label + ' · ' + money(slice.value) + '</li>';
  }).join('');

  const goalRows = state.goals.slice(0, 3).map(function (goal) {
    const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
    return '<div class="bar-row"><div class="bar-head"><strong>' + escapeHtml(goal.name) + '</strong><span>' + money(goal.saved) + ' of ' + money(goal.target) + ' · ' + pct + '%</span></div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';
  }).join('');

  return '' +
    '<div class="page-head"><h1>Good morning, Alvarez household</h1>' +
    '<p>November is nearly done: ' + money(totals.saved) + ' set aside so far on ' + money(totals.income) +
    ' of income. Here is where the month stands.</p></div>' +
    '<div class="grid cards">' + cards + '</div>' +
    '<div class="grid two" style="margin-top:1rem">' +
      '<section class="card"><h2>Where November\u2019s money went</h2>' +
        '<div class="chart-wrap"><canvas id="category-donut" aria-label="Donut chart of November spending by category"></canvas></div>' +
        '<ul class="legend">' + legend + '</ul></section>' +
      '<section class="card"><h2>Savings goals</h2>' + goalRows +
        '<p><a href="#/goals">See all goals and add money &rarr;</a></p>' +
        '<div class="note">Tip: the household moves $500 to savings on the 1st of every month, before anything else is spent.</div></section>' +
    '</div>' +
    '<section class="card" style="margin-top:1rem"><h2>Recent transactions</h2>' +
      '<table><thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th class="amount">Amount</th><th></th></tr></thead><tbody>' +
      recent.map(transactionRow).join('') + '</tbody></table>' +
      '<p style="margin-top:0.75rem"><a href="#/transactions">See the full ledger &rarr;</a></p></section>';
}
renderOverview.afterRender = function () {
  const byCategory = spendingByCategory(HOUSEHOLD.currentMonth);
  const slices = CATEGORIES.map(function (category) {
    return { label: category.label, value: byCategory[category.id] || 0, color: category.color };
  }).filter(function (slice) { return slice.value > 0; });
  const canvas = document.getElementById('category-donut');
  if (canvas) {
    drawDonut(canvas, slices, 'spent in Nov', money(monthTotals(HOUSEHOLD.currentMonth).spending));
  }
  bindDeleteButtons(document.getElementById('page'));
};

// ---- Transactions ledger ----

function renderTransactions() {
  const categoryOptions = ['<option value="all">All categories</option>'].concat(
    CATEGORIES.map(function (category) {
      const selected = state.filterCategory === category.id ? ' selected' : '';
      return '<option value="' + category.id + '"' + selected + '>' + category.label + '</option>';
    })
  ).join('');
  const monthOptions = HOUSEHOLD.months.map(function (month) {
    const selected = state.filterMonth === month ? ' selected' : '';
    return '<option value="' + month + '"' + selected + '>' + monthLabel(month) + '</option>';
  }).join('');

  let rows = state.transactions.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
  if (state.filterMonth !== 'all') rows = rows.filter(function (tx) { return tx.date.slice(0, 7) === state.filterMonth; });
  if (state.filterCategory !== 'all') rows = rows.filter(function (tx) { return tx.category === state.filterCategory; });
  const shown = rows.reduce(function (sum, tx) { return sum + (tx.kind === 'income' ? tx.amount : -tx.amount); }, 0);

  return '' +
    '<div class="page-head"><h1>Transactions</h1>' +
    '<p>Every dollar in and out, September through November 2026. Filter the list, add a transaction you forgot, or delete a mistake.</p></div>' +
    '<section class="card"><div class="filter-row">' +
      '<div class="field"><label for="filter-month">Month</label><select id="filter-month"><option value="all">All months</option>' + monthOptions + '</select></div>' +
      '<div class="field"><label for="filter-category">Category</label><select id="filter-category">' + categoryOptions + '</select></div>' +
    '</div>' +
    '<p><strong>' + rows.length + ' transactions</strong> · net ' + money(Math.abs(shown)) + (shown < 0 ? ' out' : ' in') + ' in this view</p>' +
    '<table><thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th class="amount">Amount</th><th></th></tr></thead><tbody>' +
    (rows.length ? rows.map(transactionRow).join('') : '<tr><td colspan="5" class="empty">Nothing matches these filters yet.</td></tr>') +
    '</tbody></table></section>' +
    '<section class="card" style="margin-top:1rem"><h2>Add a transaction</h2>' +
    '<form id="add-transaction"><div class="form-grid">' +
      '<div class="field"><label for="tx-date">Date</label><input id="tx-date" type="date" value="2026-11-26" required></div>' +
      '<div class="field"><label for="tx-merchant">Merchant</label><input id="tx-merchant" type="text" placeholder="e.g. Fred Meyer" required></div>' +
      '<div class="field"><label for="tx-category">Category</label><select id="tx-category">' +
        CATEGORIES.map(function (c) { return '<option value="' + c.id + '">' + c.label + '</option>'; }).join('') +
        '<option value="income">Income</option></select></div>' +
      '<div class="field"><label for="tx-amount">Amount ($)</label><input id="tx-amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>' +
      '<div class="field"><label for="tx-kind">Type</label><select id="tx-kind"><option value="expense">Expense</option><option value="income">Income</option></select></div>' +
    '</div><p style="margin-top:0.9rem"><button type="submit">Add transaction</button></p></form></section>';
}
renderTransactions.afterRender = function () {
  const page = document.getElementById('page');
  const monthSelect = document.getElementById('filter-month');
  const categorySelect = document.getElementById('filter-category');
  monthSelect.addEventListener('change', function () { state.filterMonth = monthSelect.value; renderApp(); });
  categorySelect.addEventListener('change', function () { state.filterCategory = categorySelect.value; renderApp(); });
  document.getElementById('add-transaction').addEventListener('submit', function (event) {
    event.preventDefault();
    const kind = document.getElementById('tx-kind').value;
    const category = kind === 'income' ? 'income' : document.getElementById('tx-category').value;
    const amount = Math.round(Number(document.getElementById('tx-amount').value) * 100) / 100;
    if (!amount || amount <= 0) return;
    state.transactions.push({
      id: 'tx-user-' + Date.now(),
      date: document.getElementById('tx-date').value || '2026-11-26',
      merchant: document.getElementById('tx-merchant').value.trim(),
      category: category,
      amount: amount,
      kind: kind,
    });
    renderApp();
  });
  bindDeleteButtons(page);
};

// ---- Budget planner ----

function renderBudget() {
  const month = HOUSEHOLD.currentMonth;
  const byCategory = spendingByCategory(month);
  const totalBudget = CATEGORIES.reduce(function (sum, c) { return sum + state.budgets[c.id]; }, 0);
  const totalSpent = Object.keys(byCategory).reduce(function (sum, key) { return sum + byCategory[key]; }, 0);

  const rows = CATEGORIES.map(function (category) {
    const spent = byCategory[category.id] || 0;
    const budget = state.budgets[category.id];
    const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
    const fillClass = spent > budget ? 'over' : pct >= 80 ? 'near' : '';
    const remaining = budget - spent;
    return '<div class="bar-row"><div class="bar-head"><strong>' + category.label + '</strong>' +
      '<span>' + money(spent) + ' of ' + money(budget) + ' · ' + pct + '% · ' +
      (remaining >= 0 ? money(remaining) + ' left' : money(-remaining) + ' over') + '</span></div>' +
      '<div class="bar-track"><div class="bar-fill ' + fillClass + '" style="width:' + Math.min(100, pct) + '%"></div></div>' +
      '<div class="inline-form"><label for="budget-' + category.id + '" style="margin:0">Monthly budget</label>' +
      '<input id="budget-' + category.id + '" type="number" min="0" step="5" value="' + budget + '" data-budget="' + category.id + '">' +
      '<button type="button" class="ghost" data-save-budget="' + category.id + '">Save</button></div></div>';
  }).join('');

  return '' +
    '<div class="page-head"><h1>Budget planner — ' + monthLabel(month) + '</h1>' +
    '<p>Set a monthly limit for each category and watch spending against it. ' +
    money(totalSpent) + ' spent of a ' + money(totalBudget) + ' plan, with ' +
    money(totalBudget - totalSpent) + ' of the plan still unspent.</p></div>' +
    '<section class="card">' + rows + '</section>' +
    '<div class="note" style="margin-top:1rem">The 50/30/20 rule of thumb: about half of take-home pay to needs, ' +
    'a third to wants, a fifth to savings. This household runs about 62% needs, 18% wants and 20% savings in November.</div>';
}
renderBudget.afterRender = function () {
  document.querySelectorAll('[data-save-budget]').forEach(function (button) {
    button.addEventListener('click', function () {
      const id = button.dataset.saveBudget;
      const input = document.getElementById('budget-' + id);
      const value = Math.max(0, Math.round(Number(input.value) || 0));
      state.budgets[id] = value;
      renderApp();
    });
  });
};

// ---- Savings goals ----

function renderGoals() {
  const totalSaved = state.goals.reduce(function (sum, g) { return sum + g.saved; }, 0);
  const totalTarget = state.goals.reduce(function (sum, g) { return sum + g.target; }, 0);
  const cards = state.goals.map(function (goal) {
    const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
    const remaining = Math.max(0, goal.target - goal.saved);
    return '<article class="card goal-card"><h3>' + escapeHtml(goal.name) + '</h3>' +
      '<p>' + escapeHtml(goal.note) + '</p>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="goal-amounts"><strong>' + money(goal.saved) + ' saved</strong><span>' + pct + '% · ' + money(remaining) + ' to go</span></div>' +
      '<form class="inline-form" data-goal="' + goal.id + '">' +
      '<label for="add-' + goal.id + '" style="position:absolute;left:-9999px">Add to ' + escapeHtml(goal.name) + '</label>' +
      '<input id="add-' + goal.id + '" type="number" min="1" step="1" placeholder="Add $ amount">' +
      '<button type="submit">Add money</button></form></article>';
  }).join('');

  return '' +
    '<div class="page-head"><h1>Savings goals</h1>' +
    '<p>' + money(totalSaved) + ' saved across ' + state.goals.length + ' goals, out of ' + money(totalTarget) +
    ' in total. Add money to a goal and watch its bar move.</p></div>' +
    '<div class="grid two">' + cards + '</div>' +
    '<div class="note" style="margin-top:1rem">Goals are funded in order: the emergency fund first, then the car, ' +
    'then the trip and the kitchen. The household keeps goal money in a separate high-yield savings account so it is never spent by accident.</div>';
}
renderGoals.afterRender = function () {
  document.querySelectorAll('form[data-goal]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const goal = state.goals.find(function (g) { return g.id === form.dataset.goal; });
      const input = form.querySelector('input');
      const amount = Math.round(Number(input.value) || 0);
      if (!goal || amount <= 0) return;
      goal.saved = Math.min(goal.target, goal.saved + amount);
      renderApp();
    });
  });
};

// ---- Reports ----

function renderReports() {
  const months = HOUSEHOLD.months.map(function (month) {
    const totals = monthTotals(month);
    return { label: shortMonth(month) + ' ’26', income: totals.income, spending: totals.spending };
  });
  const byCategory = spendingByCategory(HOUSEHOLD.currentMonth);
  const ranked = CATEGORIES.map(function (category) {
    return { label: category.label, value: byCategory[category.id] || 0, color: category.color };
  }).filter(function (item) { return item.value > 0; })
    .sort(function (a, b) { return b.value - a.value; });
  const top = ranked[0];
  const totalSpent = ranked.reduce(function (sum, item) { return sum + item.value; }, 0);

  const merchantTotals = {};
  state.transactions.forEach(function (tx) {
    if (tx.kind !== 'expense') return;
    merchantTotals[tx.merchant] = (merchantTotals[tx.merchant] || 0) + tx.amount;
  });
  const topMerchants = Object.keys(merchantTotals)
    .map(function (name) { return { name: name, total: merchantTotals[name] }; })
    .sort(function (a, b) { return b.total - a.total; })
    .slice(0, 5);

  const shareRows = ranked.map(function (item) {
    const pct = totalSpent > 0 ? Math.round((item.value / totalSpent) * 100) : 0;
    return '<div class="bar-row"><div class="bar-head"><strong>' + item.label + '</strong><span>' + money(item.value) + ' · ' + pct + '%</span></div>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + item.color + '"></div></div></div>';
  }).join('');

  const avgSaved = HOUSEHOLD.months.reduce(function (sum, month) { return sum + monthTotals(month).saved; }, 0) / HOUSEHOLD.months.length;

  return '' +
    '<div class="page-head"><h1>Reports</h1>' +
    '<p>Three months at a glance: income against spending, where the money goes, and who gets the most of it.</p></div>' +
    '<section class="card"><h2>Income vs. spending — Sep to Nov 2026</h2>' +
      '<div class="chart-wrap"><canvas id="monthly-bars" aria-label="Bar chart of income and spending for September, October and November 2026"></canvas></div></section>' +
    '<div class="grid two" style="margin-top:1rem">' +
      '<section class="card"><h2>November by category</h2>' + shareRows + '</section>' +
      '<section class="card"><h2>Top merchants — all three months</h2>' +
        '<table><thead><tr><th>Merchant</th><th class="amount">Total spent</th></tr></thead><tbody>' +
        topMerchants.map(function (m) { return '<tr><td>' + escapeHtml(m.name) + '</td><td class="amount">' + money(m.total) + '</td></tr>'; }).join('') +
        '</tbody></table>' +
        '<div class="callout" style="margin-top:1rem"><strong>What stands out</strong><br>' +
        top.label + ' is the biggest slice of November at ' + money(top.value) + ', and the household saves about ' +
        money(Math.round(avgSaved)) + ' a month on average — enough to fully fund the emergency goal by next spring.</div>' +
      '</section>' +
    '</div>';
}
renderReports.afterRender = function () {
  const months = HOUSEHOLD.months.map(function (month) {
    const totals = monthTotals(month);
    return { label: shortMonth(month) + ' ’26', income: totals.income, spending: totals.spending };
  });
  const canvas = document.getElementById('monthly-bars');
  if (canvas) drawMonthlyBars(canvas, months);
};

document.addEventListener('DOMContentLoaded', renderApp);
