import { useState } from 'react';
import { normalizeImages } from '@/lib/images';

export function MachineCard({ machine, onEnquiry, showStatus = false }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const normalizedImages = normalizeImages(machine?.images || machine?.image);
  const hasImages = normalizedImages.length > 0;
  const fallbackUrl = "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800";

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === normalizedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="card">
      <div className="card-image">
        {hasImages ? (
          <div className="image-slider">
            <img
              src={normalizedImages[currentImageIndex]}
              alt={`${machine.title || 'Machine'} - Image ${currentImageIndex + 1}`}
              loading="lazy"
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                console.warn(`Failed to load image: ${normalizedImages[currentImageIndex]}`);
                e.target.src = fallbackUrl;
              }}
            />

            {normalizedImages.length > 1 && (
              <>
                <button className="slider-nav prev" onClick={prevImage} aria-label="Previous image">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button className="slider-nav next" onClick={nextImage} aria-label="Next image">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                <div className="slider-dots">
                  {normalizedImages.map((_, index) => (
                    <button
                      key={index}
                      className={`slider-dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="image-slider">
            <img
              src={fallbackUrl}
              alt="No image available"
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <span className="card-badge">{machine.category}</span>
        {showStatus && <span className={`card-status ${machine.status === 'Sold' ? 'sold' : ''}`}>{machine.status}</span>}
      </div>

      <div className="card-body">
        <h3 className="card-title">{machine.title}</h3>

        <div className="card-specs">
          <div className="spec-item">
            <label>Model</label>
            <span>{machine.model}</span>
          </div>
          <div className="spec-item">
            <label>Year</label>
            <span>{machine.year}</span>
          </div>
          <div className="spec-item">
            <label>Hours</label>
            <span>{machine.hours.toLocaleString()}</span>
          </div>
          <div className="spec-item">
            <label>Condition</label>
            <span>{machine.condition === 'Pure Earthwork Condition' ? 'Earthwork' : 'Good'}</span>
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={() => onEnquiry(machine)}>
          Send Enquiry
        </button>
      </div>
    </div>
  );
}
