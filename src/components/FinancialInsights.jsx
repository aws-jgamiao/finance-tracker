import React from 'react';

const FinancialInsights = ({ transactions, budgets, darkMode, formatNumber }) => {
  const getCurrentMonthTransactions = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions.filter(txn => new Date(txn.date) >= startOfMonth);
  };

  const getLastMonthTransactions = () => {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return transactions.filter(txn => {
      const txnDate = new Date(txn.date);
      return txnDate >= startOfLastMonth && txnDate <= endOfLastMonth;
    });
  };

  const currentMonthTxns = getCurrentMonthTransactions();
  const lastMonthTxns = getLastMonthTransactions();

  const currentIncome = currentMonthTxns
    .filter(txn => txn.type === 'income')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const currentExpenses = currentMonthTxns
    .filter(txn => txn.type === 'expense')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const lastMonthIncome = lastMonthTxns
    .filter(txn => txn.type === 'income')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const lastMonthExpenses = lastMonthTxns
    .filter(txn => txn.type === 'expense')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const incomeChange = lastMonthIncome > 0 ? ((currentIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  const expenseChange = lastMonthExpenses > 0 ? ((currentExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  const getTopCategories = () => {
    const categoryTotals = {};
    currentMonthTxns
      .filter(txn => txn.type === 'expense')
      .forEach(txn => {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
      });

    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  const topCategories = getTopCategories();

  const categoryIcons = {
    food: '🍽️',
    transport: '🚗',
    shopping: '🛍️',
    entertainment: '🎬',
    bills: '📄',
    health: '🏥',
    education: '📚',
    other: '📦'
  };

  const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0;

  const insights = [
    {
      title: 'Monthly Income',
      value: `$${formatNumber(currentIncome)}`,
      change: incomeChange,
      icon: '💰',
      positive: incomeChange >= 0
    },
    {
      title: 'Monthly Expenses',
      value: `$${formatNumber(currentExpenses)}`,
      change: expenseChange,
      icon: '💸',
      positive: expenseChange < 0
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: null,
      icon: '📈',
      positive: savingsRate > 20
    }
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Financial Insights
      </h2>

      {/* Key Metrics */}
      <div className="space-y-4 mb-6">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {insight.title}
                  </p>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {insight.value}
                  </p>
                </div>
              </div>
              {insight.change !== null && (
                <div className={`text-sm font-medium ${
                  insight.positive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {insight.change > 0 ? '+' : ''}{insight.change.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Top Spending Categories */}
      {topCategories.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Spending Categories
          </h3>
          <div className="space-y-2">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{categoryIcons[category] || '📦'}</span>
                  <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {category}
                  </span>
                </div>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${formatNumber(amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Health Score */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Financial Health
          </span>
          <span className={`text-sm ${
            savingsRate > 20 ? 'text-green-500' : 
            savingsRate > 10 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {savingsRate > 20 ? 'Excellent' : 
             savingsRate > 10 ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
        <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
          <div
            className={`h-2 rounded-full ${
              savingsRate > 20 ? 'bg-green-500' : 
              savingsRate > 10 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(savingsRate * 2, 100)}%` }}
          ></div>
        </div>
        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Aim for 20%+ savings rate for optimal financial health
        </p>
      </div>
    </div>
  );
};

export default FinancialInsights;