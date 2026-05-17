import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { transactionService } from '../services/transactions';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const COLORS = ['#6875f5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionService.getTransactions();
        setTransactions(data);
      } catch (error) {
        addToast('Failed to load analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [addToast]);

  // Data processing
  const monthlyDataMap = transactions.reduce((acc, curr) => {
    const date = new Date(curr.date);
    const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0, savings: 0 };
    
    if (curr.type === 'income') acc[month].income += curr.amount;
    if (curr.type === 'expense') acc[month].expense += Math.abs(curr.amount);
    
    acc[month].savings = acc[month].income - acc[month].expense;
    return acc;
  }, {});

  const monthlyTrendData = Object.values(monthlyDataMap).reverse();

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
      return acc;
    }, {});
    
  const categoryPieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  })).sort((a, b) => b.value - a.value);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-gray-400 mt-1">Deep dive into your financial metrics.</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()} className="shrink-0 print:hidden">
          Export as PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block">
        {/* Income vs Expense Over Time */}
        <motion.div variants={itemVariants}>
          <Card className="h-[400px] flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6">Income vs Expense</h2>
            <div className="flex-1 w-full h-full">
              {monthlyTrendData.length === 0 ? <EmptyState title="No data" description="Add transactions to see analytics." /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2f42" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#161925', borderColor: '#2a2f42', borderRadius: '8px' }} formatter={(val) => formatCurrency(val)} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants}>
          <Card className="h-[400px] flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6">Category Breakdown</h2>
            <div className="flex-1 w-full h-full">
              {categoryPieData.length === 0 ? <EmptyState title="No expenses" description="Your expense breakdown will appear here." /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#161925', borderColor: '#2a2f42', borderRadius: '8px' }} formatter={(val) => formatCurrency(val)} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Savings Growth */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-[400px] flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6">Savings Growth Trend</h2>
            <div className="flex-1 w-full h-full">
              {monthlyTrendData.length === 0 ? <EmptyState title="No data" description="Start tracking income and expenses to see savings." /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2f42" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#161925', borderColor: '#2a2f42', borderRadius: '8px' }} formatter={(val) => formatCurrency(val)} />
                    <Area type="monotone" dataKey="savings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" name="Net Savings" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
