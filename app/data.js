// data.js — the Alvarez household's money: income, budgets, goals and
// every transaction from 1 September to 26 November 2026.
// All figures are fictional, written for this demo household.

const HOUSEHOLD = {
  name: 'The Alvarez Household',
  members: 'Maya & Daniel Alvarez, and Leo (age 7)',
  home: 'Maple Street, Portland, OR',
  currency: 'USD',
  months: ['2026-09', '2026-10', '2026-11'],
  currentMonth: '2026-11',
};

// Monthly take-home pay, broken down by source.
const INCOME_SOURCES = [
  { source: 'Maya — school district salary', amount: 3840 },
  { source: 'Daniel — logistics coordinator salary', amount: 2410 },
  { source: 'Daniel — weekend freelance driving', amount: 420 },
  { source: 'Interest & cashback', amount: 180 },
];

// Category budgets are monthly. `color` is the chart colour for the category.
const CATEGORIES = [
  { id: 'housing', label: 'Housing', budget: 1850, color: '#2f6f6a' },
  { id: 'groceries', label: 'Groceries', budget: 720, color: '#7a9e4b' },
  { id: 'dining', label: 'Dining out', budget: 260, color: '#d97b4f' },
  { id: 'transport', label: 'Transport', budget: 340, color: '#4f7fb8' },
  { id: 'utilities', label: 'Utilities', budget: 310, color: '#8a6fb8' },
  { id: 'health', label: 'Health', budget: 220, color: '#c05a7e' },
  { id: 'childcare', label: 'Childcare', budget: 480, color: '#b8912f' },
  { id: 'entertainment', label: 'Entertainment', budget: 150, color: '#5aa3a0' },
  { id: 'shopping', label: 'Shopping', budget: 280, color: '#9c6b4f' },
  { id: 'subscriptions', label: 'Subscriptions', budget: 85, color: '#6b7c93' },
  { id: 'other', label: 'Other', budget: 120, color: '#a3a3a3' },
];

// Savings goals. `saved` is what the household has put aside so far.
const SAVINGS_GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 10000, saved: 6400, note: 'Six months of essentials, kept in a high-yield savings account.' },
  { id: 'vacation', name: 'Summer road trip', target: 3500, saved: 1850, note: 'Two weeks down the Oregon coast next July — gas, motels and ice cream.' },
  { id: 'car', name: 'Next car down payment', target: 8000, saved: 2300, note: 'The 2014 Civic is on its last legs. Target: a used RAV4.' },
  { id: 'renovation', name: 'Kitchen refresh', target: 5000, saved: 900, note: 'New countertops and a dishwasher that does not leak.' },
];

// Transactions, compact: [date, merchant, category, amount, kind].
// kind is 'expense' or 'income'. Amounts are dollars.
const RAW_TRANSACTIONS = [
  // ---- September 2026 ----
  ['2026-09-01', 'Maple Street Rent', 'housing', 1850, 'expense'],
  ['2026-09-01', 'Maya — school district salary', 'income', 1920, 'income'],
  ['2026-09-02', 'Fred Meyer', 'groceries', 132.40, 'expense'],
  ['2026-09-03', 'Portland General Electric', 'utilities', 96.20, 'expense'],
  ['2026-09-04', 'Shell — Burnside', 'transport', 41.80, 'expense'],
  ['2026-09-05', 'Chipotle', 'dining', 27.45, 'expense'],
  ['2026-09-06', 'New Seasons Market', 'groceries', 88.15, 'expense'],
  ['2026-09-07', 'Bright Horizons After-School', 'childcare', 120, 'expense'],
  ['2026-09-08', 'Netflix', 'subscriptions', 15.49, 'expense'],
  ['2026-09-09', 'CVS Pharmacy', 'health', 34.60, 'expense'],
  ['2026-09-10', 'Trader Joe\u2019s', 'groceries', 96.70, 'expense'],
  ['2026-09-11', 'Daniel — logistics salary', 'income', 1205, 'income'],
  ['2026-09-12', 'Starbucks', 'dining', 12.30, 'expense'],
  ['2026-09-13', 'Costco', 'groceries', 214.55, 'expense'],
  ['2026-09-14', 'Chevron', 'transport', 38.90, 'expense'],
  ['2026-09-15', 'Maya — school district salary', 'income', 1920, 'income'],
  ['2026-09-15', 'Comcast Internet', 'utilities', 79.99, 'expense'],
  ['2026-09-16', 'Amazon', 'shopping', 46.20, 'expense'],
  ['2026-09-17', 'Portland Parks swim lessons', 'childcare', 85, 'expense'],
  ['2026-09-18', 'Olive Garden', 'dining', 58.40, 'expense'],
  ['2026-09-19', 'Fred Meyer', 'groceries', 118.25, 'expense'],
  ['2026-09-20', 'Uber', 'transport', 18.75, 'expense'],
  ['2026-09-21', 'Spotify', 'subscriptions', 11.99, 'expense'],
  ['2026-09-22', 'Kaiser Permanente copay', 'health', 45, 'expense'],
  ['2026-09-23', 'Target', 'shopping', 72.10, 'expense'],
  ['2026-09-24', 'City of Portland water', 'utilities', 64.30, 'expense'],
  ['2026-09-25', 'Daniel — logistics salary', 'income', 1205, 'income'],
  ['2026-09-25', 'DoorDash — Thai Basil', 'dining', 34.80, 'expense'],
  ['2026-09-26', 'New Seasons Market', 'groceries', 104.60, 'expense'],
  ['2026-09-27', 'AMC Theatres', 'entertainment', 32, 'expense'],
  ['2026-09-28', 'Shell — Burnside', 'transport', 44.10, 'expense'],
  ['2026-09-28', 'Freelance driving payout', 'income', 210, 'income'],
  ['2026-09-29', 'Bright Horizons After-School', 'childcare', 120, 'expense'],
  ['2026-09-30', 'Trader Joe\u2019s', 'groceries', 91.45, 'expense'],
  ['2026-09-30', 'Cashback — Chase', 'income', 62, 'income'],
  // ---- October 2026 ----
  ['2026-10-01', 'Maple Street Rent', 'housing', 1850, 'expense'],
  ['2026-10-01', 'Maya — school district salary', 'income', 1920, 'income'],
  ['2026-10-02', 'Fred Meyer', 'groceries', 141.80, 'expense'],
  ['2026-10-03', 'Portland General Electric', 'utilities', 88.45, 'expense'],
  ['2026-10-05', 'Shell — Burnside', 'transport', 39.60, 'expense'],
  ['2026-10-06', 'Chipotle', 'dining', 25.90, 'expense'],
  ['2026-10-07', 'New Seasons Market', 'groceries', 97.30, 'expense'],
  ['2026-10-08', 'Bright Horizons After-School', 'childcare', 120, 'expense'],
  ['2026-10-08', 'Netflix', 'subscriptions', 15.49, 'expense'],
  ['2026-10-09', 'Walgreens', 'health', 28.15, 'expense'],
  ['2026-10-10', 'Trader Joe\u2019s', 'groceries', 84.20, 'expense'],
  ['2026-10-11', 'Daniel — logistics salary', 'income', 1205, 'income'],
  ['2026-10-12', 'Starbucks', 'dining', 11.85, 'expense'],
  ['2026-10-13', 'Costco', 'groceries', 198.40, 'expense'],
  ['2026-10-14', 'Chevron', 'transport', 42.30, 'expense'],
  ['2026-10-15', 'Maya — school district salary', 'income', 1920, 'income'],
  ['2026-10-15', 'Comcast Internet', 'utilities', 79.99, 'expense'],
  ['2026-10-16', 'Amazon', 'shopping', 58.90, 'expense'],
  ['2026-10-17', 'Portland Parks swim lessons', 'childcare', 85, 'expense'],
  ['2026-10-18', 'Pizza Schmizza', 'dining', 41.25, 'expense'],
  ['2026-10-19', 'Fred Meyer', 'groceries', 126.55, 'expense'],
  ['2026-10-20', 'Lyft', 'transport', 22.40, 'expense'],
  ['2026-10-21', 'Spotify', 'subscriptions', 11.99, 'expense'],
  ['2026-10-22', 'Kaiser Permanente copay', 'health', 45, 'expense'],
  ['2026-10-23', 'Target', 'shopping', 64.75, 'expense'],
  ['2026-10-24', 'City of Portland water', 'utilities', 61.10, 'expense'],
  ['2026-10-25', 'Daniel — logistics salary', 'income', 1205, 'income'],
  ['2026-10-25', 'DoorDash — Thai Basil', 'dining', 31.60, 'expense'],
  ['2026-10-26', 'New Seasons Market', 'groceries', 112.90, 'expense'],
  ['2026-10-27', 'Powell\u2019s Books', 'entertainment', 27.50, 'expense'],
  ['2026-10-28', 'Shell — Burnside', 'transport', 46.20, 'expense'],
  ['2026-10-28', 'Freelance driving payout', 'income', 215, 'income'],
  ['2026-10-29', 'Bright Horizons After-School', 'childcare', 120, 'expense'],
  ['2026-10-30', 'Trader Joe\u2019s', 'groceries', 89.60, 'expense'],
  ['2026-10-30', 'Halloween costumes — Target', 'shopping', 48.30, 'expense'],
  ['2026-10-31', 'Cashback — Chase', 'income', 58, 'income'],
  // ---- November 2026 (through the 26th) ----
  ['2026-11-01', 'Maple Street Rent', 'housing', 1850, 'expense'],
  ['2026-11-01', 'Maya — school district salary', 'income', 1920, 'income'],
  ['2026-11-02', 'Fred Meyer', 'groceries', 128.90, 'expense'],
  ['2026-11-03', 'Portland General Electric', 'utilities', 91.75, 'expense'],
  ['2026-11-04', 'Shell — Burnside', 'transport', 40.25, 'expense'],
  ['2026-11-05', 'Chipotle', 'dining', 26.80, 'expense'],
  ['2026-11-06', 'New Seasons Market', 'groceries', 93.45, 'expense'],
  ['2026-11-07', 'Bright Horizons After-School', 'childcare', 120, 'expense'],
  ['2026-11-08', 'Netflix', 'subscriptions', 15.49, 'expense'],
  ['2026-11-09', 'CVS Pharmacy', 'health', 41.20, 'expense'],
  ['2026-11-10', 'Trader Joe\u2019s', 'groceries', 87.60, 'expense'],
  ['2026-11-11', 'Daniel — logistics salary', 'income', 1205, 'income'],
  ['2026-11-12', 'Starbucks', 'dining', 13.10, 'expense'],
  ['2026-11-13', 'Costco', 'groceries', 203.15, 'expense'],
  ['2026-11-14', 'Chevron', 'transport', 43.55, 'expense'],
  ['2026-11-15', 'Maya — school district salary', 'income', 1920, 'income'],
  ['2026-11-15', 'Comcast Internet', 'utilities', 79.99, 'expense'],
  ['2026-11-16', 'Amazon', 'shopping', 52.40, 'expense'],
  ['2026-11-17', 'Portland Parks swim lessons', 'childcare', 85, 'expense'],
  ['2026-11-18', 'Olive Garden', 'dining', 62.15, 'expense'],
  ['2026-11-19', 'Fred Meyer', 'groceries', 121.30, 'expense'],
  ['2026-11-20', 'Freelance driving payout', 'income', 210, 'income'],
  ['2026-11-20', 'Uber', 'transport', 19.90, 'expense'],
  ['2026-11-21', 'Spotify', 'subscriptions', 11.99, 'expense'],
  ['2026-11-22', 'Kaiser Permanente copay', 'health', 45, 'expense'],
  ['2026-11-23', 'Target', 'shopping', 69.85, 'expense'],
  ['2026-11-24', 'City of Portland water', 'utilities', 63.40, 'expense'],
  ['2026-11-25', 'Daniel — logistics salary', 'income', 1205, 'income'],
  ['2026-11-25', 'DoorDash — Thai Basil', 'dining', 36.20, 'expense'],
  ['2026-11-26', 'New Seasons Market', 'groceries', 98.75, 'expense'],
  ['2026-11-26', 'Freelance driving payout', 'income', 205, 'income'],
  ['2026-11-26', 'Cashback — Chase', 'income', 95, 'income'],
];

// Expand the compact rows into transaction objects with stable ids.
function expandTransactions(rows) {
  return rows.map(function (row, index) {
    return {
      id: 'tx-' + (index + 1),
      date: row[0],
      merchant: row[1],
      category: row[2],
      amount: row[3],
      kind: row[4],
    };
  });
}

const TRANSACTIONS = expandTransactions(RAW_TRANSACTIONS);

// Look up a category by id; unknown ids fall back to "Other".
function categoryById(id) {
  for (const category of CATEGORIES) {
    if (category.id === id) return category;
  }
  return CATEGORIES[CATEGORIES.length - 1];
}

function monthLabel(month) {
  const parts = month.split('-');
  const names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return names[Number(parts[1]) - 1] + ' ' + parts[0];
}

function money(amount) {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
