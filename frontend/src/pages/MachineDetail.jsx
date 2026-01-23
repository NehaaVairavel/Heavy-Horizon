import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { EnquiryModal } from '@/components/machines/EnquiryModal';
import { getMachine } from '@/lib/api';
import { normalizeImages } from '@/lib/images';

export default function MachineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [machine, setMachine] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Determine type from URL path
    const isServices = location.pathname.startsWith('/services');
    const purpose = isServices ? 'Rental' : 'Sales';
    const backPath = isServices ? '/services' : '/sales';
    const backLabel = isServices ? 'Our Services' : 'Sales';

    useEffect(() => {
        const fetchMachine = async () => {
            setIsLoading(true);
            try {
                const data = await getMachine(id);
                if (data) {
                    setMachine(data);
                }
            } catch (error) {
                console.error('Error fetching machine:', error);
            }
            setIsLoading(false);
        };

        fetchMachine();
        window.scrollTo(0, 0);
    }, [id]);

    const handleWhatsAppEnquiry = () => {
        if (!machine) return;
        const adminPhone = '916379432565';
        const message = encodeURIComponent(
            `Hi, I'm interested in the ${machine.title} (${machine.category}) - ${purpose}.\n\nSource: ${window.location.href}\n\nPlease provide more information.`
        );
        window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="admin-loading" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Loading Machine Details...
                </div>
            </Layout>
        );
    }

    if (!machine) {
        return (
            <Layout>
                <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                    <h1 className="section-title">Machine Not Found</h1>
                    <p>The machine you're looking for doesn't exist.</p>
                    <Link to={backPath} className="btn btn-primary" style={{ marginTop: 24 }}>
                        Back to {backLabel}
                    </Link>
                </div>
            </Layout>
        );
    }

    const images = normalizeImages(machine.images || machine.image);
    const hasImages = images.length > 0;

    return (
        <Layout>
            {/* Dark Gallery Section */}
            <section className="machine-detail-gallery">
                <div className="gallery-container">
                    <div className="detail-image-slider">
                        <div className="detail-main-image">
                            <img
                                src={images[currentImageIndex] || '/placeholder.jpg'}
                                alt={machine.title}
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="carousel-overlay-info" style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                {currentImageIndex + 1} / {images.length}
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="detail-thumbnails">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumbnail-item ${idx === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Content Section */}
            <section className="machine-detail-content">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="detail-breadcrumb" style={{ marginBottom: 32 }}>
                        <Link to="/">Home</Link>
                        <span style={{ margin: '0 10px', color: '#ccc' }}>/</span>
                        <Link to={backPath}>{backLabel}</Link>
                        <span style={{ margin: '0 10px', color: '#ccc' }}>/</span>
                        <span style={{ fontWeight: 600 }}>{machine.title}</span>
                    </nav>

                    <div className="detail-layout">
                        <div className="detail-main">
                            <div className="detail-header" style={{ marginBottom: 40 }}>
                                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                                    <span className="badge badge-sales" style={{ background: '#000', color: '#fff', fontSize: '0.65rem' }}>{machine.category?.toUpperCase()}</span>
                                    <span className="badge badge-available">{machine.status || 'Available'}</span>
                                    <span className="badge badge-rental" style={{ background: '#fef3c7', color: '#d97706' }}>FOR {purpose.toUpperCase()}</span>
                                </div>
                                <h1 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>{machine.title}</h1>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '1.1rem' }}>
                                    {machine.model} • {machine.year} Model • {machine.hours?.toLocaleString()} Hours
                                </p>
                            </div>

                            <div className="detail-section" style={{ marginBottom: 48 }}>
                                <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: 20, letterSpacing: '0.05em' }}>About This Machine</h2>
                                <p style={{ lineHeight: 1.8, color: '#444', fontSize: '1.05rem' }}>
                                    {machine.description || 'Comprehensive data for this machine is being compiled. Please contact us for a detailed inspection report and more performance specifications.'}
                                </p>
                            </div>

                            <div className="detail-section">
                                <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: 20, letterSpacing: '0.05em' }}>Specifications</h2>
                                <div className="specs-grid">
                                    <div className="spec-card">
                                        <span className="spec-label">MODEL</span>
                                        <span className="spec-value">{machine.model}</span>
                                    </div>
                                    <div className="spec-card">
                                        <span className="spec-label">YEAR</span>
                                        <span className="spec-value">{machine.year}</span>
                                    </div>
                                    <div className="spec-card">
                                        <span className="spec-label">OPERATING HOURS</span>
                                        <span className="spec-value">{machine.hours?.toLocaleString()}</span>
                                    </div>
                                    <div className="spec-card">
                                        <span className="spec-label">CONDITION</span>
                                        <span className="spec-value">{machine.condition}</span>
                                    </div>

                                    {/* Dynamic specs if available */}
                                    {machine.specifications && Object.entries(machine.specifications).map(([key, value]) => (
                                        !['model', 'year', 'hours', 'condition'].includes(key.toLowerCase()) && (
                                            <div className="spec-card" key={key}>
                                                <span className="spec-label">{key.toUpperCase()}</span>
                                                <span className="spec-value">{value}</span>
                                            </div>
                                        )
                                    ))}

                                    {/* Add defaults from reference if missing */}
                                    {!machine.specifications?.engine && (
                                        <div className="spec-card">
                                            <span className="spec-label">ENGINE</span>
                                            <span className="spec-value">{machine.specifications?.engine || 'Diesel 4-cylinder'}</span>
                                        </div>
                                    )}
                                    {!machine.specifications?.power && (
                                        <div className="spec-card">
                                            <span className="spec-label">POWER</span>
                                            <span className="spec-value">{machine.specifications?.power || '76 HP'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <aside className="detail-sidebar">
                            <div className="cta-card">
                                <h3>Interested in this machine?</h3>
                                <p>Get in touch with us for more details, pricing, or to schedule an inspection.</p>

                                <button
                                    className="btn btn-primary btn-lg btn-block"
                                    style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    SEND ENQUIRY
                                </button>

                                <button
                                    className="btn btn-block"
                                    style={{ background: '#25D366', color: 'white', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                                    onClick={handleWhatsAppEnquiry}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                    </svg>
                                    CHAT ON WHATSAPP
                                </button>

                                <button className="btn btn-outline-dark btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    CALL NOW
                                </button>
                            </div>

                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                <Link to={backPath} className="back-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.8rem', color: '#666' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    BACK TO {backLabel.toUpperCase()}
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Enquiry Modal */}
            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                machine={machine}
                enquiryType={purpose}
            />
        </Layout>
    );
}
