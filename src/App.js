import React, { useState, useEffect } from "react";
import BalanceSection from "./components/BalanceSection";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import TransactionReviews from "./components/TransactionReviews";
import TransactionChart from "./components/TransactionChart";
import BudgetManager from "./components/BudgetManager";
import SavingsGoals from "./components/SavingsGoals";
import FinancialInsights from "./components/FinancialInsights";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import NotificationCenter from "./components/NotificationCenter";
import QuickTransactions from "./components/QuickTransactions";
import { useFinanceData } from "./hooks/useFinanceData";
import notificationService from "./services/NotificationService";

const App = () => {
  // Use the custom hook for data management
  const {
    transactions,
    budgets,
    savingsGoals,
    categories,
    userPreferences,
    dashboardStats,
    loading,
    errors,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createBudget,
    updateBudget,
    deleteBudget,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    updateUserPreferences,
    exportData,
    importData,
    loadTransactions
  } = useFinanceData();

  // Local state for UI
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income",
    currency: userPreferences.currency || "USD",
    category: userPreferences.defaultCategory || "other",
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Dark mode from user preferences
  const darkMode = userPreferences.darkMode || false;

  // Update form currency when user preferences change
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      currency: userPreferences.currency || "USD",
      category: userPreferences.defaultCategory || "other"
    }));
  }, [userPreferences]);

  // Show welcome notification on first load
  useEffect(() => {
    if (transactions.length > 0) {
      notificationService.dataLoaded();
    }
  }, [transactions.length]);

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) {
      setError("All fields are required.");
      return;
    }
    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    setError("");
    const transactionData = {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      currency: form.currency,
      category: form.category,
      date: form.date,
    };

    // Create transaction directly (you can change this to use reviews if needed)
    const success = await createTransaction(transactionData);
    if (success) {
      // Reset form
      setForm({ 
        ...form, 
        description: "", 
        amount: "",
        date: new Date().toISOString().split('T')[0]
      });
      
      // Show success notification
      notificationService.transactionCreated(success);
      
      // Check budget alerts
      checkBudgetAlerts(success);
    } else {
      setError("Failed to create transaction. Please try again.");
    }
  };

  // Alternative function for review-based workflow
  const addTransactionForReview = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) {
      setError("All fields are required.");
      return;
    }
    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    setError("");
    const transactionData = {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      currency: form.currency,
      category: form.category,
      date: form.date,
    };

    // Add to reviews first (pending approval)
    const reviewTransaction = {
      ...transactionData,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
    };

    setReviews([...reviews, reviewTransaction]);
    setForm({ 
      ...form, 
      description: "", 
      amount: "",
      date: new Date().toISOString().split('T')[0]
    });
    
    notificationService.info("Transaction added to review queue", { title: "Pending Review" });
  };

  // Quick transaction handler
  const handleQuickTransaction = async (transactionData) => {
    const success = await createTransaction(transactionData);
    if (success) {
      notificationService.transactionCreated(success);
      checkBudgetAlerts(success);
    }
  };

  const handleTransactionEdit = async (id, updatedData) => {
    const success = await updateTransaction(id, updatedData);
    if (success) {
      notificationService.transactionUpdated(updatedData);
    }
  };

  const handleTransactionDelete = async (id) => {
    const success = await deleteTransaction(id);
    if (success) {
      notificationService.transactionDeleted();
    }
  };

  const approveTransaction = async (id) => {
    const transaction = reviews.find((review) => review.id === id);
    if (!transaction) return;

    const success = await createTransaction(transaction);
    if (success) {
      setReviews(reviews.filter((review) => review.id !== id));
      notificationService.transactionCreated(transaction);
      
      // Check budget alerts
      checkBudgetAlerts(transaction);
    }
  };

  const cancelTransaction = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  // Check for budget alerts when a new expense is added
  const checkBudgetAlerts = (transaction) => {
    if (transaction.type === 'expense') {
      const budget = budgets.find(b => b.category === transaction.category);
      if (budget) {
        const currentMonthExpenses = transactions
          .filter(t => 
            t.type === 'expense' && 
            t.category === transaction.category &&
            new Date(t.date).getMonth() === new Date().getMonth()
          )
          .reduce((sum, t) => sum + t.amount, 0) + transaction.amount;

        const percentage = (currentMonthExpenses / budget.amount) * 100;
        
        if (percentage >= 100) {
          notificationService.budgetExceeded(budget, currentMonthExpenses);
        } else if (percentage >= 80) {
          notificationService.budgetNearLimit(budget, currentMonthExpenses, percentage);
        }
      }
    }
  };

  const calculateTotal = (type) =>
    transactions
      .filter((txn) => txn.type === type)
      .reduce((sum, txn) => sum + txn.amount, 0);

  const balance = calculateTotal("income") - calculateTotal("expense");

  const formatNumber = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || txn.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Currency'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(txn => [
        txn.date,
        `"${txn.description}"`,
        txn.amount,
        txn.type,
        txn.category,
        txn.currency
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  const handleDarkModeToggle = async () => {
    const newDarkMode = !darkMode;
    await updateUserPreferences({
      ...userPreferences,
      darkMode: newDarkMode
    });
  };

  const handleDataExport = async () => {
    const success = await exportData();
    if (success) {
      notificationService.dataExported();
    }
  };

  const handleDataImport = async (file) => {
    const success = await importData(file);
    if (success) {
      notificationService.dataImported();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <BalanceSection
                balance={balance}
                incomeTotal={calculateTotal("income")}
                expenseTotal={calculateTotal("expense")}
                currency={form.currency}
                formatNumber={formatNumber}
                darkMode={darkMode}
              />
              <TransactionForm 
                form={form} 
                setForm={setForm} 
                addTransaction={addTransaction}
                addTransactionForReview={addTransactionForReview}
                error={error}
                darkMode={darkMode}
                loading={loading.transactions}
              />
              <QuickTransactions
                onQuickTransaction={handleQuickTransaction}
                darkMode={darkMode}
              />
              <FinancialInsights 
                transactions={transactions}
                budgets={budgets}
                darkMode={darkMode}
                formatNumber={formatNumber}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                <TransactionChart transactions={transactions} period={period} darkMode={darkMode} />
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                <BudgetManager 
                  budgets={budgets}
                  createBudget={createBudget}
                  updateBudget={updateBudget}
                  deleteBudget={deleteBudget}
                  transactions={transactions}
                  darkMode={darkMode}
                  formatNumber={formatNumber}
                  loading={loading.budgets}
                />
              </div>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Transactions
                  </h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((txn) => (
                    <div key={txn.id} className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {txn.category === 'food' ? '🍽️' : 
                           txn.category === 'transport' ? '🚗' : 
                           txn.category === 'shopping' ? '🛍️' : '📦'}
                        </span>
                        <div>
                          <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {txn.description}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {txn.type === 'income' ? '+' : '-'}{txn.currency} {formatNumber(txn.amount)}
                      </span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No transactions yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 p-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transportation</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="bills">Bills & Utilities</option>
                  <option value="health">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="investment">Investment</option>
                  <option value="other">Other</option>
                </select>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export CSV
                </button>
              </div>
              <TransactionList 
                transactions={filteredTransactions} 
                formatNumber={formatNumber}
                darkMode={darkMode}
                editTransaction={handleTransactionEdit}
                deleteTransaction={handleTransactionDelete}
                loading={loading.transactions}
              />
            </div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <TransactionReviews
                reviews={reviews}
                approveTransaction={approveTransaction}
                cancelTransaction={cancelTransaction}
                formatNumber={formatNumber}
                darkMode={darkMode}
              />
            </div>
          </div>
        );
      case 'budgets':
        return (
          <BudgetManager 
            budgets={budgets}
            createBudget={createBudget}
            updateBudget={updateBudget}
            deleteBudget={deleteBudget}
            transactions={transactions}
            darkMode={darkMode}
            formatNumber={formatNumber}
            loading={loading.budgets}
          />
        );
      case 'goals':
        return (
          <SavingsGoals
            savingsGoals={savingsGoals}
            createSavingsGoal={createSavingsGoal}
            updateSavingsGoal={updateSavingsGoal}
            deleteSavingsGoal={deleteSavingsGoal}
            transactions={transactions}
            darkMode={darkMode}
            formatNumber={formatNumber}
            loading={loading.savingsGoals}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        balance={balance}
        formatNumber={formatNumber}
        darkMode={darkMode}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          darkMode={darkMode}
          setDarkMode={handleDarkModeToggle}
          period={period}
          setPeriod={setPeriod}
          onExport={handleDataExport}
          onImport={handleDataImport}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
      
      <NotificationCenter darkMode={darkMode} />
    </div>
  );
};

export default App;
