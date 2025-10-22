import React from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Users } from 'lucide-react';
import { familyMembers } from '../data/familyMembers';

const MemberList = () => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
      >
        <Users className="w-8 h-8 text-blue-600" />
        Miembros de la Familia
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {familyMembers.map((member, index) => (
          <motion.div
            key={member.id}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-2xl">{member.avatar}</span>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">{member.name}</h3>
            <p className="text-gray-600 text-sm text-center mb-4">{member.role}</p>
            <div className="flex items-center justify-center gap-2 text-xs bg-green-50 px-3 py-1 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Presupuesto: {member.budgetAllocation}%</span>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Edit className="w-4 h-4" />
              Editar
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MemberList;