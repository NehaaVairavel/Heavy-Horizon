import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Blog } from '@/types/machine';
import { getBlogs } from '@/lib/api';

// Sample data for UI preview
const sampleBlogs: Blog[] = [
  {
    _id: '1',
    title: 'Importance of Well-Maintained Backhoe Loaders',
    content: 'Well-maintained backhoe loaders are essential for any construction project. Regular maintenance ensures optimal performance, reduces downtime, and extends the lifespan of the equipment. In this article, we explore the key maintenance practices that every operator should follow.',
    featured_image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600',
    created_at: '2024-01-15'
  },
  {
    _id: '2',
    title: 'Rental vs Buying Construction Equipment',
    content: 'When starting a construction project, one of the key decisions is whether to rent or buy equipment. Both options have their advantages and disadvantages. This guide helps you make an informed decision based on your project requirements and budget.',
    featured_image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
    created_at: '2024-01-10'
  },
  {
    _id: '3',
    title: 'How to Choose the Right Excavator',
    content: 'Choosing the right excavator for your project can significantly impact productivity and costs. Factors like project size, soil type, and working conditions all play a role. Learn how to select the perfect excavator for your needs.',
    featured_image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600',
    created_at: '2024-01-05'
  },
  {
    _id: '4',
    title: 'Preventive Maintenance Tips for Earthwork Machines',
    content: 'Preventive maintenance is crucial for keeping your earthwork machines in top condition. From daily inspections to scheduled servicing, these tips will help you avoid costly repairs and unexpected breakdowns.',
    featured_image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600',
    created_at: '2024-01-01'
  },
  {
    _id: '5',
    title: 'Role of Hydraulic Breakers in Construction',
    content: 'Hydraulic breakers are powerful attachments that transform excavators and backhoe loaders into demolition machines. Discover how these tools are used in construction and what to consider when selecting one.',
    featured_image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600',
    created_at: '2023-12-28'
  }
];

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>(sampleBlogs);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const data = await getBlogs();
      if (data.length > 0) {
        setBlogs(data);
      }
      setIsLoading(false);
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="section-dark page-header">
        <div className="container">
          <span className="section-label">Industry Insights</span>
          <h1 className="section-title">Our <span>Blogs</span></h1>
          <p>
            Stay updated with the latest news, tips, and insights from the construction equipment industry.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="blog-grid">
              {blogs.map((blog) => (
                <article key={blog._id} className="blog-card">
                  <div className="blog-image">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="blog-content">
                    <span className="blog-date">{formatDate(blog.created_at)}</span>
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">
                      {blog.content.substring(0, 150)}...
                    </p>
                    <button className="btn btn-outline">Read More</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
