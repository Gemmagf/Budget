import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, PieChart } from 'lucide-react';
import { expenseCategories } from '../data/expenses';

const ExpenseCategories = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        <PieChart className="w-8 h-8 text-red-600" />
        <h2 className="text-3xl font-bold text-gray-800">Gastos por Categorías</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {expenseCategories.map((category, index) => (
          <motion.div
            key={category.id}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-2xl font-bold text-red-600">${category.total}</p>
              </div>
            </div>
            {activeCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-2 ml-3"
              >
                {category.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    <span>${item.amount}</span>
                  </div>
                ))}
              </motion.div>
            )}
            <button className="mt-4 w-full bg-green-50 border border-green-200 rounded-xl py-2 text-green-700 font-medium hover:bg-green-100 transition-colors">
              <Plus className="w-4 h-4 inline mr-2" /> Agregar Gasto
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExpenseCategories;