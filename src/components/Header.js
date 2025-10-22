import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, TrendingUp, Target, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Users, label: 'Miembros', path: '/members' },
    { icon: DollarSign, label: 'Gastos', path: '/expenses' },
    { icon: TrendingUp, label: 'Inversiones', path: '/investments' },
    { icon: Target, label: 'Objetivos', path: '/goals' }
  ];

  return (
    <motion.header 
      className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <DollarSign className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              FamilyBudget
            </h1>
          </motion.div>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item, index) => (
              <Link 
                key={item.path} 
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-300 font-medium"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;