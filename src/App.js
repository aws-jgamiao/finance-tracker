import React, { useState } from "react";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income", // Default type
    currency: "USD", // Default currency
  });
  const [error, setError] = useState("");

  const addTransaction = (e) => {
    e.preventDefault();

    // Check for missing fields
    if (!form.description || !form.amount) {
      setError("All fields are required.");
      return;
    }

    // Enforce consistent currency
    const currentCurrency =
      transactions.length > 0 ? transactions[0].currency : null;
    if (currentCurrency && form.currency !== currentCurrency) {
      setError(
        `Currency mismatch. All transactions must be in ${currentCurrency}.`
      );
      return;
    }

    setError(""); // Clear error
    const newTransaction = {
      id: Date.now(),
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      currency: form.currency,
    };

    // Add to review list
    setReviews([...reviews, newTransaction]);

    // Reset description and amount only
    setForm({ ...form, description: "", amount: "" });
  };

  const approveTransaction = (id) => {
    const transaction = reviews.find((review) => review.id === id);

    // Ensure the currency is consistent
    if (transactions.length === 0) {
      // Set the currency from the first approved transaction
      setTransactions([...transactions, transaction]);
      setReviews(reviews.filter((review) => review.id !== id));
    } else {
      const currentCurrency = transactions[0].currency;
      if (transaction.currency !== currentCurrency) {
        setError(
          `Currency mismatch. All transactions must be in ${currentCurrency}. This transaction was not approved.`
        );
        // Cancel the approval
        return;
      } else {
        setTransactions([...transactions, transaction]);
        setReviews(reviews.filter((review) => review.id !== id));
        setError(""); // Clear any previous errors
      }
    }
  };

  const cancelTransaction = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const calculateTotal = (type) =>
    transactions
      .filter((txn) => txn.type === type)
      .reduce((sum, txn) => sum + txn.amount, 0);

  const balance = calculateTotal("income") - calculateTotal("expense");

  const formatNumber = (num) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Finance Tracker</h1>

      {/* Balance Section */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-700">Balance</h2>
        <p className="text-2xl font-bold text-green-500">
          {form.currency} {formatNumber(balance)}
        </p>
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-lg font-semibold text-green-500">
              {form.currency} {formatNumber(calculateTotal("income"))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-lg font-semibold text-red-500">
              {form.currency} {formatNumber(calculateTotal("expense"))}
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={addTransaction}
        className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg mt-6"
      >
        <h2 className="text-xl font-semibold text-gray-700">Add Transaction</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          >
            <option value="USD">Dollars</option>
            <option value="PHP">Pesos</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>
      </form>

      {/* Transactions List */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg mt-6">
        <h2 className="text-xl font-semibold text-gray-700">Transaction List</h2>
        <ul className="mt-4">
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <li
                key={txn.id}
                className={`flex justify-between p-2 border-b ${
                  txn.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                <span>{txn.description}</span>
                <span>
                  {txn.currency} {formatNumber(txn.amount)}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No transactions added yet.</p>
          )}
        </ul>
      </div>

      {/* Review List */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-7xl mt-6">
        <h2 className="text-xl font-semibold text-gray-700">Transaction Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 border border-gray-300 rounded-lg space-y-2"
              >
                <div className="flex justify-between">
                  <span>{review.description}</span>
                  <span>
                    {review.currency} {formatNumber(review.amount)}{" "}
                    ({review.type === "income" ? "Income" : "Expense"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => approveTransaction(review.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => cancelTransaction(review.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
