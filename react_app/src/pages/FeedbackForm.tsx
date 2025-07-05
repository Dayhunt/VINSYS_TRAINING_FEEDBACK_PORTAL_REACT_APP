import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Star, MessageSquare } from 'lucide-react';

// ✅ Updated API URL
const API_BASE = 'https://eeycqc81wj.execute-api.us-west-2.amazonaws.com/prod';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: '',
    feedback: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('vinsys_current_user') || 'null');
    if (user) {
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.rating) newErrors.rating = 'Please select a rating';
    if (!formData.feedback.trim()) newErrors.feedback = 'Feedback is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const feedback = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rating: formData.rating,
      feedback: formData.feedback,
      submittedAt: new Date().toISOString(), // backend expects this
      studentId: currentUser?.id || null
    };

    try {
      const response = await fetch(`${API_BASE}/submit-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (response.ok) {
        navigate('/thank-you');
      } else {
        const errData = await response.json();
        alert('Submission failed: ' + (errData?.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error submitting feedback. Check your internet or API connection.');
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case '5': return 'text-green-500';
      case '4': return 'text-lime-500';
      case '3': return 'text-yellow-500';
      case '2': return 'text-orange-500';
      case '1': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Training Feedback</h2>
          <p className="text-slate-600">Your feedback helps us improve our training programs</p>
          {currentUser && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Welcome back, <span className="font-medium">{currentUser.name}</span>!
              </p>
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!!currentUser}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      currentUser ? 'bg-slate-50 text-slate-600' : ''
                    } ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!currentUser}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      currentUser ? 'bg-slate-50 text-slate-600' : ''
                    } ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Rating */}
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-slate-700 mb-2">Training Rating *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Star className={`h-5 w-5 ${getRatingColor(formData.rating)}`} />
                </div>
                <select
                  name="rating"
                  id="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rating ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select a rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              {errors.rating && <p className="mt-2 text-sm text-red-600">{errors.rating}</p>}
            </div>

            {/* Feedback */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-2">Your Feedback *</label>
              <textarea
                name="feedback"
                id="feedback"
                rows={5}
                value={formData.feedback}
                onChange={handleChange}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.feedback ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
                placeholder="Please share your detailed feedback..."
              />
              {errors.feedback && <p className="mt-2 text-sm text-red-600">{errors.feedback}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
