import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const TransactionChart = ({ transactions, period, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('pie');

  const processTransactions = () => {
    if (transactions.length === 0) {
      setChartData({
        labels: ["No Data"],
        datasets: [
          {
            data: [100],
            backgroundColor: [darkMode ? "#374151" : "#e5e7eb"],
            hoverBackgroundColor: [darkMode ? "#4b5563" : "#d1d5db"],
          },
        ],
      });
      return;
    }

    const filteredTransactions = transactions.filter((txn) => {
      const txnDate = new Date(txn.date || txn.createdAt);
      const now = new Date();
      let comparisonDate;

      if (period === "day") {
        comparisonDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (period === "week") {
        comparisonDate = new Date(now.setDate(now.getDate() - 7));
      } else if (period === "month") {
        comparisonDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (period === "year") {
        comparisonDate = new Date(now.getFullYear(), 0, 1);
      }

      return txnDate >= comparisonDate;
    });

    if (chartType === 'pie') {
      // Category breakdown for expenses
      const expensesByCategory = {};
      filteredTransactions
        .filter(txn => txn.type === 'expense')
        .forEach(txn => {
          expensesByCategory[txn.category] = (expensesByCategory[txn.category] || 0) + txn.amount;
        });

      const categories = Object.keys(expensesByCategory);
      const amounts = Object.values(expensesByCategory);
      
      const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
      ];

      setChartData({
        labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
        datasets: [
          {
            data: amounts,
            backgroundColor: colors.slice(0, categories.length),
            hoverBackgroundColor: colors.slice(0, categories.length).map(color => color + '80'),
            borderWidth: darkMode ? 0 : 2,
            borderColor: darkMode ? 'transparent' : '#ffffff',
          },
        ],
      });
    } else {
      // Income vs Expenses over time
      const incomeTotal = filteredTransactions
        .filter(txn => txn.type === 'income')
        .reduce((sum, txn) => sum + txn.amount, 0);
      
      const expenseTotal = filteredTransactions
        .filter(txn => txn.type === 'expense')
        .reduce((sum, txn) => sum + txn.amount, 0);

      setChartData({
        labels: ['Income', 'Expenses'],
        datasets: [
          {
            label: 'Amount',
            data: [incomeTotal, expenseTotal],
            backgroundColor: ['#10b981', '#ef4444'],
            hoverBackgroundColor: ['#059669', '#dc2626'],
            borderWidth: darkMode ? 0 : 2,
            borderColor: darkMode ? 'transparent' : '#ffffff',
          },
        ],
      });
    }
  };

  useEffect(() => {
    processTransactions();
  }, [transactions, period, chartType, darkMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? '#374151' : '#ffffff',
        titleColor: darkMode ? '#ffffff' : '#000000',
        bodyColor: darkMode ? '#e5e7eb' : '#374151',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
      },
    } : {},
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Financial Overview
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'pie'
                ? 'bg-blue-600 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Overview
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {chartData && (
          chartType === 'pie' ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )
        )}
      </div>
      
      <div className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Showing data for: {period === 'day' ? 'Today' : 
                          period === 'week' ? 'This Week' : 
                          period === 'month' ? 'This Month' : 'This Year'}
      </div>
    </div>
  );
};

export default TransactionChart;
