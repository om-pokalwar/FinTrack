import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { budgetService } from '../services/budgets';
import { transactionService } from '../services/transactions';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const { addToast } = useToast();

  // Modal State
  const [editingBudget, setEditingBudget] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetData, txData] = await Promise.all([
        budgetService.getBudgets(currentMonth),
        transactionService.getTransactions() // In real app, filter tx by month from DB
      ]);
      setBudgets(budgetData);
      setTransactions(txData);
    } catch (error) {
      addToast('Failed to load budgets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    setSaving(true);
    try {
      await budgetService.upsertBudget({
        id: editingBudget?.id,
        category,
        amount: Number(amount),
        month: currentMonth
      });
      addToast('Budget saved', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      addToast(error.message || 'Error saving budget', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await budgetService.deleteBudget(id);
      addToast('Budget deleted', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  const openModal = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      setCategory(budget.category);
      setAmount(budget.amount.toString());
    } else {
      setEditingBudget(null);
      setCategory(CATEGORIES[0]);
      setAmount('');
    }
    setIsModalOpen(true);
  };

  // Process spending per category for current month
  const currentMonthTx = transactions.filter(t => t.type === 'expense' && t.date.startsWith(currentMonth));
  const spendingByCategory = currentMonthTx.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Budgets</h1>
          <p className="text-gray-400 mt-1">Manage limits for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.</p>
        </div>
        <Button onClick={() => openModal()} className="shrink-0">
          <Plus size={18} /> New Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <EmptyState title="No budgets set" description="Set up category budgets to track your spending limits." actionLabel="Create Budget" onAction={() => openModal()} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => {
            const spent = spendingByCategory[budget.category] || 0;
            const percentage = Math.min(100, (spent / budget.amount) * 100);
            const isExceeded = spent > budget.amount;
            const isWarning = percentage >= 80 && !isExceeded;

            return (
              <motion.div key={budget.id} variants={itemVariants}>
                <Card className="h-full relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center">
                        <Target size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{budget.category}</h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(budget)} className="text-gray-400 hover:text-white transition-colors p-1"><Edit2 size={16}/></button>
                      <button onClick={() => handleDelete(budget.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1"><Trash2 size={16}/></button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Spent: {formatCurrency(spent)}</span>
                      <span className="text-white font-medium">Limit: {formatCurrency(budget.amount)}</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${isExceeded ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-brand-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-500">{percentage.toFixed(0)}% used</div>
                  </div>

                  {isExceeded && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-2 rounded-lg">
                      <AlertTriangle size={16} /> Over budget by {formatCurrency(spent - budget.amount)}
                    </div>
                  )}
                  {isWarning && (
                    <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 p-2 rounded-lg">
                      <AlertTriangle size={16} /> Nearing budget limit
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBudget ? "Edit Budget" : "Set Budget"}>
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-gray-300 ml-1">Category</label>
            <select className="input-field appearance-none" value={category} onChange={(e) => setCategory(e.target.value)} required>
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
            </select>
          </div>
          <Input label="Monthly Limit" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={saving}>Save Budget</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
