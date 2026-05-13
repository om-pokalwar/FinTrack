import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Plus, FileText, Trash2, Edit2, Calculator } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { taxService } from '../services/taxes';
import { transactionService } from '../services/transactions';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const DEDUCTION_CATEGORIES = ['Office Supplies', 'Travel', 'Software', 'Meals', 'Health Insurance', 'Other'];

export default function Taxes() {
  const [deductions, setDeductions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  const { addToast } = useToast();

  // Modal State
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(DEDUCTION_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deductionsData, txData] = await Promise.all([
        taxService.getDeductions(currentYear),
        transactionService.getTransactions() // In real app, filter tx by year from DB
      ]);
      setDeductions(deductionsData);
      setTransactions(txData);
    } catch (error) {
      addToast('Failed to load tax data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentYear]);

  const handleSaveDeduction = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;
    setSaving(true);
    try {
      const deductionData = {
        title,
        amount: Number(amount),
        category,
        date,
        year: currentYear
      };

      if (editingDeduction) {
        await taxService.updateDeduction(editingDeduction.id, deductionData);
        addToast('Deduction updated', 'success');
      } else {
        await taxService.createDeduction(deductionData);
        addToast('Deduction added', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      addToast(error.message || 'Error saving deduction', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deduction?')) return;
    try {
      await taxService.deleteDeduction(id);
      addToast('Deduction deleted', 'success');
      fetchData();
    } catch (err) {
      addToast('Failed to delete', 'error');
    }
  };

  const openModal = (deduction = null) => {
    if (deduction) {
      setEditingDeduction(deduction);
      setTitle(deduction.title);
      setAmount(deduction.amount.toString());
      setCategory(deduction.category);
      setDate(deduction.date);
    } else {
      setEditingDeduction(null);
      setTitle('');
      setAmount('');
      setCategory(DEDUCTION_CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  // Tax calculations
  const totalIncome = transactions.filter(t => t.type === 'income' && t.date.startsWith(currentYear.toString())).reduce((acc, curr) => acc + curr.amount, 0);
  const totalDeductions = deductions.reduce((acc, curr) => acc + curr.amount, 0);
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  const estimatedTax = taxableIncome * 0.25; // Simple 25% flat rate for demo purposes

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Title,Category,Date,Amount\n"
      + deductions.map(d => `${d.title},${d.category},${d.date},${d.amount}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tax_Deductions_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Tax Management</h1>
          <p className="text-gray-400 mt-1">Estimations and deductions for {currentYear}.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleDownload} className="shrink-0">
            <Download size={18} /> Export Report
          </Button>
          <Button onClick={() => openModal()} className="shrink-0">
            <Plus size={18} /> Add Deduction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="glass-panel-hover">
            <p className="text-sm font-medium text-gray-400 mb-1">Gross Income</p>
            <h3 className="text-2xl font-bold text-white mb-2">{formatCurrency(totalIncome)}</h3>
            <p className="text-xs text-gray-500">Based on recorded transactions</p>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-panel-hover">
            <p className="text-sm font-medium text-gray-400 mb-1">Total Deductions</p>
            <h3 className="text-2xl font-bold text-brand-400 mb-2">{formatCurrency(totalDeductions)}</h3>
            <p className="text-xs text-gray-500">From {deductions.length} recorded items</p>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-panel-hover">
            <p className="text-sm font-medium text-gray-400 mb-1">Taxable Income</p>
            <h3 className="text-2xl font-bold text-white mb-2">{formatCurrency(taxableIncome)}</h3>
            <p className="text-xs text-gray-500">Income minus deductions</p>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-panel-hover border-brand-500/30 bg-brand-500/5">
            <p className="text-sm font-medium text-gray-400 mb-1 flex items-center gap-2"><Calculator size={14}/> Estimated Tax</p>
            <h3 className="text-2xl font-bold text-red-400 mb-2">{formatCurrency(estimatedTax)}</h3>
            <p className="text-xs text-brand-400/80">Estimated at 25% flat rate</p>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="pt-4">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Recorded Deductions</h2>
          {deductions.length === 0 ? (
            <EmptyState title="No deductions recorded" description="Start adding your tax deductible expenses." icon={FileText} actionLabel="Add Deduction" onAction={() => openModal()} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-dark-700 text-gray-400 text-sm">
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deductions.map((d) => (
                    <tr key={d.id} className="border-b border-dark-700/50 hover:bg-dark-800/30 transition-colors group">
                      <td className="py-4 font-medium text-white">{d.title}</td>
                      <td className="py-4 text-gray-300 text-sm">{d.category}</td>
                      <td className="py-4 text-gray-400 text-sm">{formatDate(d.date)}</td>
                      <td className="py-4 text-right font-medium text-brand-400">{formatCurrency(d.amount)}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(d)} className="p-1.5 text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-md"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(d.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDeduction ? "Edit Deduction" : "Add Deduction"}>
        <form onSubmit={handleSaveDeduction} className="space-y-4">
          <Input label="Description" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Office desk" />
          <Input label="Amount" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-gray-300 ml-1">Category</label>
            <select className="input-field appearance-none" value={category} onChange={(e) => setCategory(e.target.value)} required>
              {DEDUCTION_CATEGORIES.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
            </select>
          </div>
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={saving}>Save Deduction</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
