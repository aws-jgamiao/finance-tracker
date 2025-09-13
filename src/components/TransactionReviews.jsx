const TransactionReview = ({ review, approveTransaction, cancelTransaction, formatNumber, darkMode }) => {
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

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg`}>
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{categoryIcons[review.category] || '📦'}</span>
        <div className="flex-1">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {review.description}
          </h3>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {review.category}
            </span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>•</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className={`text-lg font-bold ${
          review.type === "income" ? "text-green-500" : "text-red-500"
        }`}>
          {review.type === "income" ? "+" : "-"}{review.currency} {formatNumber(review.amount)}
        </p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {review.type === "income" ? "Income" : "Expense"}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => approveTransaction(review.id)}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
        >
          ✓ Approve
        </button>
        <button
          onClick={() => cancelTransaction(review.id)}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
        >
          ✕ Reject
        </button>
      </div>
    </div>
  );
};
  
const TransactionReviews = ({ reviews, approveTransaction, cancelTransaction, formatNumber, darkMode }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Pending Reviews
      </h2>
      <div className="flex items-center space-x-2">
        <span className="text-2xl">⏳</span>
        {reviews.length > 0 && (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
          }`}>
            {reviews.length}
          </span>
        )}
      </div>
    </div>
    
    {reviews.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <TransactionReview
            key={review.id}
            review={review}
            approveTransaction={approveTransaction}
            cancelTransaction={cancelTransaction}
            formatNumber={formatNumber}
            darkMode={darkMode}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          All caught up!
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No transactions pending review
        </p>
      </div>
    )}
  </div>
);
  
  export default TransactionReviews;
  