/**
 * Notification Service - Handles user notifications and feedback
 * Provides toast notifications, alerts, and other user feedback mechanisms
 */

class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.nextId = 1;
  }

  // Subscribe to notification changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.notifications));
  }

  // Add a notification
  addNotification(notification) {
    const newNotification = {
      id: this.nextId++,
      timestamp: new Date().toISOString(),
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }

    return newNotification.id;
  }

  // Remove a notification
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Convenience methods for different notification types
  success(message, options = {}) {
    return this.addNotification({
      type: 'success',
      title: 'Success',
      message,
      icon: '✅',
      ...options
    });
  }

  error(message, options = {}) {
    return this.addNotification({
      type: 'error',
      title: 'Error',
      message,
      icon: '❌',
      duration: 0, // Don't auto-remove errors
      ...options
    });
  }

  warning(message, options = {}) {
    return this.addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      icon: '⚠️',
      ...options
    });
  }

  info(message, options = {}) {
    return this.addNotification({
      type: 'info',
      title: 'Info',
      message,
      icon: 'ℹ️',
      ...options
    });
  }

  // Transaction-specific notifications
  transactionCreated(transaction) {
    return this.success(
      `${transaction.type === 'income' ? 'Income' : 'Expense'} of ${transaction.currency} ${transaction.amount} added successfully`,
      { title: 'Transaction Added' }
    );
  }

  transactionUpdated(transaction) {
    return this.success(
      `Transaction "${transaction.description}" updated successfully`,
      { title: 'Transaction Updated' }
    );
  }

  transactionDeleted() {
    return this.success('Transaction deleted successfully', { title: 'Transaction Deleted' });
  }

  // Budget-specific notifications
  budgetCreated(budget) {
    return this.success(
      `Budget for ${budget.category} (${budget.currency} ${budget.amount}) created successfully`,
      { title: 'Budget Created' }
    );
  }

  budgetExceeded(budget, spent) {
    return this.warning(
      `You've exceeded your ${budget.category} budget by ${budget.currency} ${(spent - budget.amount).toFixed(2)}`,
      { 
        title: 'Budget Exceeded',
        duration: 0 // Keep visible until dismissed
      }
    );
  }

  budgetNearLimit(budget, spent, percentage) {
    return this.warning(
      `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget`,
      { title: 'Budget Alert' }
    );
  }

  // Savings goal notifications
  goalCreated(goal) {
    return this.success(
      `Savings goal "${goal.name}" created with target of ${goal.currency} ${goal.targetAmount}`,
      { title: 'Goal Created' }
    );
  }

  goalAchieved(goal) {
    return this.success(
      `🎉 Congratulations! You've achieved your savings goal "${goal.name}"!`,
      { 
        title: 'Goal Achieved',
        duration: 10000 // Keep longer for celebration
      }
    );
  }

  goalProgress(goal, percentage) {
    const milestones = [25, 50, 75, 90];
    const milestone = milestones.find(m => percentage >= m && percentage < m + 5);
    
    if (milestone) {
      return this.info(
        `You're ${milestone}% of the way to your "${goal.name}" goal! Keep it up!`,
        { title: 'Goal Progress' }
      );
    }
  }

  // Data operation notifications
  dataExported() {
    return this.success('Your data has been exported successfully', { title: 'Export Complete' });
  }

  dataImported() {
    return this.success('Your data has been imported successfully', { title: 'Import Complete' });
  }

  // System notifications
  dataLoaded() {
    return this.info('Your financial data has been loaded', { 
      title: 'Welcome Back',
      duration: 3000
    });
  }

  connectionError() {
    return this.error(
      'Unable to save your changes. Please check your connection and try again.',
      { title: 'Connection Error' }
    );
  }

  // Recurring transaction notifications
  recurringTransactionProcessed(count) {
    if (count > 0) {
      return this.info(
        `${count} recurring transaction${count > 1 ? 's' : ''} processed automatically`,
        { title: 'Recurring Transactions' }
      );
    }
  }

  // Financial insights notifications
  unusualSpending(category, amount, average) {
    return this.warning(
      `Your ${category} spending this month (${amount}) is ${((amount / average - 1) * 100).toFixed(0)}% higher than usual`,
      { title: 'Spending Alert' }
    );
  }

  savingsOpportunity(amount) {
    return this.info(
      `Based on your spending patterns, you could save an additional ${amount} this month`,
      { title: 'Savings Opportunity' }
    );
  }

  // Validation notifications
  validationError(field, message) {
    return this.error(`${field}: ${message}`, { title: 'Validation Error' });
  }

  // Get notifications for display
  getNotifications() {
    return this.notifications;
  }

  // Get notification count by type
  getCount(type = null) {
    if (type) {
      return this.notifications.filter(n => n.type === type).length;
    }
    return this.notifications.length;
  }

  // Mark notification as read
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();
export default notificationService;