const BalanceSection = ({ balance, incomeTotal, expenseTotal, currency, formatNumber, darkMode }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Account Balance
        </h2>
        <span className="text-2xl">💳</span>
      </div>
      
      <div className="mb-6">
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {currency} {formatNumber(balance)}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Current balance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg`}>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-500">📈</span>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Income</p>
          </div>
          <p className="text-lg font-semibold text-green-500">
            {currency} {formatNumber(incomeTotal)}
          </p>
        </div>
        
        <div className={`p-4 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg`}>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-red-500">📉</span>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expenses</p>
          </div>
          <p className="text-lg font-semibold text-red-500">
            {currency} {formatNumber(expenseTotal)}
          </p>
        </div>
      </div>
    </div>
  );
  
  export default BalanceSection;
  