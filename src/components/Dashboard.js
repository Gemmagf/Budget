import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, Target } from 'lucide-react';
import { expenseCategories, investments, familyMembers, goals } from '../data';

const Dashboard = () => {
  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.total, 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalGoalsProgress = Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);

  const stats = [
    { icon: DollarSign, label: 'Gastos Totales', value: `$${totalExpenses}`, color: 'red' },
    { icon: Users, label: 'Miembros Familia', value: familyMembers.length, color: 'blue' },
    { icon: TrendingUp, label: 'Inversiones', value: `$${totalInvestments}`, color: 'green' },
    { icon: Target, label: 'Progreso Objetivos', value: `${totalGoalsProgress}%`, color: 'orange' }
  ];

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        Resumen Presupuesto Familiar
      </motion.h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`bg-white rounded-2xl p-6 shadow-md border border-${stat.color}-200`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-lg text-gray-600 mb-8">¡Todo bajo control! Explora las secciones para detalles.</p>
        <div className="flex justify-center gap-4">
          <motion.button 
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Gastos
          </motion.button>
          <motion.button 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Objetivos
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;