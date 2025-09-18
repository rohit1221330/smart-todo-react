// src/pages/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, transform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ClipboardCheck } from 'lucide-react';
import { useMousePosition } from '../hooks/useMousePosition'; // Naya hook import karein

// Animation variants ko aur smooth kiya gaya hai
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  // Mouse position ko track karne ke liye
  const { x, y } = useMousePosition();
  const smoothMouseX = useSpring(0, { damping: 25, stiffness: 400 });
  const smoothMouseY = useSpring(0, { damping: 25, stiffness: 400 });
  
  React.useEffect(() => {
    smoothMouseX.set(x);
    smoothMouseY.set(y);
  }, [x, y, smoothMouseX, smoothMouseY]);


  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username: email, password: password });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 aurora-background">
      {/* Mouse-Following Glow Effect */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(0, 128, 255, 0.2), transparent 60%)',
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-70%',
          translateY: '-50%',
        }}
      />

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ type: 'easeOut', duration: 0.4 }}
        whileHover={{ y: -8, boxShadow: '0 25px 30px -10px rgba(0, 0, 0, 0.4), 0 15px 15px -10px rgba(0, 0, 0, 0.3)' }}
        className="relative z-10 w-full max-w-md p-8 space-y-6 overflow-hidden border shadow-xl rounded-2xl bg-slate-900/70 border-slate-700 backdrop-blur-md"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center space-y-2">
           <div className="p-3 border rounded-full border-slate-700 bg-slate-800/50">
             <ClipboardCheck className="w-8 h-8 text-info" />
           </div>
           <h1 className="text-3xl font-bold text-center text-slate-100">Log In</h1>
           <p className="text-center text-slate-400">Welcome back, please enter your details.</p>
        </motion.div>
        
        {/* Error message ko bhi thoda smooth kiya hai */}
        <AnimatePresence>
            {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center shadow-lg alert alert-error">
                <div><span>{error}</span></div>
            </motion.div>
            )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-200" />
              <input type="email" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 text-white transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info" required />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-200" />
              <input type={showPassword ? 'text' : 'password'} placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 text-white transition-colors duration-300 input bg-slate-800/50 border-slate-700 focus:border-info" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute -translate-y-1/2 btn btn-ghost btn-sm btn-circle right-2 top-1/2">{showPassword ? <EyeOff size={18} className="text-slate-500"/> : <Eye size={18} className="text-slate-500"/>}</button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button whileHover={{ scale: 1.05, y: -2, backgroundPosition: 'right' }} whileTap={{ scale: 0.95 }} type="submit" className={`btn btn-info w-full text-white ${loading ? 'loading' : ''} bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500`} style={{backgroundSize: '200%'}} disabled={loading}>
              Log In
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="text-sm text-center text-slate-400">
            No account? <Link to="/signup" className="font-semibold text-info hover:underline">Sign up</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;