import { useState, useEffect } from 'react';
import { getBlogs, addBlog, deleteBlog, uploadImages } from '@/lib/api';
import { Blog } from '@/types/machine';

const emptyBlog = {
  title: '',
  content: '',
  featured_image: ''
};

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyBlog);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('adminToken') || '';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const data = await getBlogs();
    setBlogs(data.length > 0 ? data : getSampleBlogs());
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const result = await uploadImages(e.target.files, token);
      if (result.images.length > 0) {
        setFormData(prev => ({
          ...prev,
          featured_image: result.images[0]
        }));
        setMessage({ type: 'success', text: 'Image uploaded successfully' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await addBlog(formData, token);
      setMessage({ type: 'success', text: 'Blog added successfully' });
      setFormData(emptyBlog);
      setShowForm(false);
      fetchBlogs();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add blog' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      await deleteBlog(id, token);
      setMessage({ type: 'success', text: 'Blog deleted successfully' });
      fetchBlogs();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete blog' });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Blogs</h1>
        <button className="btn-admin-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Blog'}
        </button>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Add Blog Form */}
      {showForm && (
        <div className="admin-form-container">
          <h2>Add New Blog</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Blog title"
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Featured Image</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <span className="upload-status">Uploading...</span>}
              </div>
              {formData.featured_image && (
                <div className="image-preview-single">
                  <img src={formData.featured_image} alt="Featured" />
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}>×</button>
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label>Content *</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here..."
                rows={10}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-admin-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Add Blog'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs Table */}
      {isLoading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <img 
                      src={blog.featured_image || 'https://via.placeholder.com/60x40'} 
                      alt={blog.title}
                      className="table-thumbnail"
                    />
                  </td>
                  <td>{blog.title}</td>
                  <td>{new Date(blog.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="btn-icon delete" onClick={() => handleDelete(blog._id || '')} title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getSampleBlogs(): Blog[] {
  return [
    { _id: '1', title: 'Importance of Well-Maintained Backhoe Loaders', content: 'Well-maintained backhoe loaders are essential...', featured_image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400', created_at: '2024-01-15' },
    { _id: '2', title: 'Rental vs Buying Construction Equipment', content: 'When starting a construction project...', featured_image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400', created_at: '2024-01-10' },
    { _id: '3', title: 'How to Choose the Right Excavator', content: 'Choosing the right excavator...', featured_image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400', created_at: '2024-01-05' },
  ];
}
