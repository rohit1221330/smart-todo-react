// src/pages/Signup.jsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useMousePosition } from '../hooks/useMousePosition';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 80,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 150 }
  },
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Custom error state for password mismatch
  const [formError, setFormError] = useState(null); 
  
  const { signup, loading, error: authError } = useAuth(); // Renamed to avoid conflict

  const { x, y } = useMousePosition();
  const smoothMouseX = useSpring(0, { damping: 25, stiffness: 400 });
  const smoothMouseY = useSpring(0, { damping: 25, stiffness: 400 });
  
  React.useEffect(() => {
    smoothMouseX.set(x);
    smoothMouseY.set(y);
  }, [x, y, smoothMouseX, smoothMouseY]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null); // Clear previous form errors
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match!");
      return;
    }
    signup({ username: email, password: password });
  };

  const displayError = formError || authError;

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 aurora-background">
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(0, 128, 255, 0.2), transparent 60%)',
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ type: 'easeOut', duration: 0.4 }}
        whileHover={{ y: -8, boxShadow: '0 25px 30px -10px rgba(0, 0, 0, 0.4), 0 15px 15px -10px rgba(0, 0, 0, 0.3)' }}
        className="relative z-10 w-full max-w-md p-8 space-y-4 overflow-hidden border shadow-xl rounded-2xl bg-slate-900/70 border-slate-700 backdrop-blur-md"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center space-y-2">
           <div className="p-3 border rounded-full border-slate-700 bg-slate-800/50">
             <UserPlus className="w-8 h-8 text-info" />
           </div>
           <h1 className="text-3xl font-bold text-center text-slate-100">Create Account</h1>
           <p className="text-center text-slate-400">Join us and start organizing your life.</p>
        </motion.div>
        
        <AnimatePresence>
            {displayError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center shadow-lg alert alert-error">
                <div><span>{displayError}</span></div>
            </motion.div>
            )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-500" />
              <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 text-white transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info" required />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-500" />
              <input placeholder='Enter your password' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 text-white transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute -translate-y-1/2 btn btn-ghost btn-sm btn-circle right-2 top-1/2">{showPassword ? <EyeOff size={18} className="text-slate-500"/> : <Eye size={18} className="text-slate-500"/>}</button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="relative mt-1">
              <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-500" />
              <input placeholder='Confirm your password' type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 text-white transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute -translate-y-1/2 btn btn-ghost btn-sm btn-circle right-2 top-1/2">{showConfirmPassword ? <EyeOff size={18} className="text-slate-500"/> : <Eye size={18} className="text-slate-500"/>}</button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button whileHover={{ scale: 1.05, y: -2, backgroundPosition: 'right' }} whileTap={{ scale: 0.95 }} type="submit" className={`btn btn-info w-full text-white ${loading ? 'loading' : ''} bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500`} style={{backgroundSize: '200%'}} disabled={loading}>
              Create Account
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="text-sm text-center text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-info hover:underline">Sign In</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;