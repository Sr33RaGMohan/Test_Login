import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../css/LoginPage.css';
import LoginPage from '../assets/loginPage.png'

const AuthForm = () => {
  const { setCategory } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !confirmPassword) || !selectedCategory) {
      setError('All fields are required.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (isLogin) {
      // Login logic
      if (email === 'testuser@gmail.com' && password === 'testuser@2021') {
        setCategory(selectedCategory);
        navigate('/test');
      } else {
        setError('Invalid credentials.');
      }
    } else {
      // Sign up logic (for this example, we'll just simulate a successful sign-up)
      console.log('Sign up successful');
      setIsLogin(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="left-side">
        <img src={LoginPage} alt="" className="loginImage" />
      </div>
      
      <div className="right-side">
        <div className="form-container">
          <div className="form-title">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="category">Select Category</label>
              <select
                id="category"
                name="category"
                required
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="sports">Sports</option>
                <option value="arts">Arts</option>
                <option value="history">History</option>
                <option value="physics">Physics</option>
              </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <div className="toggle-form">
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;