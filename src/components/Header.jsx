// src/components/Header.jsx

import React from 'react';
import { LogOut, Sun, Moon, Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="sticky z-50 max-w-6xl p-2 mx-auto border shadow-lg top-4 navbar bg-base-100/70 backdrop-blur-md rounded-2xl border-base-300/50"
    >
      <div className="flex-1">
        {/* PURANE TEXT KI JAGAH YEH NAHI LINE LIKHEIN */}
        <Link to="/" className="flex items-center gap-3 ml-5">
          <Logo size={32} />
          <span className="text-xl font-bold normal-case text-slate-100">Smart To-Do</span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        <motion.button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <motion.button
          className="btn btn-ghost btn-circle"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="indicator">
            <Bell className="w-6 h-6" />
            <span className="badge badge-sm badge-primary indicator-item">3</span>
          </div>
        </motion.button>

        <div className="dropdown dropdown-end">
          <motion.label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-10 rounded-full bg-primary text-primary-content">
              {/* CHANGE 1: Yahan user.username use ho raha hai */}
              <span className="text-xl">{user && user.username ? user.username[0].toUpperCase() : <User />}</span>
            </div>
          </motion.label>
          <ul tabIndex={0} className="p-2 mt-3 border shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 border-base-300/50">
            {/* CHANGE 2: Aur yahan bhi user.username use ho raha hai */}
            <li className="p-2 font-semibold truncate">{user ? user.username : 'Guest'}</li>
            <div className="my-0 divider"></div>
            <li>
              <a onClick={logout}>
                <LogOut className="w-5 h-5" />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;