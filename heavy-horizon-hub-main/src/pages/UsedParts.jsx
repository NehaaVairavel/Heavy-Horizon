import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getParts } from '@/lib/api';

// Sample data for UI preview
const sampleParts = [
  {
    _id: '1',
    name: 'Hydraulic Pump',
    compatibility: 'JCB 3DX, JCB 3DX Plus',
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400']
  },
  {
    _id: '2',
    name: 'Breaker Bits',
    compatibility: 'All Hydraulic Breakers',
    condition: 'New',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400']
  },
  {
    _id: '3',
    name: 'Engine Assembly',
    compatibility: 'CAT 320D, CAT 424B',
    condition: 'Refurbished',
    images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400']
  },
  {
    _id: '4',
    name: 'Gear Box',
    compatibility: 'JCB 3DX, CASE 770EX',
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400']
  },
  {
    _id: '5',
    name: 'Control Valves',
    compatibility: 'Hyundai R210, Volvo EC210',
    condition: 'Good Condition',
    images: ['https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400']
  },
  {
    _id: '6',
    name: 'Bucket Attachments',
    compatibility: 'Universal Fit',
    condition: 'Used - Good',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400']
  }
];

export default function UsedParts() {
  const [parts, setParts] = useState(sampleParts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchParts = async () => {
      setIsLoading(true);
      const data = await getParts();
      if (data.length > 0) {
        setParts(data);
      }
      setIsLoading(false);
    };

    fetchParts();
  }, []);

  const handleEnquiry = (part) => {
    const message = `Hi, I'm interested in the ${part.name} (Compatible with: ${part.compatibility}). Please provide more details.`;
    const whatsappUrl = `https://wa.me/916379432565?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <span className="section-label">Quality Parts</span>
          <h1 className="section-title">Used <span>Parts</span></h1>
          <p>
            Browse our collection of quality used construction machine parts available for sale.
          </p>
        </div>
      </section>

      {/* Parts Grid */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="parts-grid">
              {parts.map((part) => (
                <div key={part._id} className="part-card">
                  <div className="part-image">
                    {part.images.length > 0 ? (
                      <img
                        src={part.images[0]}
                        alt={part.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-image">No image</div>
                    )}
                  </div>
                  <div className="part-content">
                    <h3 className="part-name">{part.name}</h3>
                    <div className="part-details">
                      <div className="part-detail">
                        <label>Compatibility</label>
                        <span>{part.compatibility}</span>
                      </div>
                      <div className="part-detail">
                        <label>Condition</label>
                        <span>{part.condition}</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary btn-block"
                      onClick={() => handleEnquiry(part)}
                    >
                      Send Enquiry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
