import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { MachineCard } from '@/components/machines/MachineCard';
import { EnquiryModal } from '@/components/machines/EnquiryModal';
import { getMachines } from '@/lib/api';

const categoryInfo = {
  'backhoe-loaders': {
    title: 'Backhoe Loaders',
    category: 'Backhoe Loader',
    description: 'Quality backhoe loaders available for purchase.',
  },
  'excavators': {
    title: 'Excavators',
    category: 'Excavator',
    description: 'Premium excavators for sale with inspection reports.',
  },
  'backhoe-breakers': {
    title: 'Backhoe Loaders with Breakers',
    category: 'Backhoe Loader with Breaker',
    description: 'Backhoe loaders with hydraulic breakers for specialized work.',
  },
};

// Sample data for UI preview
const sampleMachines = [
  { title: 'JCB 3DX', category: 'Backhoe Loader', purpose: 'Sales', model: '3DX', year: 2021, hours: 4100, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'CASE 770EX', category: 'Backhoe Loader', purpose: 'Sales', model: '770EX', year: 2020, hours: 5300, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'CAT 424B', category: 'Backhoe Loader', purpose: 'Sales', model: '424B', year: 2019, hours: 6000, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Sold' },
  { title: 'JCB 3DX Plus', category: 'Backhoe Loader', purpose: 'Sales', model: '3DX Plus', year: 2022, hours: 3500, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Available' },
  { title: 'JCB 2DX', category: 'Backhoe Loader', purpose: 'Sales', model: '2DX', year: 2018, hours: 7200, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'CAT 320D', category: 'Excavator', purpose: 'Sales', model: '320D', year: 2020, hours: 5500, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
  { title: 'Hyundai R210', category: 'Excavator', purpose: 'Sales', model: 'R210', year: 2019, hours: 6800, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'], status: 'Sold' },
  { title: 'Komatsu PC210', category: 'Excavator', purpose: 'Sales', model: 'PC210', year: 2021, hours: 4200, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800'], status: 'Available' },
];

export default function SalesCategory() {
  const { category } = useParams();
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const info = category ? categoryInfo[category] : null;

  useEffect(() => {
    const fetchMachines = async () => {
      if (!info) return;
      
      setIsLoading(true);
      const data = await getMachines('Sales', info.category);
      if (data.length > 0) {
        setMachines(data);
      } else {
        // Use sample data filtered by category
        const filtered = sampleMachines.filter(m => m.category === info.category);
        setMachines(filtered);
      }
      setIsLoading(false);
    };

    fetchMachines();
  }, [category, info]);

  const handleEnquiry = (machine) => {
    setSelectedMachine(machine);
    setIsModalOpen(true);
  };

  if (!info) {
    return (
      <Layout>
        <section className="section-dark page-header">
          <div className="container">
            <h1 className="section-title">Category Not Found</h1>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <p>The requested category does not exist.</p>
            <Link to="/sales" className="btn btn-primary" style={{ marginTop: 24 }}>
              Back to Sales
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/sales">Sales</Link>
            <span>/</span>
            <span>{info.title}</span>
          </div>
          <span className="section-label">For Sale</span>
          <h1 className="section-title">{info.title.split(' ')[0]} <span>{info.title.split(' ').slice(1).join(' ') || 'For Sale'}</span></h1>
          <p>{info.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          ) : machines.length > 0 ? (
            <div className="grid-3">
              {machines.map((machine) => (
                <MachineCard
                  key={machine.title}
                  machine={machine}
                  onEnquiry={handleEnquiry}
                  showStatus
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)', marginBottom: 24 }}>
                No machines available in this category at the moment.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Contact Us for Availability
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMachine(null);
        }}
        machine={selectedMachine}
        enquiryType="Sales"
      />
    </Layout>
  );
}
