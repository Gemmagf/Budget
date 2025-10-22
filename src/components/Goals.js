import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { goals } from '../data/goals';

const Goals = () => {
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
        <Target className="w-8 h-8 text-orange-600" />
        <h2 className="text-3xl font-bold text-gray-800">Objetivos Financieros</h2>
      </motion.div>
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-2 rounded-full ${goal.progress >= 100 ? 'bg-green-100' : 'bg-orange-100'}`}>
                {goal.progress >= 100 ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Target className="w-5 h-5 text-orange-600" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{goal.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Meta: ${goal.target} • Progreso: {goal.progress}% • Plazo: {goal.deadline}</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-2 font-medium">
                  <span>Actual: ${goal.current}</span>
                  <span>Restante: ${goal.target - goal.current}</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-blue-50 border border-blue-200 rounded-xl py-2 text-blue-700 font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
              {goal.progress < 100 ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {goal.progress < 100 ? 'Agregar Aporte' : '¡Completado!'}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Goals;