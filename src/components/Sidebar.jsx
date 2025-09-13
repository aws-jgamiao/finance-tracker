
const Sidebar = ({ activeTab, setActiveTab, balance, formatNumber, darkMode }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'transactions', name: 'Transactions', icon: '💳' },
    { id: 'budgets', name: 'Budgets', icon: '🎯' },
    { id: 'goals', name: 'Savings Goals', icon: '🏆' },
  ];

  return (
    <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">💰</span>
          </div>
          <div>
            <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              FinanceTracker
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Personal Finance
            </p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-6">
        <div className={`${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} rounded-lg p-4 text-white`}>
          <h3 className="text-sm font-medium opacity-90">Total Balance</h3>
          <p className="text-2xl font-bold mt-1">${formatNumber(balance)}</p>
          <div className="flex items-center mt-2 text-sm opacity-90">
            <span className="mr-2">📈</span>
            <span>+2.5% from last month</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>© 2025 Finance Tracker</p>
          <p>Version 2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;