import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, MessageSquare } from 'lucide-react';

const ThankYou = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('vinsys_current_user') || 'null');
    if (currentUser?.name) {
      setUserName(currentUser.name);
    }

    // Optional: Clear feedback draft if stored
    localStorage.removeItem('last_submitted_feedback');
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You{userName && `, ${userName}`}!</h1>
          <p className="text-lg text-slate-600 mb-6">
            Your feedback has been successfully submitted. We appreciate you taking the time to share your experience with us.
          </p>
          <p className="text-slate-500 mb-8">
            Your insights help us continuously improve our training programs and deliver better learning experiences.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-lg font-semibold text-slate-800">Feedback Submitted</span>
          </div>
          <p className="text-slate-600">
            Our training team will review your feedback and use it to enhance future training sessions.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium inline-block"
          >
            <Home className="h-5 w-5 inline mr-2" />
            Return to Home
          </Link>

          <Link
            to="/feedback"
            className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors font-medium inline-block"
          >
            Submit Another Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
