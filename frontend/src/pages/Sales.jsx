import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EquipmentCard } from '@/components/EquipmentCard';
import { getMachines } from '@/lib/api';
import salesHeroImg from '@/assets/sales-hero.png';
import jcbPremiumImg from '@/assets/jcb-backhoe-premium.png';
import hitachiPremiumImg from '@/assets/hitachi-excavator-premium.png';

const salesCategories = [
  {
    title: 'Backhoe Loaders',
    category: 'Backhoe Loader',
    path: '/sales/category/backhoe-loaders#machines-grid',
    imageKey: 'backhoe-loaders',
    customImage: jcbPremiumImg,
    description: 'Powerful and versatile machines ideal for excavation, loading, trenching, and earthwork operations.',
  },
  {
    title: 'Excavators',
    category: 'Excavator',
    path: '/sales/category/excavators#machines-grid',
    imageKey: 'excavators',
    customImage: hitachiPremiumImg,
    description: 'Heavy-duty excavators suitable for large-scale digging, demolition, and infrastructure projects.',
  },
  {
    title: 'Backhoe Loaders with Breakers',
    category: 'Backhoe Loader with Breaker',
    path: '/sales/category/backhoe-breakers#machines-grid',
    imageKey: 'backhoe-breakers',
    description: 'Backhoe loaders equipped with hydraulic breakers for rock breaking and hard surface demolition.',
  },
];

export default function Sales() {
  const [counts, setCounts] = useState({});
  const [featuredMachines, setFeaturedMachines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMachines();
        const salesMachines = data.filter(m => m.purpose === 'Sales' || m.type === 'Sales');

        // Counts
        const newCounts = {};
        salesCategories.forEach(cat => {
          newCounts[cat.category] = salesMachines.filter(m => m.category === cat.category).length;
        });
        setCounts(newCounts);

        // Featured (First 3 available)
        setFeaturedMachines(salesMachines.filter(m => m.status === 'Available').slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      }
    };

    fetchData();

    if (window.location.hash === '#machines-grid') {
      const machinesSection = document.getElementById('machines-grid');
      if (machinesSection) {
        setTimeout(() => {
          const navbarHeight = 90;
          const elementPosition = machinesSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - navbarHeight, behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <Layout>
      {/* Premium Hero Section */}
      <section className="hero-premium">
        <div className="hero-texture"></div>
        <div className="container">
          <div className="hero-split">
            <div className="hero-content">
              <span className="hero-badge">Equipment Sales</span>
              <h1 className="section-title">Buy Premium <span>Construction</span> Equipment</h1>
              <p>
                Own top-tier machinery designed for maximum productivity. Our certified equipment 
                undergoes rigorous inspection to ensure long-term reliability for your projects.
              </p>
              <div className="hero-actions">
                <a href="#machines-grid" className="btn btn-primary">Explore Equipment</a>
                <Link to="/contact" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Get Quote</Link>
              </div>
            </div>
            <div className="hero-visual">
              <img src={salesHeroImg} alt="Premium Excavator" className="hero-main-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-premium">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Machines Delivered</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>Trusted Clients</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Service Support</p>
            </div>
            <div className="stat-item">
              <h3>20+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="category-section-premium" id="machines-grid">
        <div className="divider-wave">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '60px', width: '100%', fill: '#1C1C1C' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
        
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="section-label">Select Category</span>
            <h2 className="section-title">Explore by <span>Equipment Type</span></h2>
            <p style={{ maxWidth: '600px', margin: '20px auto 0', color: 'var(--muted-foreground)' }}>
              Browse our diverse inventory of heavy machinery, from versatile backhoes to powerful excavators.
            </p>
          </div>

          <div className="grid-3">
            {salesCategories.map((category, index) => (
              <EquipmentCard
                key={index}
                title={category.title}
                description={category.description}
                path={category.path}
                buttonText="View Inventory"
                imageKey={category.imageKey}
                customImage={category.customImage}
                count={counts[category.category]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section placeholder or logic could go here */}
    </Layout>
  );
}
