import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingDown, Target, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import Card from './Card';
import { formatCurrency } from '../utils/formatters';

export default function AIInsights({ transactions = [], budgets = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate dynamic insights
  const generateInsights = () => {
    const insights = [];
    
    // Total spent this month
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
      
    const totalBudget = budgets.reduce((acc, curr) => acc + curr.amount, 0);

    if (totalBudget > 0) {
      const budgetUsage = (monthlyExpenses / totalBudget) * 100;
      if (budgetUsage > 80) {
        insights.push({
          id: 'budget_warn',
          type: 'warning',
          icon: TrendingDown,
          title: 'Budget Optimization',
          description: `You've used ${budgetUsage.toFixed(0)}% of your monthly budget. Consider reducing discretionary spending this week to stay on track.`,
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10'
        });
      } else {
        insights.push({
          id: 'budget_good',
          type: 'success',
          icon: ShieldCheck,
          title: 'Great Pacing!',
          description: `You've only spent ${budgetUsage.toFixed(0)}% of your budget. You're on track to save ${formatCurrency(totalBudget - monthlyExpenses)} this month.`,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10'
        });
      }
    }

    // Category analysis
    const categories = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
        return acc;
      }, {});

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > 0) {
      insights.push({
        id: 'category_insight',
        type: 'info',
        icon: Target,
        title: 'Spending Highlight',
        description: `Your highest expense this month is ${topCategory[0]} (${formatCurrency(topCategory[1])}). Setting a specific budget for this could boost your savings.`,
        color: 'text-brand-400',
        bg: 'bg-brand-500/10'
      });
    }
    
    // Default insight if none generated
    if (insights.length === 0) {
      insights.push({
        id: 'welcome',
        type: 'info',
        icon: Sparkles,
        title: 'AI Financial Assistant',
        description: 'Add more transactions and set up budgets to receive personalized AI recommendations.',
        color: 'text-brand-400',
        bg: 'bg-brand-500/10'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const nextInsight = () => setCurrentIndex((prev) => (prev + 1) % insights.length);
  const prevInsight = () => setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);

  // Auto rotate insights
  useEffect(() => {
    const timer = setInterval(nextInsight, 8000);
    return () => clearInterval(timer);
  }, [insights.length]);

  if (insights.length === 0) return null;

  const currentInsight = insights[currentIndex];

  return (
    <Card className="relative overflow-hidden group bg-gradient-to-br from-dark-800 to-dark-900 border-brand-500/20">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sparkles size={100} />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-brand-400" />
        <h3 className="text-sm font-medium text-brand-400 uppercase tracking-wider">AI Insight</h3>
      </div>

      <div className="min-h-[80px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentInsight.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-4"
          >
            <div className={`p-3 rounded-xl shrink-0 ${currentInsight.bg} ${currentInsight.color}`}>
              <currentInsight.icon size={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">{currentInsight.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {currentInsight.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {insights.length > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-700/50">
          <div className="flex gap-1">
            {insights.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-brand-500' : 'w-1 bg-dark-600'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prevInsight} className="p-1 rounded bg-dark-800 hover:bg-dark-700 text-gray-400 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextInsight} className="p-1 rounded bg-dark-800 hover:bg-dark-700 text-gray-400 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
