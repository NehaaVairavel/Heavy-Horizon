import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '@/lib/api';
import '@/styles/admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Demo credentials for testing (remove in production)
  const DEMO_EMAIL = 'admin@heavyhorizon.com';
  const DEMO_PASSWORD = 'admin123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo login check
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('adminToken', 'demo-token-for-testing');
      navigate('/admin/dashboard');
      return;
    }

    try {
      const response = await adminLogin(email, password);
      if (response.token) {
        localStorage.setItem('adminToken', response.token);
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>Heavy Horizon</h1>
          <p>Admin Portal</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <div className="admin-error">{error}</div>}
          
          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/">← Back to Website</Link>
        </div>
      </div>
    </div>
  );
}
