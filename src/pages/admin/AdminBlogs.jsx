import { useState, useEffect } from 'react';
import { getBlogs, addBlog, deleteBlog } from '@/lib/api';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', featured_image: '' });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('adminToken') || '';

  useEffect(() => { fetchBlogs(); }, []);
  const fetchBlogs = async () => { setIsLoading(true); const data = await getBlogs(); setBlogs(data.length > 0 ? data : [{ _id: '1', title: 'Sample Blog', content: 'Content', featured_image: '', created_at: '2024-01-01' }]); setIsLoading(false); };
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await addBlog(formData, token); setFormData({ title: '', content: '', featured_image: '' }); setShowForm(false); fetchBlogs(); } catch (err) {} finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await deleteBlog(id, token); fetchBlogs(); } catch (err) {} };

  return (<div className="admin-page"><div className="admin-page-header"><h1>Blogs</h1><button className="btn-admin-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Blog'}</button></div>{showForm && <div className="admin-form-container"><form onSubmit={handleSubmit} className="admin-form"><div className="admin-form-group"><label>Title *</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div><div className="admin-form-group"><label>Content *</label><textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={8} required /></div><button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Blog'}</button></form></div>}{isLoading ? <div className="admin-loading">Loading...</div> : <div className="admin-table-container"><table className="admin-table"><thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead><tbody>{blogs.map(blog => <tr key={blog._id}><td>{blog.title}</td><td>{new Date(blog.created_at).toLocaleDateString()}</td><td><button className="btn-icon delete" onClick={() => handleDelete(blog._id)}>×</button></td></tr>)}</tbody></table></div>}</div>);
}
