
import React from 'react';
import TaskItem from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardX } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Har task ke beech 0.08s ka delay
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TaskList = ({ tasks, onUpdate, onDelete, onEdit }) => {
  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' }}
        className="flex flex-col items-center justify-center gap-4 p-8 mt-6 text-center border-2 border-dashed rounded-xl border-slate-700"
      >
        <ClipboardX className="w-16 h-16 text-slate-600" />
        <h3 className="text-xl font-semibold text-slate-300">No Tasks Found!</h3>
        <p className="text-slate-500">Looks like it's a clear day. Add a new task to get started.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-6 space-y-3" // Thodi spacing add ki hai
    >
      <AnimatePresence>
        {tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onEdit={onEdit}
            variants={itemVariants} // Animation variants ko pass kiya
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;