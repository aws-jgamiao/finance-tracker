import React, { useState } from 'react';

const TransactionList = ({ transactions, formatNumber, darkMode, editTransaction, deleteTransaction, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const categoryIcons = {
    food: '🍽️',
    transport: '🚗',
    shopping: '🛍️',
    entertainment: '🎬',
    bills: '📄',
    health: '🏥',
    education: '📚',
    salary: '💼',
    freelance: '💻',
    investment: '📊',
    other: '📦'
  };

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category
    });
  };

  const saveEdit = () => {
    editTransaction(editingId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Transactions
        </h2>
        <span className="text-2xl">📋</span>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading transactions...</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.slice().reverse().map((txn) => (
            <div
              key={txn.id}
              className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg border-l-4 ${
                txn.type === "income" ? "border-green-500" : "border-red-500"
              }`}
            >
              {editingId === txn.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {categoryIcons[txn.category] || '📦'}
                    </span>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {txn.description}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {txn.category}
                        </span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>•</span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {new Date(txn.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        txn.type === "income" ? "text-green-500" : "text-red-500"
                      }`}>
                        {txn.type === "income" ? "+" : "-"}{txn.currency} {formatNumber(txn.amount)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEdit(txn)}
                        className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTransaction(txn.id)}
                        className="p-1 rounded text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No transactions yet
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Start by adding your first transaction
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
  