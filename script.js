class TaskFlowApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.editingTaskId = null;
        this.theme = this.loadTheme();
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
        this.hideLoadingOverlay();
        
        // Store reference globally for debugging
        window.taskFlowApp = this;
    }

    bindEvents() {
        // Form submission
        const taskForm = document.getElementById('taskForm');
        const taskInput = document.getElementById('taskInput');
        
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = taskInput.value.trim();
            if (text) {
                this.addTask(text);
                taskInput.value = '';
                taskInput.focus();
            }
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.setSearchQuery(e.target.value);
        });

        // Bulk actions
        const markAllCompleteBtn = document.getElementById('markAllComplete');
        const clearCompletedBtn = document.getElementById('clearCompleted');
        
        markAllCompleteBtn.addEventListener('click', () => {
            this.markAllComplete();
        });
        
        clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key cancels editing
            if (e.key === 'Escape' && this.editingTaskId) {
                this.cancelEdit();
            }
            
            // Ctrl/Cmd + K focuses search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Ctrl/Cmd + Enter adds new task
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                taskInput.focus();
            }
        });
    }

    addTask(text, priority = 'medium') {
        const task = {
            id: this.generateId(),
            text: text.trim(),
            completed: false,
            priority: priority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification('Task added successfully!', 'success');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            const message = task.completed ? 'Task completed!' : 'Task marked as pending';
            this.showNotification(message, task.completed ? 'success' : 'info');
        }
    }

    deleteTask(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('removing');
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
                this.showNotification('Task deleted', 'info');
            }, 300);
        }
    }

    editTask(taskId) {
        if (this.editingTaskId && this.editingTaskId !== taskId) {
            this.cancelEdit();
        }

        this.editingTaskId = taskId;
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        const task = this.tasks.find(t => t.id === taskId);
        
        if (taskElement && task) {
            taskElement.classList.add('editing');
            const editInput = taskElement.querySelector('.task-edit-input');
            editInput.value = task.text;
            editInput.focus();
            editInput.select();
        }
    }

    saveEdit(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        const task = this.tasks.find(t => t.id === taskId);
        const editInput = taskElement.querySelector('.task-edit-input');
        const newText = editInput.value.trim();

        if (newText && task && newText !== task.text) {
            task.text = newText;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.showNotification('Task updated successfully!', 'success');
        }

        this.cancelEdit();
        this.renderTasks();
        this.updateStats();
    }

    cancelEdit() {
        if (this.editingTaskId) {
            const taskElement = document.querySelector(`[data-task-id="${this.editingTaskId}"]`);
            if (taskElement) {
                taskElement.classList.remove('editing');
            }
            this.editingTaskId = null;
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.renderTasks();
    }

    markAllComplete() {
        const pendingTasks = this.tasks.filter(task => !task.completed);
        if (pendingTasks.length === 0) {
            this.showNotification('No pending tasks to complete', 'info');
            return;
        }

        pendingTasks.forEach(task => {
            task.completed = true;
            task.updatedAt = new Date().toISOString();
        });

        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification(`Marked ${pendingTasks.length} tasks as complete!`, 'success');
    }

    clearCompleted() {
        const completedTasks = this.tasks.filter(task => task.completed);
        if (completedTasks.length === 0) {
            this.showNotification('No completed tasks to clear', 'info');
            return;
        }

        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showNotification(`Cleared ${completedTasks.length} completed tasks`, 'success');
    }

    getFilteredTasks() {
        let filteredTasks = [...this.tasks];

        // Apply status filter
        switch (this.currentFilter) {
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            case 'pending':
                filteredTasks = filteredTasks.filter(task => !task.completed);
                break;
            default:
                // 'all' - no filtering needed
                break;
        }

        // Apply search filter
        if (this.searchQuery) {
            filteredTasks = filteredTasks.filter(task =>
                task.text.toLowerCase().includes(this.searchQuery)
            );
        }

        return filteredTasks;
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const noResultsState = document.getElementById('noResultsState');
        const filteredTasks = this.getFilteredTasks();

        // Hide all states initially
        emptyState.style.display = 'none';
        noResultsState.style.display = 'none';

        if (this.tasks.length === 0) {
            // No tasks at all
            taskList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        if (filteredTasks.length === 0) {
            // Tasks exist but none match current filter/search
            taskList.innerHTML = '';
            noResultsState.style.display = 'block';
            return;
        }

        // Render filtered tasks
        taskList.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
        this.bindTaskEvents();
    }

    renderTask(task) {
        const createdDate = new Date(task.createdAt);
        const updatedDate = new Date(task.updatedAt);
        const isUpdated = updatedDate.getTime() !== createdDate.getTime();
        
        const formattedCreatedDate = this.formatDate(createdDate);
        const formattedUpdatedDate = isUpdated ? this.formatDate(updatedDate) : null;

        const priorityColors = {
            high: 'high',
            medium: 'medium',
            low: 'low'
        };

        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}"></div>
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <input type="text" class="task-edit-input" value="${this.escapeHtml(task.text)}">
                    <div class="task-meta">
                        <div class="task-date">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Created ${formattedCreatedDate}
                            ${formattedUpdatedDate ? `• Updated ${formattedUpdatedDate}` : ''}
                        </div>
                        <div class="task-priority ${priorityColors[task.priority]}">
                            ${task.priority}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" data-task-id="${task.id}" title="Edit task">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="task-btn delete-btn" data-task-id="${task.id}" title="Delete task">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="task-edit-actions">
                    <button class="task-btn save-btn" data-task-id="${task.id}" title="Save changes">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="task-btn cancel-btn" data-task-id="${task.id}" title="Cancel editing">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </li>
        `;
    }

    bindTaskEvents() {
        // Checkbox events
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const taskId = e.target.dataset.taskId;
                this.toggleTask(taskId);
            });
        });

        // Edit button events
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-btn').dataset.taskId;
                this.editTask(taskId);
            });
        });

        // Delete button events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-btn').dataset.taskId;
                if (confirm('Are you sure you want to delete this task?')) {
                    this.deleteTask(taskId);
                }
            });
        });

        // Save button events
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-btn').dataset.taskId;
                this.saveEdit(taskId);
            });
        });

        // Cancel button events
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.cancelEdit();
            });
        });

        // Edit input events
        document.querySelectorAll('.task-edit-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const taskId = e.target.closest('.task-item').dataset.taskId;
                    this.saveEdit(taskId);
                } else if (e.key === 'Escape') {
                    this.cancelEdit();
                }
            });
        });
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;

        // Update hero stats
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;

        // Update filter counts
        document.getElementById('allCount').textContent = totalTasks;
        document.getElementById('pendingCount').textContent = pendingTasks;
        document.getElementById('completedCount').textContent = completedTasks;
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.remove('show');
            }, 500);
        }
    }

    formatDate(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveTasks() {
        try {
            localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Failed to save tasks:', error);
            this.showNotification('Failed to save tasks', 'error');
        }
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('taskflow_tasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.error('Failed to load tasks:', error);
            this.showNotification('Failed to load tasks', 'error');
            return [];
        }
    }

    saveTheme() {
        try {
            localStorage.setItem('taskflow_theme', this.theme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('taskflow_theme');
            return savedTheme || 'light';
        } catch (error) {
            console.error('Failed to load theme:', error);
            return 'light';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading overlay briefly for better UX
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
    
    // Initialize app
    setTimeout(() => {
        new TaskFlowApp();
    }, 100);
});

// Add some sample tasks for demonstration (only if no tasks exist)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const existingTasks = localStorage.getItem('taskflow_tasks');
        if (!existingTasks || JSON.parse(existingTasks).length === 0) {
            const sampleTasks = [
                {
                    id: 'sample-1',
                    text: 'Welcome to TaskFlow Pro! Click this checkbox to mark it complete.',
                    completed: false,
                    priority: 'high',
                    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
                    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
                },
                {
                    id: 'sample-2',
                    text: 'Try editing this task by clicking the edit button',
                    completed: false,
                    priority: 'medium',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
                    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
                },
                {
                    id: 'sample-3',
                    text: 'This is a completed task - great job!',
                    completed: true,
                    priority: 'low',
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() // Updated 1 hour ago
                }
            ];
            
            localStorage.setItem('taskflow_tasks', JSON.stringify(sampleTasks));
            // Re-initialize the app to show sample tasks
            setTimeout(() => {
                if (window.taskFlowApp) {
                    window.taskFlowApp.tasks = sampleTasks;
                    window.taskFlowApp.renderTasks();
                    window.taskFlowApp.updateStats();
                }
            }, 100);
        }
    }, 1000);
});