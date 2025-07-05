import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LearnerLogin from './pages/LearnerLogin';
import TrainerLogin from './pages/TrainerLogin';
import CreateAccount from './pages/CreateAccount';
import FeedbackForm from './pages/FeedbackForm';
import ThankYou from './pages/ThankYou';
import TrainerDashboard from './pages/TrainerDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learner-login" element={<LearnerLogin />} />
            <Route path="/trainer-login" element={<TrainerLogin />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/dashboard" element={<TrainerDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;