
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag } from 'lucide-react';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: "-50vh", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 150 } },
  exit: { y: "100vh", opacity: 0 },
};

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.due_date ? task.due_date.substring(0, 10) : '');
      setPriority(task.priority || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    
    const taskData = {
      title,
      description,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
    };
    onSave(taskData);
  };

  const priorityClasses = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-lg p-6 space-y-4 border shadow-xl rounded-2xl bg-slate-900/80 border-slate-700 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-100">{task ? 'Edit Task' : 'Add New Task'}</h3>
              <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-300">Title*</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Deploy the new feature" className="w-full mt-1 transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info" required />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 transition-colors duration-300 textarea bg-slate-800/50 border-slate-700 focus:border-info" placeholder="Add more details..."></textarea>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300"><Calendar size={16}/> Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full mt-1 transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300"><Flag size={16} /> Priority</label>
                  <div className="flex items-center gap-2 mt-2">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`w-full py-2 text-sm font-semibold capitalize transition-all duration-200 border rounded-lg ${priority === p ? priorityClasses[p] + ' scale-105' : 'text-slate-400 border-slate-700 hover:bg-slate-800'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <motion.button type="button" onClick={onClose} className="btn btn-ghost" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Cancel</motion.button>
                <motion.button type="submit" className="text-white btn btn-info bg-gradient-to-r from-cyan-500 to-blue-500" whileHover={{scale: 1.05, y: -2, backgroundPosition: 'right'}} whileTap={{scale: 0.95}} style={{backgroundSize: '200%'}}>
                  {task ? 'Save Changes' : 'Create Task'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;