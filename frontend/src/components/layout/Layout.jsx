import { useLocation, useNavigationType } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import '../../styles/main.css';

export function Layout({ children }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  // Determine animation class based on navigation type
  const getAnimationClass = () => {
    switch (navigationType) {
      case 'PUSH':
        return 'page-slide-in';
      case 'POP':
        return 'page-slide-back';
      default:
        return 'page-fade-in';
    }
  };

  return (
    <div className="app">
      <Header />
      <main key={location.pathname} className={getAnimationClass()}>
        {children}
      </main>
      
      {/* Conversion Widgets */}
      <div className="floating-widgets">
        <a 
          href="https://wa.me/916379432565" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="float-btn float-whatsapp pulse-animation"
          title="Chat on WhatsApp"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.2l-.669 2.445 2.511-.646c.965.547 1.91.839 2.897.839 3.179 0 5.765-2.586 5.766-5.766 0-3.18-2.587-5.738-5.762-5.738zm3.383 8.305c-.147.411-.852.762-1.222.812-.34.046-.777.067-1.284-.095-.303-.098-.71-.24-1.25-.487-2.274-1.012-3.743-3.344-3.856-3.497-.112-.153-.916-1.218-.916-2.321 0-1.103.577-1.644.782-1.867.205-.223.446-.279.595-.279.149 0 .298.001.428.007.133.007.313-.05.49.378.177.428.605 1.472.658 1.58.054.108.09.234.018.378-.072.144-.108.234-.216.36-.108.126-.226.281-.322.378-.108.108-.221.226-.095.442.126.216.561.925 1.206 1.5.83.741 1.53.97 1.747 1.077.217.108.343.09.469-.054.126-.144.541-.631.685-.847.144-.216.289-.18.487-.108.198.072 1.258.593 1.474.701.216.108.36.162.411.252.051.09.051.522-.096.933z"/>
          </svg>
        </a>
        <Link 
          to="/contact" 
          className="float-btn float-contact"
          title="Get a Quote"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
