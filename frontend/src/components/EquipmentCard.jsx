import { Link } from 'react-router-dom';
import jcbBackhoeImg from '@/assets/jcb-backhoe.jpg';
import hitachiExcavatorImg from '@/assets/hitachi-excavator.jpg';

// Image mapping for equipment categories
export const equipmentImages = {
  'backhoe-loaders': jcbBackhoeImg,
  'excavators': hitachiExcavatorImg,
  'backhoe-breakers': 'https://res.cloudinary.com/dgchj39y2/image/upload/v1737471649/heavy_horizon/categories/backhoe-breaker-category.jpg',
};

export function EquipmentCard({ title, description, path, buttonText, imageKey, count, customImage }) {
  const imageSrc = customImage || equipmentImages[imageKey] || jcbBackhoeImg;

  return (
    <Link to={path} className="equipment-card-premium">
      <div className="card-img-wrapper">
        <img src={imageSrc} alt={`${title} equipment category`} loading="lazy" />
        <div className="card-overlay-grad"></div>
        {count !== undefined && (
          <div className="category-count" style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--white)',
            color: 'var(--primary)',
            fontWeight: '700',
            fontSize: '0.9rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 2,
            border: '2px solid var(--primary)',
          }}>
            {count}
          </div>
        )}
      </div>
      <div className="premium-card-body">
        <h3 className="premium-card-title">{title}</h3>
        <p className="premium-card-desc">
          {description}
        </p>
        <div className="premium-card-cta">
          {buttonText}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
