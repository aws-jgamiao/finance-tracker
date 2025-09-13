const TransactionForm = ({ form, setForm, addTransaction, addTransactionForReview, error, darkMode, loading }) => {
  const categories = [
    { id: 'food', name: 'Food & Dining', icon: '🍽️' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'bills', name: 'Bills & Utilities', icon: '📄' },
    { id: 'health', name: 'Healthcare', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'salary', name: 'Salary', icon: '💼' },
    { id: 'freelance', name: 'Freelance', icon: '💻' },
    { id: 'investment', name: 'Investment', icon: '📊' },
    { id: 'other', name: 'Other', icon: '📦' }
  ];

  return (
    <form
      onSubmit={addTransaction}
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Add Transaction
        </h2>
        <span className="text-2xl">💰</span>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Description *"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
          required
        />
        
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Amount *"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={`p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expense</option>
          </select>

          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className={`p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          >
            <option value="USD">💵 USD</option>
            <option value="PHP">₱ PHP</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          required
        >
          <option value="">Select Category *</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
        />

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
          
          {addTransactionForReview && (
            <button
              type="button"
              onClick={addTransactionForReview}
              disabled={loading}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium disabled:opacity-50"
              title="Add for Review"
            >
              📋
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
  
  export default TransactionForm;
  