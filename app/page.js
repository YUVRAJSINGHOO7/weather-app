'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleFormSwitch = (type) => {
    setError(null);
    setAuthForm({ email: '', password: '', name: '' });
    if (type === 'login') {
      setShowLogin(true);
      setShowRegister(false);
    } else {
      setShowLogin(false);
      setShowRegister(true);
    }
  };

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authForm),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        setShowLogin(false);
        setShowRegister(false);
        setAuthForm({ email: '', password: '', name: '' });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUser(null);
      setWeatherData(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = async (city) => {
    if (!isAuthenticated) {
      setError('Please login to search for weather');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?city=${city}`);
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError('An error occurred while fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleFormSwitch('login')}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => handleFormSwitch('register')}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {(showLogin || showRegister) && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {showLogin ? 'Login' : 'Register'}
            </h2>
            <form
              onSubmit={(e) => handleAuth(e, showLogin ? 'login' : 'register')}
              className="space-y-4"
            >
              {showRegister && (
                <input
                  type="text"
                  placeholder="Name"
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Loading...' : showLogin ? 'Login' : 'Register'}
              </button>
            </form>
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>
        )}

        {isAuthenticated && (
          <>
            <SearchBar onSearch={handleSearch} />
            
            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading weather data...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {weatherData && <WeatherCard weatherData={weatherData} />}
          </>
        )}
      </div>
    </main>
  );
} 