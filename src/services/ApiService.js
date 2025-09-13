/**
 * API Service - Provides backend-like interface for data operations
 * This service simulates API calls and can be easily replaced with real HTTP requests
 */

import storageService from './StorageService';

class ApiService {
  constructor() {
    this.baseDelay = 100; // Simulate network delay
  }

  // Simulate async API calls
  async delay(ms = this.baseDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create standardized API response
  createResponse(data, success = true, message = '') {
    return {
      success,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  // Handle errors consistently
  handleError(error, operation = 'operation') {
    console.error(`Error during ${operation}:`, error);
    return this.createResponse(null, false, `Failed to ${operation}: ${error.message}`);
  }

  // Transaction API
  async getTransactions(filters = {}) {
    try {
      await this.delay();
      let transactions = storageService.getTransactions();

      // Apply filters
      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.startDate) {
        transactions = transactions.filter(t => new Date(t.date) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        transactions = transactions.filter(t => new Date(t.date) <= new Date(filters.endDate));
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        transactions = transactions.filter(t => 
          t.description.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

      return this.createResponse(transactions, true, 'Transactions retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'get transactions');
    }
  }

  async createTransaction(transactionData) {
    try {
      await this.delay();
      
      // Validate required fields
      if (!transactionData.description || !transactionData.amount) {
        return this.createResponse(null, false, 'Description and amount are required');
      }

      const transaction = storageService.addTransaction(transactionData);
      return this.createResponse(transaction, true, 'Transaction created successfully');
    } catch (error) {
      return this.handleError(error, 'create transaction');
    }
  }

  async updateTransaction(id, updates) {
    try {
      await this.delay();
      const transaction = storageService.updateTransaction(id, updates);
      
      if (!transaction) {
        return this.createResponse(null, false, 'Transaction not found');
      }

      return this.createResponse(transaction, true, 'Transaction updated successfully');
    } catch (error) {
      return this.handleError(error, 'update transaction');
    }
  }

  async deleteTransaction(id) {
    try {
      await this.delay();
      const success = storageService.deleteTransaction(id);
      
      if (!success) {
        return this.createResponse(null, false, 'Transaction not found');
      }

      return this.createResponse(null, true, 'Transaction deleted successfully');
    } catch (error) {
      return this.handleError(error, 'delete transaction');
    }
  }

  // Budget API
  async getBudgets() {
    try {
      await this.delay();
      const budgets = storageService.getBudgets();
      return this.createResponse(budgets, true, 'Budgets retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'get budgets');
    }
  }

  async createBudget(budgetData) {
    try {
      await this.delay();
      
      if (!budgetData.category || !budgetData.amount) {
        return this.createResponse(null, false, 'Category and amount are required');
      }

      const budget = storageService.addBudget(budgetData);
      return this.createResponse(budget, true, 'Budget created successfully');
    } catch (error) {
      return this.handleError(error, 'create budget');
    }
  }

  async updateBudget(id, updates) {
    try {
      await this.delay();
      const budget = storageService.updateBudget(id, updates);
      
      if (!budget) {
        return this.createResponse(null, false, 'Budget not found');
      }

      return this.createResponse(budget, true, 'Budget updated successfully');
    } catch (error) {
      return this.handleError(error, 'update budget');
    }
  }

  async deleteBudget(id) {
    try {
      await this.delay();
      const success = storageService.deleteBudget(id);
      
      if (!success) {
        return this.createResponse(null, false, 'Budget not found');
      }

      return this.createResponse(null, true, 'Budget deleted successfully');
    } catch (error) {
      return this.handleError(error, 'delete budget');
    }
  }

  // Savings Goals API
  async getSavingsGoals() {
    try {
      await this.delay();
      const goals = storageService.getSavingsGoals();
      return this.createResponse(goals, true, 'Savings goals retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'get savings goals');
    }
  }

  async createSavingsGoal(goalData) {
    try {
      await this.delay();
      
      if (!goalData.name || !goalData.targetAmount || !goalData.targetDate) {
        return this.createResponse(null, false, 'Name, target amount, and target date are required');
      }

      const goal = storageService.addSavingsGoal(goalData);
      return this.createResponse(goal, true, 'Savings goal created successfully');
    } catch (error) {
      return this.handleError(error, 'create savings goal');
    }
  }

  async updateSavingsGoal(id, updates) {
    try {
      await this.delay();
      const goal = storageService.updateSavingsGoal(id, updates);
      
      if (!goal) {
        return this.createResponse(null, false, 'Savings goal not found');
      }

      return this.createResponse(goal, true, 'Savings goal updated successfully');
    } catch (error) {
      return this.handleError(error, 'update savings goal');
    }
  }

  async deleteSavingsGoal(id) {
    try {
      await this.delay();
      const success = storageService.deleteSavingsGoal(id);
      
      if (!success) {
        return this.createResponse(null, false, 'Savings goal not found');
      }

      return this.createResponse(null, true, 'Savings goal deleted successfully');
    } catch (error) {
      return this.handleError(error, 'delete savings goal');
    }
  }

  // User Preferences API
  async getUserPreferences() {
    try {
      await this.delay();
      const preferences = storageService.getUserPreferences();
      return this.createResponse(preferences, true, 'Preferences retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'get user preferences');
    }
  }

  async updateUserPreferences(preferences) {
    try {
      await this.delay();
      const success = storageService.saveUserPreferences(preferences);
      
      if (!success) {
        return this.createResponse(null, false, 'Failed to save preferences');
      }

      return this.createResponse(preferences, true, 'Preferences updated successfully');
    } catch (error) {
      return this.handleError(error, 'update user preferences');
    }
  }

  // Categories API
  async getCategories() {
    try {
      await this.delay();
      const categories = storageService.getCategories();
      return this.createResponse(categories, true, 'Categories retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'get categories');
    }
  }

  async createCategory(categoryData) {
    try {
      await this.delay();
      
      if (!categoryData.name || !categoryData.icon) {
        return this.createResponse(null, false, 'Name and icon are required');
      }

      const category = storageService.addCategory(categoryData);
      return this.createResponse(category, true, 'Category created successfully');
    } catch (error) {
      return this.handleError(error, 'create category');
    }
  }

  // Analytics API
  async getMonthlyReport(year, month) {
    try {
      await this.delay();
      const report = storageService.getMonthlyReport(year, month);
      return this.createResponse(report, true, 'Monthly report generated successfully');
    } catch (error) {
      return this.handleError(error, 'generate monthly report');
    }
  }

  async getDashboardStats() {
    try {
      await this.delay();
      
      const transactions = storageService.getTransactions();
      const budgets = storageService.getBudgets();
      const goals = storageService.getSavingsGoals();
      
      // Calculate current month stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthTransactions = transactions.filter(t => 
        new Date(t.date || t.createdAt) >= startOfMonth
      );

      const totalIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = totalIncome - totalExpenses;

      // Budget progress
      const budgetProgress = budgets.map(budget => {
        const spent = currentMonthTransactions
          .filter(t => t.type === 'expense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          ...budget,
          spent,
          percentage: (spent / budget.amount) * 100
        };
      });

      // Goals progress
      const goalsProgress = goals.map(goal => ({
        ...goal,
        percentage: (goal.currentAmount / goal.targetAmount) * 100
      }));

      const stats = {
        balance,
        totalIncome,
        totalExpenses,
        transactionCount: currentMonthTransactions.length,
        budgetProgress,
        goalsProgress,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
      };

      return this.createResponse(stats, true, 'Dashboard stats retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'get dashboard stats');
    }
  }

  // Data Export/Import API
  async exportData() {
    try {
      await this.delay();
      const data = storageService.exportAllData();
      return this.createResponse(data, true, 'Data exported successfully');
    } catch (error) {
      return this.handleError(error, 'export data');
    }
  }

  async importData(data) {
    try {
      await this.delay();
      const success = storageService.importData(data);
      
      if (!success) {
        return this.createResponse(null, false, 'Failed to import data');
      }

      return this.createResponse(null, true, 'Data imported successfully');
    } catch (error) {
      return this.handleError(error, 'import data');
    }
  }

  // Recurring Transactions API
  async getRecurringTransactions() {
    try {
      await this.delay();
      const recurring = storageService.getRecurringTransactions();
      return this.createResponse(recurring, true, 'Recurring transactions retrieved successfully');
    } catch (error) {
      return this.handleError(error, 'get recurring transactions');
    }
  }

  async createRecurringTransaction(transactionData) {
    try {
      await this.delay();
      
      if (!transactionData.description || !transactionData.amount || !transactionData.frequency) {
        return this.createResponse(null, false, 'Description, amount, and frequency are required');
      }

      const recurring = storageService.addRecurringTransaction(transactionData);
      return this.createResponse(recurring, true, 'Recurring transaction created successfully');
    } catch (error) {
      return this.handleError(error, 'create recurring transaction');
    }
  }

  // Process due recurring transactions
  async processDueRecurringTransactions() {
    try {
      await this.delay();
      
      const recurring = storageService.getRecurringTransactions();
      const now = new Date();
      const processedTransactions = [];

      for (const recurringTxn of recurring) {
        if (recurringTxn.nextExecution && new Date(recurringTxn.nextExecution) <= now) {
          // Create the actual transaction
          const transaction = {
            description: recurringTxn.description,
            amount: recurringTxn.amount,
            type: recurringTxn.type,
            category: recurringTxn.category,
            currency: recurringTxn.currency,
            date: now.toISOString().split('T')[0],
            isRecurring: true,
            recurringId: recurringTxn.id
          };

          const createdTransaction = storageService.addTransaction(transaction);
          processedTransactions.push(createdTransaction);

          // Update the recurring transaction's next execution
          storageService.updateRecurringTransaction(recurringTxn.id, {
            lastExecuted: now.toISOString(),
            nextExecution: storageService.calculateNextExecution(recurringTxn.frequency)
          });
        }
      }

      return this.createResponse(processedTransactions, true, 
        `Processed ${processedTransactions.length} recurring transactions`);
    } catch (error) {
      return this.handleError(error, 'process recurring transactions');
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;