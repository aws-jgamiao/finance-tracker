/**
 * Custom hook for managing finance data with API calls
 * Provides a clean interface for components to interact with the backend
 */

import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/ApiService';

export const useFinanceData = () => {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [dashboardStats, setDashboardStats] = useState({});
  
  // Loading states
  const [loading, setLoading] = useState({
    transactions: false,
    budgets: false,
    savingsGoals: false,
    categories: false,
    preferences: false,
    dashboard: false
  });

  // Error states
  const [errors, setErrors] = useState({});

  // Helper function to update loading state
  const setLoadingState = useCallback((key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  // Helper function to handle API responses
  const handleApiResponse = useCallback((response, successCallback, errorKey) => {
    if (response.success) {
      successCallback(response.data);
      setErrors(prev => ({ ...prev, [errorKey]: null }));
    } else {
      setErrors(prev => ({ ...prev, [errorKey]: response.message }));
      console.error(`API Error (${errorKey}):`, response.message);
    }
  }, []);

  // Transaction operations
  const loadTransactions = useCallback(async (filters = {}) => {
    setLoadingState('transactions', true);
    try {
      const response = await apiService.getTransactions(filters);
      handleApiResponse(response, setTransactions, 'transactions');
    } finally {
      setLoadingState('transactions', false);
    }
  }, [setLoadingState, handleApiResponse]);

  const createTransaction = useCallback(async (transactionData) => {
    setLoadingState('transactions', true);
    try {
      const response = await apiService.createTransaction(transactionData);
      if (response.success) {
        await loadTransactions(); // Reload transactions
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, transactions: response.message }));
        return null;
      }
    } finally {
      setLoadingState('transactions', false);
    }
  }, [loadTransactions, setLoadingState]);

  const updateTransaction = useCallback(async (id, updates) => {
    setLoadingState('transactions', true);
    try {
      const response = await apiService.updateTransaction(id, updates);
      if (response.success) {
        await loadTransactions(); // Reload transactions
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, transactions: response.message }));
        return null;
      }
    } finally {
      setLoadingState('transactions', false);
    }
  }, [loadTransactions, setLoadingState]);

  const deleteTransaction = useCallback(async (id) => {
    setLoadingState('transactions', true);
    try {
      const response = await apiService.deleteTransaction(id);
      if (response.success) {
        await loadTransactions(); // Reload transactions
        return true;
      } else {
        setErrors(prev => ({ ...prev, transactions: response.message }));
        return false;
      }
    } finally {
      setLoadingState('transactions', false);
    }
  }, [loadTransactions, setLoadingState]);

  // Budget operations
  const loadBudgets = useCallback(async () => {
    setLoadingState('budgets', true);
    try {
      const response = await apiService.getBudgets();
      handleApiResponse(response, setBudgets, 'budgets');
    } finally {
      setLoadingState('budgets', false);
    }
  }, [setLoadingState, handleApiResponse]);

  const createBudget = useCallback(async (budgetData) => {
    setLoadingState('budgets', true);
    try {
      const response = await apiService.createBudget(budgetData);
      if (response.success) {
        await loadBudgets(); // Reload budgets
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, budgets: response.message }));
        return null;
      }
    } finally {
      setLoadingState('budgets', false);
    }
  }, [loadBudgets, setLoadingState]);

  const updateBudget = useCallback(async (id, updates) => {
    setLoadingState('budgets', true);
    try {
      const response = await apiService.updateBudget(id, updates);
      if (response.success) {
        await loadBudgets(); // Reload budgets
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, budgets: response.message }));
        return null;
      }
    } finally {
      setLoadingState('budgets', false);
    }
  }, [loadBudgets, setLoadingState]);

  const deleteBudget = useCallback(async (id) => {
    setLoadingState('budgets', true);
    try {
      const response = await apiService.deleteBudget(id);
      if (response.success) {
        await loadBudgets(); // Reload budgets
        return true;
      } else {
        setErrors(prev => ({ ...prev, budgets: response.message }));
        return false;
      }
    } finally {
      setLoadingState('budgets', false);
    }
  }, [loadBudgets, setLoadingState]);

  // Savings Goals operations
  const loadSavingsGoals = useCallback(async () => {
    setLoadingState('savingsGoals', true);
    try {
      const response = await apiService.getSavingsGoals();
      handleApiResponse(response, setSavingsGoals, 'savingsGoals');
    } finally {
      setLoadingState('savingsGoals', false);
    }
  }, [setLoadingState, handleApiResponse]);

  const createSavingsGoal = useCallback(async (goalData) => {
    setLoadingState('savingsGoals', true);
    try {
      const response = await apiService.createSavingsGoal(goalData);
      if (response.success) {
        await loadSavingsGoals(); // Reload goals
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, savingsGoals: response.message }));
        return null;
      }
    } finally {
      setLoadingState('savingsGoals', false);
    }
  }, [loadSavingsGoals, setLoadingState]);

  const updateSavingsGoal = useCallback(async (id, updates) => {
    setLoadingState('savingsGoals', true);
    try {
      const response = await apiService.updateSavingsGoal(id, updates);
      if (response.success) {
        await loadSavingsGoals(); // Reload goals
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, savingsGoals: response.message }));
        return null;
      }
    } finally {
      setLoadingState('savingsGoals', false);
    }
  }, [loadSavingsGoals, setLoadingState]);

  const deleteSavingsGoal = useCallback(async (id) => {
    setLoadingState('savingsGoals', true);
    try {
      const response = await apiService.deleteSavingsGoal(id);
      if (response.success) {
        await loadSavingsGoals(); // Reload goals
        return true;
      } else {
        setErrors(prev => ({ ...prev, savingsGoals: response.message }));
        return false;
      }
    } finally {
      setLoadingState('savingsGoals', false);
    }
  }, [loadSavingsGoals, setLoadingState]);

  // Categories operations
  const loadCategories = useCallback(async () => {
    setLoadingState('categories', true);
    try {
      const response = await apiService.getCategories();
      handleApiResponse(response, setCategories, 'categories');
    } finally {
      setLoadingState('categories', false);
    }
  }, [setLoadingState, handleApiResponse]);

  const createCategory = useCallback(async (categoryData) => {
    setLoadingState('categories', true);
    try {
      const response = await apiService.createCategory(categoryData);
      if (response.success) {
        await loadCategories(); // Reload categories
        return response.data;
      } else {
        setErrors(prev => ({ ...prev, categories: response.message }));
        return null;
      }
    } finally {
      setLoadingState('categories', false);
    }
  }, [loadCategories, setLoadingState]);

  // User Preferences operations
  const loadUserPreferences = useCallback(async () => {
    setLoadingState('preferences', true);
    try {
      const response = await apiService.getUserPreferences();
      handleApiResponse(response, setUserPreferences, 'preferences');
    } finally {
      setLoadingState('preferences', false);
    }
  }, [setLoadingState, handleApiResponse]);

  const updateUserPreferences = useCallback(async (preferences) => {
    setLoadingState('preferences', true);
    try {
      const response = await apiService.updateUserPreferences(preferences);
      if (response.success) {
        setUserPreferences(preferences);
        return true;
      } else {
        setErrors(prev => ({ ...prev, preferences: response.message }));
        return false;
      }
    } finally {
      setLoadingState('preferences', false);
    }
  }, [setLoadingState]);

  // Dashboard operations
  const loadDashboardStats = useCallback(async () => {
    setLoadingState('dashboard', true);
    try {
      const response = await apiService.getDashboardStats();
      handleApiResponse(response, setDashboardStats, 'dashboard');
    } finally {
      setLoadingState('dashboard', false);
    }
  }, [setLoadingState, handleApiResponse]);

  // Data export/import
  const exportData = useCallback(async () => {
    try {
      const response = await apiService.exportData();
      if (response.success) {
        // Create and download file
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `finance-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        return true;
      } else {
        setErrors(prev => ({ ...prev, export: response.message }));
        return false;
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, export: error.message }));
      return false;
    }
  }, []);

  const importData = useCallback(async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const response = await apiService.importData(data);
      
      if (response.success) {
        // Reload all data
        await Promise.all([
          loadTransactions(),
          loadBudgets(),
          loadSavingsGoals(),
          loadCategories(),
          loadUserPreferences(),
          loadDashboardStats()
        ]);
        return true;
      } else {
        setErrors(prev => ({ ...prev, import: response.message }));
        return false;
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, import: error.message }));
      return false;
    }
  }, [loadTransactions, loadBudgets, loadSavingsGoals, loadCategories, loadUserPreferences, loadDashboardStats]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        loadTransactions(),
        loadBudgets(),
        loadSavingsGoals(),
        loadCategories(),
        loadUserPreferences(),
        loadDashboardStats()
      ]);
    };

    initializeData();
  }, [loadTransactions, loadBudgets, loadSavingsGoals, loadCategories, loadUserPreferences, loadDashboardStats]);

  // Return all data and operations
  return {
    // Data
    transactions,
    budgets,
    savingsGoals,
    categories,
    userPreferences,
    dashboardStats,

    // Loading states
    loading,

    // Errors
    errors,

    // Transaction operations
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,

    // Budget operations
    loadBudgets,
    createBudget,
    updateBudget,
    deleteBudget,

    // Savings Goals operations
    loadSavingsGoals,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,

    // Categories operations
    loadCategories,
    createCategory,

    // User Preferences operations
    loadUserPreferences,
    updateUserPreferences,

    // Dashboard operations
    loadDashboardStats,

    // Data operations
    exportData,
    importData,

    // Utility functions
    clearErrors: useCallback(() => setErrors({}), []),
    refreshAllData: useCallback(async () => {
      await Promise.all([
        loadTransactions(),
        loadBudgets(),
        loadSavingsGoals(),
        loadCategories(),
        loadUserPreferences(),
        loadDashboardStats()
      ]);
    }, [loadTransactions, loadBudgets, loadSavingsGoals, loadCategories, loadUserPreferences, loadDashboardStats])
  };
};