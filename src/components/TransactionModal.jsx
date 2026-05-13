import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { transactionService } from '../services/transactions';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Bills', 'Salary', 'Investments', 'Entertainment', 'Health', 'Other'
];

export default function TransactionModal({ isOpen, onClose, transactionToEdit, onSave }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(Math.abs(transactionToEdit.amount).toString());
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
    } else {
      resetForm();
    }
  }, [transactionToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setCategory(CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;

    setLoading(true);
    
    // Format amount based on type
    const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

    const transactionData = {
      title,
      amount: finalAmount,
      type,
      category,
      date
    };

    try {
      if (transactionToEdit) {
        await transactionService.updateTransaction(transactionToEdit.id, transactionData);
        addToast('Transaction updated successfully', 'success');
      } else {
        await transactionService.createTransaction(transactionData);
        addToast('Transaction created successfully', 'success');
      }
      onSave();
      onClose();
    } catch (error) {
      addToast(error.message || 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={transactionToEdit ? "Edit Transaction" : "Add Transaction"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 p-1 bg-dark-900 rounded-lg border border-dark-600/50 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === 'expense' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setType('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setType('income')}
          >
            Income
          </button>
        </div>

        <Input 
          label="Title" 
          placeholder="e.g., Groceries, Salary" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <Input 
          label="Amount" 
          type="number" 
          step="0.01"
          min="0"
          placeholder="0.00" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-300 ml-1">Category</label>
          <select 
            className="input-field appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} className="bg-dark-900">{c}</option>
            ))}
          </select>
        </div>

        <Input 
          label="Date" 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={loading}>
            {transactionToEdit ? "Save Changes" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
