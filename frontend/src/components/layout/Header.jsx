import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'HOME', path: '/' },
  { label: 'SALES', path: '/sales#machines-grid' },
  { label: 'OUR SERVICES', path: '/services#machines-grid' },
  { label: 'USED PARTS', path: '/spare-parts' },
  { label: 'BLOGS', path: '/blogs' },
  { label: 'CONTACT US', path: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Get current page name for header breadcrumb
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/') return null;

    const matchedItem = navItems.find(item => item.path !== '/' && path.startsWith(item.path));
    if (matchedItem) return matchedItem.label;

    // Fallback for subpaths like categories or detail pages if not matched above
    if (path.includes('/services')) return 'OUR SERVICES';
    if (path.includes('/sales')) return 'SALES';
    if (path.includes('/spare-parts')) return 'USED PARTS';
    if (path.includes('/blogs')) return 'BLOGS';
    if (path.includes('/contact')) return 'CONTACT US';

    return null;
  };

  const pageName = getCurrentPageName();

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-logo-group">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <img src="/logo.png" alt="H" />
            </div>
            <span className="logo-name">
              HEAVY <span>HORIZON</span>
            </span>
          </Link>
          {pageName && (
            <div className="header-breadcrumb">
              / <span className="current">{pageName}</span>
            </div>
          )}
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
