import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Star, TrendingUp, Filter, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Feedback {
  id: string;
  name: string;
  email: string;
  phone: string;
  rating: string;
  feedback: string;
  submittedAt: string;
}

const TrainerDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [filterRating, setFilterRating] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Updated API URL
  const API_URL = 'https://eeycqc81wj.execute-api.us-west-2.amazonaws.com/prod/getfeedback2';

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch feedback data');
        const data = await response.json();
        setFeedbacks(data.feedbacks);
        setFilteredFeedbacks(data.feedbacks);
      } catch (err) {
        setError('Error fetching feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;

    if (filterRating) {
      filtered = filtered.filter(feedback => feedback.rating === filterRating);
    }

    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return parseInt(b.rating) - parseInt(a.rating);
        case 'date':
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

    setFilteredFeedbacks(filtered);
  }, [feedbacks, filterRating, searchTerm, sortBy]);

  const getRatingDistribution = () => {
    const distribution: { [key: string]: number } = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    feedbacks.forEach(feedback => {
      distribution[feedback.rating] = (distribution[feedback.rating] || 0) + 1;
    });

    return Object.entries(distribution).map(([rating, count]) => ({
      name: `${rating} Star${rating !== '1' ? 's' : ''}`,
      value: count,
      rating: parseInt(rating),
    }));
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, feedback) => sum + parseInt(feedback.rating), 0);
    return (total / feedbacks.length).toFixed(1);
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case '5': return 'bg-green-100 text-green-800';
      case '4': return 'bg-lime-100 text-lime-800';
      case '3': return 'bg-yellow-100 text-yellow-800';
      case '2': return 'bg-orange-100 text-orange-800';
      case '1': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-slate-600 text-lg">
        Loading feedback...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Trainer Dashboard</h1>
            <p className="text-slate-600">Analyze student feedback and training performance</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded-lg border border-slate-100">
            <div className="flex items-center space-x-4">
              <Users className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-sm text-slate-500">Total Feedbacks</p>
                <h3 className="text-xl font-semibold text-slate-800">{feedbacks.length}</h3>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border border-slate-100">
            <div className="flex items-center space-x-4">
              <Star className="w-10 h-10 text-yellow-500" />
              <div>
                <p className="text-sm text-slate-500">Average Rating</p>
                <h3 className="text-xl font-semibold text-slate-800">{getAverageRating()} / 5</h3>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border border-slate-100">
            <div className="flex items-center space-x-4">
              <TrendingUp className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-sm text-slate-500">Rating Breakdown</p>
                <ResponsiveContainer width="100%" height={60}>
                  <PieChart>
                    <Pie
                      data={getRatingDistribution()}
                      dataKey="value"
                      outerRadius={30}
                      innerRadius={20}
                    >
                      {getRatingDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.rating - 1]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <div className="relative">
              <Filter className="absolute top-2.5 left-3 w-5 h-5 text-slate-400" />
              <select
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute top-2.5 left-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <select
              className="py-2 px-4 border rounded-lg focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-slate-100">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Feedback</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredFeedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{feedback.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{feedback.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(feedback.rating)}`}>
                      {feedback.rating} Star{feedback.rating !== '1' ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{feedback.feedback}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(feedback.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default TrainerDashboard;
