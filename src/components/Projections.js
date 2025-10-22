import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { projections } from '../data/projections';

const Projections = () => {
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
        <Calendar className="w-8 h-8 text-purple-600" />
        <h2 className="text-3xl font-bold text-gray-800">Proyecciones Futuras</h2>
      </motion.div>
      <div className="space-y-4">
        {projections.map((projection, index) => (
          <motion.div
            key={projection.month}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{projection.month}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Balance: ${projection.projectedBalance}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-green-600 font-semibold">Ingresos: ${projection.income}</p>
                <p className="text-sm text-green-600">Ingresos</p>
              </div>
              <div>
                <p className="text-red-600 font-semibold">Gastos: ${projection.expenses}</p>
                <p className="text-sm text-red-600">Gastos</p>
              </div>
              <div>
                <p className="text-blue-600 font-semibold">Ahorros: ${projection.savings}</p>
                <p className="text-sm text-blue-600">Ahorros</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Projections;