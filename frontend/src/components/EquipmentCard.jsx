import { Link } from 'react-router-dom';
import jcbBackhoeImg from '@/assets/jcb-backhoe.jpg';
import hitachiExcavatorImg from '@/assets/hitachi-excavator.jpg';

// Image mapping for equipment categories
export const equipmentImages = {
  'backhoe-loaders': jcbBackhoeImg,
  'excavators': hitachiExcavatorImg,
  'backhoe-breakers': 'https://res.cloudinary.com/dgchj39y2/image/upload/v1737471649/heavy_horizon/categories/backhoe-breaker-category.jpg',
};

export function EquipmentCard({ title, description, path, buttonText, imageKey, count }) {
  const imageSrc = equipmentImages[imageKey] || jcbBackhoeImg;

  return (
    <Link to={path} className="card equipment-card">
      <div className="card-image">
        <img src={imageSrc} alt={`${title} equipment category`} loading="lazy" />
        {count !== undefined && (
          <div className="category-count" style={{
            position: 'absolute',
            top: '16px', // Slightly more inset
            right: '16px',
            background: 'var(--white)',
            color: 'var(--primary)',
            fontWeight: '600', // Medium weight
            fontSize: '0.85rem', // Subtle text
            width: '28px', // Compact size
            height: '28px',
            borderRadius: '50%', // Circular
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            zIndex: 2,
            border: '1.5px solid var(--primary)',
            opacity: 0.95
          }}>
            {count}
          </div>
        )}
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 className="card-title" style={{ margin: 0, textTransform: 'uppercase' }}>{title}</h3>
        </div>
        <p className="card-description" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          {description}
        </p>
        <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {buttonText}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
