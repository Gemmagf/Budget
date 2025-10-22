import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { investments } from '../data/investments';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Investments = () => {
  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr'],
    datasets: [
      {
        label: 'Crecimiento',
        data: [5000, 5100, 5250, 5400],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: false }
    }
  };

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
        <TrendingUp className="w-8 h-8 text-green-600" />
        <h2 className="text-3xl font-bold text-gray-800">Inversiones</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {investments.map((investment, index) => (
          <motion.div
            key={investment.id}
            className={`rounded-2xl p-6 shadow-md border border-gray-200 ${investment.growth > 0 ? 'bg-green-50' : 'bg-red-50'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{investment.name}</h3>
              <div className={`p-2 rounded-full ${investment.growth > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {investment.growth > 0 ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">${investment.amount}</p>
            <p className="text-sm text-gray-600 mb-3">Proyectado: ${investment.projected}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${investment.growth > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, Math.abs(investment.growth * 10))}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl font-semibold mb-4">Gráfico de Crecimiento</h3>
        <Line data={chartData} options={options} />
      </motion.div>
    </motion.div>
  );
};

export default Investments;