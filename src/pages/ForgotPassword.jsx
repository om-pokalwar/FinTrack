import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  const { addToast } = useToast();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setIsSent(true);
      addToast('Password reset link sent!', 'success');
      
    } catch (err) {
      setError(err.message || 'An error occurred while sending reset email');
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="w-full text-center">
        <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={32} className="text-brand-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
        <p className="text-gray-400 text-sm mb-8">
          We've sent a password reset link to <span className="font-medium text-white">{email}</span>.
        </p>
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-gray-400 text-sm">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-gray-500" />
          </div>
          <Input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>

        <Button type="submit" className="w-full mt-6" isLoading={loading}>
          Send Reset Link
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-gray-400">
        Remember your password? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
