import React, { useState } from 'react';

const BudgetManager = ({ budgets, createBudget, updateBudget, deleteBudget, transactions, darkMode, formatNumber, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    amount: '',
    period: 'month'
  });

  const categories = [
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄' },
    { id: 'health', name: 'Healthcare', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'other', name: 'Other', icon: '📦' }
  ];

  const addBudget = async (e) => {
    e.preventDefault();
    if (!budgetForm.category || !budgetForm.amount) return;

    const budgetData = {
      category: budgetForm.category,
      amount: parseFloat(budgetForm.amount),
      period: budgetForm.period,
    };

    const success = await createBudget(budgetData);
    if (success) {
      setBudgetForm({ category: '', amount: '', period: 'month' });
      setShowForm(false);
    }
  };

  const getBudgetProgress = (budget) => {
    const now = new Date();
    let startDate;
    
    if (budget.period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (budget.period === 'week') {
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const spent = transactions
      .filter(txn => 
        txn.type === 'expense' && 
        txn.category === budget.category &&
        new Date(txn.date) >= startDate
      )
      .reduce((sum, txn) => sum + txn.amount, 0);

    const percentage = (spent / budget.amount) * 100;
    return { spent, percentage: Math.min(percentage, 100) };
  };

  const handleDeleteBudget = async (id) => {
    await deleteBudget(id);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Budget Manager
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addBudget} className={`mb-6 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
              className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Budget Amount"
              value={budgetForm.amount}
              onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
              className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
              required
            />
            <select
              value={budgetForm.period}
              onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
              className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Budget'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map(budget => {
          const { spent, percentage } = getBudgetProgress(budget);
          const category = categories.find(cat => cat.id === budget.category);
          const isOverBudget = percentage >= 100;

          return (
            <div key={budget.id} className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category?.icon}</span>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {category?.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {budget.period}ly budget
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBudget(budget.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    ${formatNumber(spent)} / ${formatNumber(budget.amount)}
                  </span>
                  <span className={`font-semibold ${isOverBudget ? 'text-red-500' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isOverBudget ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {isOverBudget && (
                <div className="text-red-500 text-sm font-medium">
                  ⚠️ Over budget by ${formatNumber(spent - budget.amount)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No budgets set
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
            Create your first budget to start tracking your spending
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Budget
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;