import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, Activity, Plus, Target } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import TransactionModal from '../components/TransactionModal';
import AIInsights from '../components/AIInsights';
import { transactionService } from '../services/transactions';
import { budgetService } from '../services/budgets';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const COLORS = ['#6875f5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7);
      const [txData, budgetData] = await Promise.all([
        transactionService.getTransactions(),
        budgetService.getBudgets(currentMonth)
      ]);
      setTransactions(txData);
      setBudgets(budgetData);
    } catch (error) {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = Math.abs(transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0));
  const totalBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : 0;
  const healthScore = Math.min(100, Math.max(0, 50 + (savingsRate * 0.5))); // arbitrary simple logic

  // Expense by category chart data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
      return acc;
    }, {});
    
  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  })).sort((a, b) => b.value - a.value);

  // Income vs Expense chart data
  const trendMap = transactions.reduce((acc, curr) => {
    const d = new Date(curr.date);
    const label = `${d.getMonth() + 1}/${d.getDate()}`; // short format
    if (!acc[label]) acc[label] = { date: label, income: 0, expense: 0 };
    if (curr.type === 'income') acc[label].income += curr.amount;
    if (curr.type === 'expense') acc[label].expense += Math.abs(curr.amount);
    return acc;
  }, {});

  let trendData = Object.values(trendMap).reverse().slice(-10); // last 10 days of activity
  if (trendData.length === 0) {
    trendData = [{ date: 'Today', income: 0, expense: 0 }];
  }

  const stats = [
    { title: 'Total Balance', amount: formatCurrency(totalBalance), icon: Wallet, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { title: 'Monthly Income', amount: formatCurrency(totalIncome), icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Monthly Expenses', amount: formatCurrency(totalExpense), icon: ArrowDownRight, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Savings Rate', amount: `${savingsRate}%`, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.5 } }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-400 mt-1">Here's your financial overview for today.</p>
        </div>
        <Button className="shrink-0" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          New Transaction
        </Button>
      </div>

      <motion.div variants={itemVariants} className="w-full">
        <AIInsights transactions={transactions} budgets={budgets} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="glass-panel-hover group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-400 group-hover:to-indigo-400 transition-all duration-300">
                    {stat.amount}
                  </h3>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Main Chart Area (Trend) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full min-h-[400px] flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Income vs Expense Trend</h2>
              <p className="text-sm text-gray-400">Your cash flow over recent active days</p>
            </div>
            <div className="flex-1 w-full h-[300px]">
              {transactions.length === 0 ? (
                <EmptyState title="No Chart Data" description="Add transactions to see your trends." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2f42" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161925', borderColor: '#2a2f42', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '14px' }}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Expense Breakdown Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card className="h-full min-h-[400px] flex flex-col">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-white">Expense Breakdown</h2>
              <p className="text-sm text-gray-400">Where your money goes</p>
            </div>
            <div className="flex-1 w-full h-[300px] flex items-center justify-center relative">
              {pieData.length === 0 ? (
                <EmptyState title="No Expenses" description="You have no expenses recorded." icon={Activity} />
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#161925', borderColor: '#2a2f42', borderRadius: '8px' }}
                        formatter={(value) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text for Pie Chart */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                    <span className="text-gray-400 text-xs">Total</span>
                    <span className="text-white font-bold text-lg">{formatCurrency(totalExpense)}</span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Health Score & Budget */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="text-lg font-semibold text-white mb-6">Financial Health</h2>
            
            <div className="flex flex-col items-center justify-center py-6 border-b border-dark-700/50 mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-dark-700" />
                  <circle 
                    cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - healthScore / 100)}
                    className="text-brand-500 transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{Math.round(healthScore)}</span>
                  <span className="text-xs text-gray-400">/ 100</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center px-4">
                {healthScore >= 70 ? "Great job! You are saving a healthy amount." : "Consider reducing expenses to boost your score."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-4">Budget Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Monthly Spending Limit</span>
                    <span className="text-white">75%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <div className="bg-brand-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <Button variant="ghost" onClick={() => window.location.href='/transactions'}>
                View All
              </Button>
            </div>
            
            {transactions.length === 0 ? (
              <EmptyState title="No recent activity" description="Your latest transactions will appear here." />
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-800/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tx.title}</p>
                        <p className="text-xs text-gray-500">{tx.category} • {formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchTransactions}
      />
    </motion.div>
  );
}
