import React, { useState, useRef } from 'react';
import { SEO } from '../../../shared/components';
import { FiMapPin, FiClock, FiTrendingUp, FiHeart, FiGift, FiArrowRight, FiMail, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const ctaRef = useRef(null);

  const departments = ['All', 'Engineering', 'Product'];

  const scrollToCTA = () => {
    if (ctaRef.current) {
      ctaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const jobOpenings = [
    {
      id: 1,
      title: 'Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Part-time to Full-time',
      experience: '3+ years',
      description: 'Work directly with the founder to build and scale our AI-driven real estate investment platform.',
      requirements: ['React/Node.js', 'API development', 'Startup mindset'],
      salary: 'Equity + Cash (DOE)'
    },
    {
      id: 2,
      title: 'Founding Product & Marketing Lead',
      department: 'Product',
      location: 'Remote',
      type: 'Part-time to Full-time',
      experience: '3+ years',
      description: 'Drive early product strategy and help shape user experience with a hands-on approach.',
      requirements: ['Marketing & Product experience', 'FinTech/PropTech interest', 'Strong communicator'],
      salary: 'Equity + Cash (DOE)'
    },
    {
      id: 3,
      title: 'Blockchain/Smart Contract Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Contract-to-Hire',
      experience: '2+ years',
      description: 'Implement secure smart contracts and support token launch strategy and tooling.',
      requirements: ['Solidity or Hedera knowledge', 'Smart contract security', 'DeFi/NFT familiarity'],
      salary: 'Equity + Bonus per milestone'
    }
  ];

  const filteredJobs = selectedDepartment === 'All'
    ? jobOpenings
    : jobOpenings.filter(job => job.department === selectedDepartment);

  return (
    <>
      <SEO
        title="Careers - Build FractionaX with Us"
        description="FractionaX is looking for 2–3 founding team members to help reshape real estate investing. Join our lean, mission-driven startup."
        keywords={['startup jobs', 'founding engineer', 'FractionaX careers', 'blockchain jobs']}
      />

      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="bg-gradient-to-r from-purple-800 to-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-5xl font-bold mb-6">Be Part of the First 3</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join us as we redefine real estate investing with blockchain, AI, and real utility.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12 flex justify-center">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedDepartment === dept ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center space-x-4 text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FiMapPin className="w-4 h-4 mr-1" />{job.location}
                        </div>
                        <div className="flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />{job.type}
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {job.department}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">{req}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600">Experience: </span>
                          <span className="font-medium text-gray-900">{job.experience}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Compensation: </span>
                          <span className="font-medium text-green-600">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={scrollToCTA}
                      className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group"
                    >
                      Apply Now
                      <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Floating CTA Section */}
          <div ref={ctaRef} className="sticky bottom-6 z-50 w-full max-w-3xl mx-auto bg-white text-gray-800 border border-gray-300 shadow-2xl rounded-xl px-6 py-5 text-center">
            <h2 className="text-xl font-bold mb-2">Let’s Build the Future—Together</h2>
            <p className="text-sm mb-4">
              Don’t see a role that fits perfectly? Pitch us. We're open to game-changing talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <a
                href="mailto:careers@fractionax.com"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <FiMail className="w-4 h-4 mr-2" />Email Us
              </a>
              <button
                disabled
                className="bg-gray-200 text-gray-500 px-6 py-2 rounded-md cursor-not-allowed flex items-center justify-center"
              >
                📎 Upload Resume (Coming Soon)
              </button>
              <div className="flex space-x-3 justify-center">
                <a href="https://www.linkedin.com/in/lorenzo-t-holmes" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                  <FiLinkedin className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/FractionaX" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                  <FiTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Resume upload coming soon — we’re working on it!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Careers;