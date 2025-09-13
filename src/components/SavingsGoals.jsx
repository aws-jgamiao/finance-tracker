import React, { useState } from 'react';

const SavingsGoals = ({ savingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, transactions, darkMode, formatNumber, loading }) => {
    const [showForm, setShowForm] = useState(false);
    const [goalForm, setGoalForm] = useState({
        name: '',
        targetAmount: '',
        targetDate: '',
        description: ''
    });

    const addGoal = async (e) => {
        e.preventDefault();
        if (!goalForm.name || !goalForm.targetAmount || !goalForm.targetDate) return;

        const goalData = {
            name: goalForm.name,
            targetAmount: parseFloat(goalForm.targetAmount),
            targetDate: goalForm.targetDate,
            description: goalForm.description,
        };

        const success = await createSavingsGoal(goalData);
        if (success) {
            setGoalForm({ name: '', targetAmount: '', targetDate: '', description: '' });
            setShowForm(false);
        }
    };

    const addToGoal = async (goalId, amount) => {
        const goal = savingsGoals.find(g => g.id === goalId);
        if (goal) {
            await updateSavingsGoal(goalId, {
                currentAmount: goal.currentAmount + amount
            });
        }
    };

    const handleDeleteGoal = async (id) => {
        await deleteSavingsGoal(id);
    };

    const getDaysRemaining = (targetDate) => {
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getGoalProgress = (goal) => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        return Math.min(percentage, 100);
    };

    const goalIcons = ['🏠', '🚗', '✈️', '💍', '🎓', '💻', '📱', '🎯', '💰', '🏖️'];

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Savings Goals
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'Add Goal'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={addGoal} className={`mb-6 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Goal Name (e.g., Emergency Fund)"
                            value={goalForm.name}
                            onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                            className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Target Amount"
                            value={goalForm.targetAmount}
                            onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                            className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                            required
                        />
                        <input
                            type="date"
                            value={goalForm.targetDate}
                            onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                            className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={goalForm.description}
                            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                            className={`p-2 border rounded-lg ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Goal'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savingsGoals.map((goal, index) => {
                    const progress = getGoalProgress(goal);
                    const daysRemaining = getDaysRemaining(goal.targetDate);
                    const isCompleted = progress >= 100;
                    const isOverdue = daysRemaining < 0;
                    const icon = goalIcons[index % goalIcons.length];

                    return (
                        <div key={goal.id} className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg relative`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">{icon}</span>
                                    <div>
                                        <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {goal.name}
                                        </h3>
                                        {goal.description && (
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {goal.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteGoal(goal.id)}
                                    className="text-red-500 hover:text-red-700"
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                        ${formatNumber(goal.currentAmount)} / ${formatNumber(goal.targetAmount)}
                                    </span>
                                    <span className={`font-semibold ${isCompleted ? 'text-green-500' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {progress.toFixed(1)}%
                                    </span>
                                </div>
                                <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-3`}>
                                    <div
                                        className={`h-3 rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                                </div>
                                <div className={`text-sm ${isOverdue ? 'text-red-500' :
                                    daysRemaining <= 30 ? 'text-yellow-500' :
                                        darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {isOverdue ? `${Math.abs(daysRemaining)} days overdue` :
                                        daysRemaining === 0 ? 'Due today' :
                                            `${daysRemaining} days remaining`}
                                </div>
                            </div>

                            {isCompleted && (
                                <div className="text-green-500 font-semibold text-center py-2">
                                    🎉 Goal Achieved!
                                </div>
                            )}

                            {!isCompleted && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            const amount = prompt('Enter amount to add:');
                                            if (amount && !isNaN(amount)) {
                                                addToGoal(goal.id, parseFloat(amount));
                                            }
                                        }}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        Add Money
                                    </button>
                                    <button
                                        onClick={() => {
                                            const remaining = goal.targetAmount - goal.currentAmount;
                                            addToGoal(goal.id, remaining);
                                        }}
                                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                    >
                                        Complete
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {savingsGoals.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        No savings goals yet
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                        Set your first savings goal and start building your future
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Your First Goal
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavingsGoals;