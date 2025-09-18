import React, { useState, useMemo, useEffect } from 'react';
import { Plus, CheckCheck, Trash } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import FilterBar from '../components/FilterBar';
import ChartPanel from '../components/ChartPanel';
import { useNotifications } from '../hooks/useNotifications';
import { getUpcomingTasks } from '../utils/helpers';
import { motion } from 'framer-motion';
import { ListTodo, CheckCircle, Clock, Bell } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

const priorityOrder = { high: 1, medium: 2, low: 3 };

const Dashboard = () => {
  const { tasks, addTask, updateTask, deleteTask, stats, deleteCompletedTasks, markAllAsComplete } = useTasks();
  const { requestPermission, showNotification } = useNotifications();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  // State for filtering and sorting
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [sort, setSort] = useState('created_at'); // created_at, priority, due_date
  const [searchTerm, setSearchTerm] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Check for upcoming tasks on load
  useEffect(() => {
    const upcoming = getUpcomingTasks(tasks);
    if (upcoming.length > 0) {
      const taskTitles = upcoming.map(t => t.title).join(', ');
      // Request permission and show notification
      requestPermission().then(perm => {
        if (perm === 'granted') {
          showNotification('Upcoming Tasks!', {
            body: `You have tasks due soon: ${taskTitles}`,
          });
        }
      });
    }
  }, [tasks, requestPermission, showNotification]);

  // Memoized filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesFilter = filter === 'all' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === 'priority') {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (sort === 'due_date') {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        }
        // Default sort by created_at descending
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [tasks, filter, sort, searchTerm]);

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    closeModal();
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleSimulateEndOfDay = () => {
    if (stats.pending > 0) {
      showNotification('End of Day Reminder', {
        body: `You still have ${stats.pending} pending tasks. Don't forget to complete them!`,
      });
    } else {
      showNotification('All Done!', {
        body: 'Great job! You have no pending tasks.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container p-4 mx-auto lg:p-8">
        {/* Top Action Bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dynamic Greeting aur Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-between gap-4 mt-8 mb-8 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold ">
                {`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}`}!
              </h1>
              <p className="mt-1 text-slate-400">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => openModal()}
                className="btn btn-primary bg-gradient-to-r from-cyan-500 to-blue-500"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={18} /> Add New Task
              </motion.button>

              {/* Bulk actions ab ek clean dropdown mein hain */}
              <div className="dropdown dropdown-end">
                <motion.button tabIndex={0} className="btn btn-ghost btn-circle" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <MoreVertical size={20} />
                </motion.button>
                <ul tabIndex={0} className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52">
                  <li><a onClick={markAllAsComplete}><CheckCheck size={16} /> Mark All Complete</a></li>
                  <li><a onClick={deleteCompletedTasks}><Trash size={16} /> Delete Completed</a></li>
                  <li><a onClick={handleSimulateEndOfDay}><Bell size={16} /> Day-end Reminder</a></li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Naye, Custom-designed Stat Cards */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)' }} className="p-5 overflow-hidden border rounded-xl bg-slate-900/70 border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <ListTodo className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-100">{stats.total}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)' }} className="p-5 overflow-hidden border rounded-xl bg-slate-900/70 border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-warning/20">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="text-3xl font-bold text-slate-100">{stats.pending}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)' }} className="p-5 overflow-hidden border rounded-xl bg-slate-900/70 border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-success/20">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Completed</p>
                  <p className="text-3xl font-bold text-slate-100">{stats.completed}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <FilterBar
          filter={filter} setFilter={setFilter}
          sort={sort} setSort={setSort}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        />

        <TaskList
          tasks={filteredTasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onEdit={openModal}
        />

        <ChartPanel />

        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveTask}
          task={editingTask}
        />
      </main>
    </div>
  );
};

export default Dashboard;