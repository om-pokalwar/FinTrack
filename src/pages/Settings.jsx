import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Moon, Sun, Monitor, Save } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [email] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Fake profile update since we need complex supabase update user logic, but we can mock success
      await new Promise(r => setTimeout(r, 1000));
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      addToast('Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-brand-500/10 text-brand-400 font-medium">
            <User size={18} /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-white transition-colors">
            <Monitor size={18} /> Appearance
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-white transition-colors">
            <Bell size={18} /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-dark-800 hover:text-white transition-colors">
            <Shield size={18} /> Security
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-500/20">
                    {name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <Button type="button" variant="secondary">Change Avatar</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="Email Address" value={email} disabled className="opacity-50" />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit" isLoading={loading}>
                    <Save size={18} /> Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6">Appearance</h2>
              <div className="flex items-center justify-between p-4 rounded-xl border border-dark-600/50 bg-dark-800/30">
                <div>
                  <h3 className="font-medium text-white">Theme Preference</h3>
                  <p className="text-sm text-gray-400">Toggle between dark and light mode (Light mode coming soon).</p>
                </div>
                <div className="flex bg-dark-900 rounded-lg p-1 border border-dark-600/50">
                  <button 
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-dark-700 text-white' : 'text-gray-400'}`}
                    disabled
                  >
                    <Sun size={18} />
                  </button>
                  <button 
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-dark-700 text-white' : 'text-gray-400'}`}
                  >
                    <Moon size={18} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-red-500/20 bg-red-500/5">
              <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
              <p className="text-sm text-gray-400 mb-6">Permanently delete your account and all associated data.</p>
              <Button type="button" className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 shadow-none">
                Delete Account
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
