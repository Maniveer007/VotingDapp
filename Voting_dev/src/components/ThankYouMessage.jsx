import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouMessage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Initial countdown value

  useEffect(() => {
    const redirectTimer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const navigateTimer = setTimeout(() => {
      navigate('/');
    }, 5000);

    // Clear timers on component unmount
    return () => {
      clearInterval(redirectTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-filter backdrop-blur-xs bg-opacity-80 bg-gray-900">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center transform scale-110 hover:scale-105 transition-transform duration-300">
        <p className="text-3xl font-semibold text-gray-800 mb-4">Thank you for your vote!</p>
        <p className="text-lg text-gray-600 mb-6">
          Redirecting to the home page in {countdown} seconds...
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none transition-all duration-300"
          >
            Go Home Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouMessage;
