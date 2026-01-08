import { useState, useEffect } from 'react';
import { getParts, addPart, deletePart, uploadImages } from '@/lib/api';

const emptyPart = { name: '', compatibility: '', condition: '', images: [] };

export default function AdminParts() {
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyPart);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = localStorage.getItem('adminToken') || '';

  useEffect(() => { fetchParts(); }, []);

  const fetchParts = async () => { setIsLoading(true); const data = await getParts(); setParts(data.length > 0 ? data : [{ _id: '1', name: 'Hydraulic Pump', compatibility: 'JCB 3DX', condition: 'Good', images: [] }]); setIsLoading(false); };
  const handleImageUpload = async (e) => { if (!e.target.files) return; setUploading(true); try { const result = await uploadImages(e.target.files, token); setFormData(prev => ({ ...prev, images: [...prev.images, ...result.images] })); } catch (err) { setMessage({ type: 'error', text: 'Upload failed' }); } finally { setUploading(false); } };
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await addPart(formData, token); setFormData(emptyPart); setShowForm(false); fetchParts(); } catch (err) { setMessage({ type: 'error', text: 'Failed' }); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await deletePart(id, token); fetchParts(); } catch (err) { setMessage({ type: 'error', text: 'Failed' }); } };

  return (<div className="admin-page"><div className="admin-page-header"><h1>Used Parts</h1><button className="btn-admin-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Part'}</button></div>{message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}{showForm && <div className="admin-form-container"><form onSubmit={handleSubmit} className="admin-form"><div className="admin-form-group"><label>Part Name *</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div><div className="admin-form-group"><label>Compatibility *</label><input type="text" value={formData.compatibility} onChange={e => setFormData({ ...formData, compatibility: e.target.value })} required /></div><div className="admin-form-group"><label>Condition *</label><input type="text" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })} required /></div><div className="form-actions"><button type="submit" className="btn-admin-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Part'}</button></div></form></div>}{isLoading ? <div className="admin-loading">Loading...</div> : <div className="admin-table-container"><table className="admin-table"><thead><tr><th>Name</th><th>Compatibility</th><th>Condition</th><th>Actions</th></tr></thead><tbody>{parts.map(part => <tr key={part._id}><td>{part.name}</td><td>{part.compatibility}</td><td>{part.condition}</td><td><button className="btn-icon delete" onClick={() => handleDelete(part._id)}>×</button></td></tr>)}</tbody></table></div>}</div>);
}
