/**
 * Storage Service - Handles all localStorage operations
 * This service provides a clean interface for data persistence
 * and can be easily replaced with a real database later
 */

class StorageService {
  constructor() {
    this.keys = {
      TRANSACTIONS: 'finance_tracker_transactions',
      BUDGETS: 'finance_tracker_budgets',
      SAVINGS_GOALS: 'finance_tracker_savings_goals',
      USER_PREFERENCES: 'finance_tracker_preferences',
      CATEGORIES: 'finance_tracker_categories',
      RECURRING_TRANSACTIONS: 'finance_tracker_recurring'
    };
  }

  // Generic storage methods
  setItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  // Transaction methods
  getTransactions() {
    return this.getItem(this.keys.TRANSACTIONS, []);
  }

  saveTransactions(transactions) {
    return this.setItem(this.keys.TRANSACTIONS, transactions);
  }

  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now() + Math.random(), // Better ID generation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  updateTransaction(id, updates) {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveTransactions(transactions);
      return transactions[index];
    }
    return null;
  }

  deleteTransaction(id) {
    const transactions = this.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== id);
    this.saveTransactions(filteredTransactions);
    return filteredTransactions.length < transactions.length;
  }

  // Budget methods
  getBudgets() {
    return this.getItem(this.keys.BUDGETS, []);
  }

  saveBudgets(budgets) {
    return this.setItem(this.keys.BUDGETS, budgets);
  }

  addBudget(budget) {
    const budgets = this.getBudgets();
    const newBudget = {
      ...budget,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    budgets.push(newBudget);
    this.saveBudgets(budgets);
    return newBudget;
  }

  updateBudget(id, updates) {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      budgets[index] = {
        ...budgets[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveBudgets(budgets);
      return budgets[index];
    }
    return null;
  }

  deleteBudget(id) {
    const budgets = this.getBudgets();
    const filteredBudgets = budgets.filter(b => b.id !== id);
    this.saveBudgets(filteredBudgets);
    return filteredBudgets.length < budgets.length;
  }

  // Savings Goals methods
  getSavingsGoals() {
    return this.getItem(this.keys.SAVINGS_GOALS, []);
  }

  saveSavingsGoals(goals) {
    return this.setItem(this.keys.SAVINGS_GOALS, goals);
  }

  addSavingsGoal(goal) {
    const goals = this.getSavingsGoals();
    const newGoal = {
      ...goal,
      id: Date.now() + Math.random(),
      currentAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    goals.push(newGoal);
    this.saveSavingsGoals(goals);
    return newGoal;
  }

  updateSavingsGoal(id, updates) {
    const goals = this.getSavingsGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index !== -1) {
      goals[index] = {
        ...goals[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveSavingsGoals(goals);
      return goals[index];
    }
    return null;
  }

  deleteSavingsGoal(id) {
    const goals = this.getSavingsGoals();
    const filteredGoals = goals.filter(g => g.id !== id);
    this.saveSavingsGoals(filteredGoals);
    return filteredGoals.length < goals.length;
  }

  // User Preferences methods
  getUserPreferences() {
    return this.getItem(this.keys.USER_PREFERENCES, {
      darkMode: false,
      currency: 'USD',
      language: 'en',
      notifications: true,
      defaultCategory: 'other'
    });
  }

  saveUserPreferences(preferences) {
    return this.setItem(this.keys.USER_PREFERENCES, preferences);
  }

  updateUserPreference(key, value) {
    const preferences = this.getUserPreferences();
    preferences[key] = value;
    return this.saveUserPreferences(preferences);
  }

  // Categories methods
  getCategories() {
    return this.getItem(this.keys.CATEGORIES, [
      { id: 'food', name: 'Food & Dining', icon: '🍽️', type: 'expense' },
      { id: 'transport', name: 'Transportation', icon: '🚗', type: 'expense' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️', type: 'expense' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬', type: 'expense' },
      { id: 'bills', name: 'Bills & Utilities', icon: '📄', type: 'expense' },
      { id: 'health', name: 'Healthcare', icon: '🏥', type: 'expense' },
      { id: 'education', name: 'Education', icon: '📚', type: 'expense' },
      { id: 'salary', name: 'Salary', icon: '💼', type: 'income' },
      { id: 'freelance', name: 'Freelance', icon: '💻', type: 'income' },
      { id: 'investment', name: 'Investment', icon: '📊', type: 'income' },
      { id: 'other', name: 'Other', icon: '📦', type: 'both' }
    ]);
  }

  saveCategories(categories) {
    return this.setItem(this.keys.CATEGORIES, categories);
  }

  addCategory(category) {
    const categories = this.getCategories();
    const newCategory = {
      ...category,
      id: category.id || category.name.toLowerCase().replace(/\s+/g, '_'),
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  // Recurring Transactions methods
  getRecurringTransactions() {
    return this.getItem(this.keys.RECURRING_TRANSACTIONS, []);
  }

  saveRecurringTransactions(recurring) {
    return this.setItem(this.keys.RECURRING_TRANSACTIONS, recurring);
  }

  addRecurringTransaction(transaction) {
    const recurring = this.getRecurringTransactions();
    const newRecurring = {
      ...transaction,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      lastExecuted: null,
      nextExecution: this.calculateNextExecution(transaction.frequency)
    };
    recurring.push(newRecurring);
    this.saveRecurringTransactions(recurring);
    return newRecurring;
  }

  calculateNextExecution(frequency) {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth.toISOString();
      case 'yearly':
        const nextYear = new Date(now);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear.toISOString();
      default:
        return null;
    }
  }

  // Analytics and Reports
  getTransactionsByDateRange(startDate, endDate) {
    const transactions = this.getTransactions();
    return transactions.filter(t => {
      const txnDate = new Date(t.date || t.createdAt);
      return txnDate >= new Date(startDate) && txnDate <= new Date(endDate);
    });
  }

  getTransactionsByCategory(category) {
    const transactions = this.getTransactions();
    return transactions.filter(t => t.category === category);
  }

  getMonthlyReport(year, month) {
    const transactions = this.getTransactionsByDateRange(
      new Date(year, month, 1),
      new Date(year, month + 1, 0)
    );

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });

    return {
      income,
      expenses,
      balance: income - expenses,
      categoryBreakdown,
      transactionCount: transactions.length,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0
    };
  }

  // Data Export/Import
  exportAllData() {
    return {
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      savingsGoals: this.getSavingsGoals(),
      preferences: this.getUserPreferences(),
      categories: this.getCategories(),
      recurringTransactions: this.getRecurringTransactions(),
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
  }

  importData(data) {
    try {
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.budgets) this.saveBudgets(data.budgets);
      if (data.savingsGoals) this.saveSavingsGoals(data.savingsGoals);
      if (data.preferences) this.saveUserPreferences(data.preferences);
      if (data.categories) this.saveCategories(data.categories);
      if (data.recurringTransactions) this.saveRecurringTransactions(data.recurringTransactions);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData() {
    Object.values(this.keys).forEach(key => {
      this.removeItem(key);
    });
  }
}

// Create and export a singleton instance
const storageService = new StorageService();
export default storageService;