import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getBlog, getBlogs } from '@/lib/api';

// Sample blog for UI preview
const sampleBlog = {
  _id: '1',
  title: 'Importance of Well-Maintained Backhoe Loaders',
  content: `Well-maintained backhoe loaders are essential for any construction project. Regular maintenance ensures optimal performance, reduces downtime, and extends the lifespan of the equipment.

## Key Maintenance Practices

### 1. Daily Inspections
Before starting any work, operators should conduct a thorough walk-around inspection. Check for:
- Fluid leaks (hydraulic oil, engine oil, coolant)
- Tire condition and pressure
- Bucket and attachment wear
- Warning lights and gauges

### 2. Regular Oil Changes
Engine oil should be changed according to manufacturer specifications, typically every 250-500 operating hours. Using the correct grade of oil is crucial for engine longevity.

### 3. Hydraulic System Care
The hydraulic system is the heart of a backhoe loader. Regular maintenance includes:
- Checking hydraulic fluid levels daily
- Replacing filters as recommended
- Inspecting hoses for wear or damage
- Monitoring system pressure

### 4. Track and Undercarriage Maintenance
For backhoe loaders with tracks:
- Check track tension regularly
- Inspect rollers and idlers for wear
- Clean undercarriage to prevent debris buildup

## Benefits of Proper Maintenance

1. **Reduced Downtime**: Well-maintained equipment breaks down less frequently
2. **Lower Operating Costs**: Preventive maintenance is cheaper than major repairs
3. **Extended Equipment Life**: Proper care can add years to your machine
4. **Better Resale Value**: Maintained equipment commands higher prices
5. **Improved Safety**: Reduces risk of accidents due to equipment failure

## Conclusion

Investing time and resources in maintaining your backhoe loaders pays dividends in the long run. At Heavy Horizon, all our rental and sales equipment undergoes rigorous maintenance checks to ensure you receive machines in optimal condition.

Contact us today to learn more about our well-maintained fleet of backhoe loaders available for rental or purchase in Chennai.`,
  featured_image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200',
  created_at: '2024-01-15'
};

const sampleRelatedBlogs = [
  {
    _id: '2',
    title: 'Rental vs Buying Construction Equipment',
    content: 'When starting a construction project, one of the key decisions is whether to rent or buy equipment.',
    featured_image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
    created_at: '2024-01-10'
  },
  {
    _id: '3',
    title: 'How to Choose the Right Excavator',
    content: 'Choosing the right excavator for your project can significantly impact productivity and costs.',
    featured_image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600',
    created_at: '2024-01-05'
  }
];

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(sampleBlog);
  const [relatedBlogs, setRelatedBlogs] = useState(sampleRelatedBlogs);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await getBlog(id);
      if (data) {
        setBlog(data);
      }
      const allBlogs = await getBlogs();
      if (allBlogs.length > 0) {
        setRelatedBlogs(allBlogs.filter(b => b._id !== id).slice(0, 2));
      }
      setIsLoading(false);
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="section">
          <div className="container">
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="section">
          <div className="container">
            <div className="not-found-content">
              <h1>Blog not found</h1>
              <Link to="/blogs" className="btn btn-primary">Back to Blogs</Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Blog Header */}
      <section className="blog-detail-header">
        <div className="container">
          <Link to="/blogs" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blogs
          </Link>
          <span className="blog-detail-date">{formatDate(blog.created_at)}</span>
          <h1 className="blog-detail-title">{blog.title}</h1>
        </div>
      </section>

      {/* Featured Image */}
      <section className="blog-detail-image">
        <div className="container">
          <img src={blog.featured_image} alt={blog.title} />
        </div>
      </section>

      {/* Blog Content */}
      <section className="section blog-detail-content">
        <div className="container">
          <div className="blog-content-wrapper">
            <div className="blog-body" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/### (.*)/g, '<h3>$1</h3>') }} />
            
            {/* CTA */}
            <div className="blog-cta">
              <h3>Interested in Our Equipment?</h3>
              <p>Contact Heavy Horizon today for quality construction equipment rental and sales in Chennai.</p>
              <div className="blog-cta-buttons">
                <Link to="/services" className="btn btn-primary">View Rentals</Link>
                <Link to="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </div>
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="related-blogs">
              <h2>Related Articles</h2>
              <div className="related-blogs-grid">
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog._id} to={`/blogs/${relatedBlog._id}`} className="related-blog-card">
                    <div className="related-blog-image">
                      <img src={relatedBlog.featured_image} alt={relatedBlog.title} />
                    </div>
                    <div className="related-blog-content">
                      <span className="related-blog-date">{formatDate(relatedBlog.created_at)}</span>
                      <h3>{relatedBlog.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
