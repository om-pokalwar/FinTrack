import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex w-full bg-dark-900 relative overflow-hidden">
      {/* Background gradients for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-white">Fin</span><span className="text-brand-500">Track</span>
            </h1>
            <p className="text-gray-400">Manage your finances with premium clarity.</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-panel p-8"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
      
      {/* Optional: Right side decorative panel for large screens */}
      <div className="hidden lg:flex flex-1 relative bg-dark-800 border-l border-dark-700/50 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-50"></div>
        {/* Decorative elements can go here */}
        <div className="relative z-10 glass-panel p-10 max-w-md border-white/5 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold mb-4 text-white">Unlock Financial Insight</h2>
          <p className="text-gray-400 leading-relaxed">
            Experience the next generation of wealth management. FinTrack combines beautiful design with powerful analytics to give you complete control over your financial journey.
          </p>
        </div>
      </div>
    </div>
  );
}
