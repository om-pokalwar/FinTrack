import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, PieChart, ArrowRightLeft, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import { Target, FileText } from 'lucide-react'; // I'll just import them directly in the file

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Budgets', path: '/budgets', icon: Target },
  { name: 'Taxes', path: '/taxes', icon: FileText },
  { name: 'Cards', path: '/cards', icon: CreditCard },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-dark-900 border-r border-dark-700/50 w-64 pt-6 pb-4 px-4 shadow-2xl z-40">
      <div className="flex items-center justify-between mb-8 px-2">
        <h1 className="text-2xl font-bold">
          <span className="text-white">Fin</span><span className="text-brand-500">Track</span>
        </h1>
        <button 
          className="lg:hidden text-gray-400 hover:text-white" 
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'
              }`
            }
          >
            <item.icon size={20} className="stroke-[1.5]" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-dark-700/50">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium"
        >
          <LogOut size={20} className="stroke-[1.5]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-40 lg:hidden"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 z-20">
        <div className="fixed inset-y-0 left-0">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
