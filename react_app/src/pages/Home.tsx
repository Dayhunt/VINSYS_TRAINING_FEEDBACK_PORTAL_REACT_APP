import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Users,
      title: 'Student Portal',
      description: 'Share your training experience and provide valuable feedback',
      link: '/learner-login',
      color: 'bg-blue-500',
    },
    {
      icon: UserCheck,
      title: 'Trainer Dashboard',
      description: 'Access comprehensive feedback analytics and insights',
      link: '/trainer-login',
      color: 'bg-indigo-500',
    },
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Join our community and start your learning journey',
      link: '/create-account',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              Training Excellence Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Vinsys
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Empowering learning through comprehensive feedback management. Connect students and trainers 
              to create exceptional educational experiences.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
                >
                  <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-slate-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">50+</div>
                <div className="text-slate-600">Trainers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                <div className="text-slate-600">Feedback Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;