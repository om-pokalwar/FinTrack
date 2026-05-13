import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Zap, BarChart3, Star, CreditCard, ChevronRight } from 'lucide-react';
import Button from '../components/Button';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-dark-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-white">Fin</span><span className="text-brand-500">Track</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link to="/signup">
              <Button className="!py-2 !px-4 text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Ambient Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                FinTrack 2.0 is now live
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                Control your wealth with <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">
                  absolute clarity.
                </span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                The premium financial dashboard designed for modern professionals. Track expenses, optimize investments, and achieve financial freedom effortlessly.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button className="!px-8 !py-4 text-lg w-full sm:w-auto">
                    Get Started <ArrowRight size={20} />
                  </Button>
                </Link>
                <Button variant="secondary" className="!px-8 !py-4 text-lg w-full sm:w-auto">
                  View Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="relative max-w-7xl mx-auto px-6 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0 }}
            className="rounded-2xl border border-white/10 bg-dark-800/50 p-2 sm:p-4 shadow-2xl backdrop-blur-sm relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10 bottom-0 h-1/3 pointer-events-none rounded-2xl" />
            
            {/* Mockup Frame */}
            <div className="rounded-xl overflow-hidden border border-white/5 bg-dark-900 aspect-[16/10] md:aspect-[16/9] flex flex-col relative">
              {/* Header mockup */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-dark-800/80">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              {/* Body mockup content */}
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-0">
                <div className="col-span-2 space-y-4">
                  <div className="h-32 bg-dark-800/50 rounded-xl border border-white/5 flex items-center px-6">
                    <div>
                      <div className="h-4 w-24 bg-dark-700 rounded mb-3" />
                      <div className="h-8 w-48 bg-brand-500/20 rounded" />
                    </div>
                  </div>
                  <div className="h-64 bg-dark-800/50 rounded-xl border border-white/5" />
                </div>
                <div className="space-y-4">
                  <div className="h-48 bg-dark-800/50 rounded-xl border border-white/5" />
                  <div className="h-48 bg-dark-800/50 rounded-xl border border-white/5" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-dark-800/20 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, <br/><span className="text-brand-400">nothing you don't.</span></h2>
              <p className="text-gray-400">Streamlined features designed to give you total control without the clutter.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BarChart3, title: "Real-time Analytics", desc: "Watch your net worth grow with instant syncing across all your bank accounts and assets." },
                { icon: Shield, title: "Bank-grade Security", desc: "Your data is encrypted with AES-256 and never sold to third parties. Total privacy." },
                { icon: Zap, title: "Smart Categorization", desc: "Our AI automatically categorizes your transactions with 99% accuracy." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-8"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6">
                    <feature.icon className="text-brand-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Connect once, <br/>track forever.</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  FinTrack integrates seamlessly with over 10,000 financial institutions globally. Link your accounts in seconds and let our system do the heavy lifting.
                </p>
                <ul className="space-y-4">
                  {[
                    "Unified view of checking, savings, and credit",
                    "Automated daily balance updates",
                    "Customized budget tracking and alerts"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="text-brand-500 shrink-0" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 blur-3xl rounded-full" />
                <div className="glass-panel p-8 relative z-10 grid gap-4 border-white/10">
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CreditCard className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Chase Sapphire</p>
                        <p className="text-xs text-gray-500">Connected</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Synced just now</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <BarChart3 className="text-orange-400" size={20} />
                      </div>
                      <div>
                        <p className="font-medium">Robinhood Portfolio</p>
                        <p className="text-xs text-gray-500">Connected</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">Synced 2m ago</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-dark-800/20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Trusted by professionals</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Sarah J.", role: "Software Engineer", quote: "FinTrack completely changed how I view my money. The UI is gorgeous and it actually makes budgeting enjoyable." },
                { name: "Michael T.", role: "Startup Founder", quote: "I've tried every finance app out there. FinTrack is the only one that doesn't feel cluttered or overwhelming." },
                { name: "Elena R.", role: "Freelance Designer", quote: "The categorization is spooky good. It saves me hours every month when preparing my tax deductions." }
              ].map((t, i) => (
                <div key={i} className="glass-panel p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-brand-400 text-brand-400" />)}
                    </div>
                    <p className="text-gray-300 italic mb-6 leading-relaxed">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-gray-400">Start for free, upgrade when you need more power.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Tier */}
              <div className="glass-panel p-8 border-white/5">
                <h3 className="text-2xl font-semibold mb-2">Starter</h3>
                <p className="text-gray-400 mb-6">Perfect for getting your finances in order.</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["2 Bank connections", "Basic budgeting", "30-day transaction history"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 size={18} className="text-gray-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button variant="secondary" className="w-full">Start Free</Button>
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="glass-panel p-8 border-brand-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-500 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">
                  POPULAR
                </div>
                <div className="absolute inset-0 bg-brand-500/5 pointer-events-none" />
                <h3 className="text-2xl font-semibold mb-2 text-brand-400">Pro</h3>
                <p className="text-gray-400 mb-6">For advanced wealth management.</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$12</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited connections", "Advanced AI categorizing", "Unlimited history", "Priority support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 size={18} className="text-brand-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button className="w-full">Get Pro</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-600/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50" />
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to take control?</h2>
            <p className="text-xl text-gray-400 mb-10">Join thousands of users who are already managing their wealth better with FinTrack.</p>
            <Link to="/signup">
              <Button className="!px-8 !py-4 text-lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-dark-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-white">Fin</span><span className="text-brand-500">Track</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">© 2026 FinTrack Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
