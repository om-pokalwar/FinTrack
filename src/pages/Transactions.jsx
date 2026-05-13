import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Trash2, Edit2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import TransactionModal from '../components/TransactionModal';
import { transactionService } from '../services/transactions';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Investments', 'Entertainment', 'Health', 'Other'];

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const { addToast } = useToast();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      addToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    if (!user) return;

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Re-fetch transactions seamlessly in the background
          transactionService.getTransactions().then(data => {
            setTransactions(data);
          }).catch(console.error);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await transactionService.deleteTransaction(id);
      addToast('Transaction deleted', 'success');
      fetchTransactions();
    } catch (error) {
      addToast('Failed to delete transaction', 'error');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-gray-400 mt-1">Manage your income and expenses.</p>
        </div>
        <Button 
          className="shrink-0" 
          onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }}
        >
          <Plus size={18} />
          Add Transaction
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all outline-none"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select 
                className="appearance-none bg-dark-900 border border-dark-600 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:border-brand-500 outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <select 
                className="appearance-none bg-dark-900 border border-dark-600 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:border-brand-500 outline-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState 
            title="No transactions found" 
            description={transactions.length === 0 ? "You haven't added any transactions yet." : "Try adjusting your filters or search term."}
            actionLabel={transactions.length === 0 ? "Add First Transaction" : null}
            onAction={() => { setEditingTransaction(null); setIsModalOpen(true); }}
          />
        ) : (
          <div className="overflow-x-auto">
            <motion.table 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full text-left border-collapse min-w-[600px]"
            >
              <thead>
                <tr className="border-b border-dark-700 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Transaction</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <motion.tr 
                    key={tx.id} 
                    variants={itemVariants}
                    className="border-b border-dark-700/50 hover:bg-dark-800/30 transition-colors group"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        </div>
                        <span className="font-medium text-white">{tx.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300 text-sm">{tx.category}</td>
                    <td className="py-4 text-gray-400 text-sm">{formatDate(tx.date)}</td>
                    <td className={`py-4 text-right font-medium ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingTransaction(tx); setIsModalOpen(true); }}
                          className="p-1.5 text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-md transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}
      </Card>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
        onSave={fetchTransactions}
      />
    </div>
  );
}
