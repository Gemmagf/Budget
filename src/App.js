import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MemberList from './components/MemberList';
import ExpenseCategories from './components/ExpenseCategories';
import Investments from './components/Investments';
import Projections from './components/Projections';
import Goals from './components/Goals';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/expenses" element={<ExpenseCategories />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/projections" element={<Projections />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;