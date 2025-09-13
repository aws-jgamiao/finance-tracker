import React from 'react';

const QuickTransactions = ({ onQuickTransaction, darkMode }) => {
  const quickTransactions = [
    { description: 'Coffee', amount: 5, type: 'expense', category: 'food', icon: '☕' },
    { description: 'Lunch', amount: 15, type: 'expense', category: 'food', icon: '🍽️' },
    { description: 'Gas', amount: 50, type: 'expense', category: 'transport', icon: '⛽' },
    { description: 'Grocery', amount: 80, type: 'expense', category: 'food', icon: '🛒' },
    { description: 'Salary', amount: 3000, type: 'income', category: 'salary', icon: '💼' },
    { description: 'Freelance', amount: 500, type: 'income', category: 'freelance', icon: '💻' },
  ];

  const handleQuickTransaction = (transaction) => {
    const transactionData = {
      ...transaction,
      date: new Date().toISOString().split('T')[0],
      currency: 'USD'
    };
    onQuickTransaction(transactionData);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Add
        </h3>
        <span className="text-xl">⚡</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {quickTransactions.map((transaction, index) => (
          <button
            key={index}
            onClick={() => handleQuickTransaction(transaction)}
            className={`p-3 rounded-lg text-left transition-all hover:scale-105 ${
              transaction.type === 'income'
                ? darkMode
                  ? 'bg-green-900/30 hover:bg-green-900/50 text-green-300'
                  : 'bg-green-50 hover:bg-green-100 text-green-700'
                : darkMode
                ? 'bg-red-900/30 hover:bg-red-900/50 text-red-300'
                : 'bg-red-50 hover:bg-red-100 text-red-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{transaction.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{transaction.description}</p>
                <p className="text-xs opacity-75">
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
        Click to add common transactions quickly
      </div>
    </div>
  );
};

export default QuickTransactions;