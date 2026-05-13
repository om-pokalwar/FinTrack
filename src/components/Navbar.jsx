import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-20 bg-dark-900/80 backdrop-blur-md border-b border-dark-700/50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden sm:flex items-center bg-dark-800 border border-dark-700 rounded-full px-4 py-2 w-64 focus-within:border-brand-500/50 focus-within:ring-1 focus-within:ring-brand-500/50 transition-all">
            <Search size={18} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-brand-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-200">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-brand-500/20 ring-2 ring-dark-700">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
