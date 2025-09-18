// src/components/TaskItem.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Calendar, Flag } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TaskItem = ({ task, onUpdate, onDelete, onEdit, variants }) => {

  const handleStatusChange = (e) => {
    onUpdate(task.id, { status: e.target.checked ? 'completed' : 'pending' });
  };

  return (
    <motion.div
      layout
      variants={variants || itemVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
      // YAHAN CHANGE KIYA GAYA HAI
      className={`mb-3 transition-shadow duration-300 border shadow-md rounded-xl bg-slate-900/60  backdrop-blur-sm hover:shadow-lg border-l-4 ${
        task.priority === 'high' ? 'border-red-500/70' :
        task.priority === 'medium' ? 'border-yellow-500/70' :
        'border-blue-500/70'
      }`}
    >
      <div className="flex items-start gap-4 p-4">
        <div className="flex items-center h-full pt-1">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={task.status === 'completed'}
            onChange={handleStatusChange}
          />
        </div>
        <div className="flex-grow">
          <h3 className={`font-semibold text-lg text-slate-100 ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && <p className="mt-1 text-sm text-slate-400">{task.description}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
            {task.due_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {formatDate(task.due_date)}
              </span>
            )}
             <span className="flex items-center gap-1.5 capitalize">
                <Flag size={14} /> {task.priority} Priority
              </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <button onClick={() => onEdit(task)} className="p-2 transition-colors rounded-full hover:bg-slate-700 text-slate-400 hover:text-white">
            <Edit size={16} />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-2 transition-colors rounded-full hover:bg-slate-700 text-slate-400 hover:text-error">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;