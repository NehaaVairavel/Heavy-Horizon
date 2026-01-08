import { useState, useEffect } from 'react';
import { getParts, addPart, deletePart, uploadImages } from '@/lib/api';
import { Part } from '@/types/machine';

const emptyPart = {
  name: '',
  compatibility: '',
  condition: '',
  images: [] as string[]
};

export default function AdminParts() {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyPart);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('adminToken') || '';

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setIsLoading(true);
    const data = await getParts();
    setParts(data.length > 0 ? data : getSampleParts());
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const result = await uploadImages(e.target.files, token);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...result.images]
      }));
      setMessage({ type: 'success', text: 'Images uploaded successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload images' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await addPart(formData, token);
      setMessage({ type: 'success', text: 'Part added successfully' });
      setFormData(emptyPart);
      setShowForm(false);
      fetchParts();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add part' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this part?')) return;
    
    try {
      await deletePart(id, token);
      setMessage({ type: 'success', text: 'Part deleted successfully' });
      fetchParts();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete part' });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Used Parts</h1>
        <button className="btn-admin-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Part'}
        </button>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Add Part Form */}
      {showForm && (
        <div className="admin-form-container">
          <h2>Add New Part</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="admin-form-group">
                <label>Part Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Hydraulic Pump"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Condition *</label>
                <input
                  type="text"
                  value={formData.condition}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  placeholder="e.g., Good Condition"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Compatibility *</label>
              <input
                type="text"
                value={formData.compatibility}
                onChange={e => setFormData({ ...formData, compatibility: e.target.value })}
                placeholder="e.g., JCB 3DX, CAT 320D"
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Images</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <span className="upload-status">Uploading...</span>}
              </div>
              {formData.images.length > 0 && (
                <div className="image-preview-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview">
                      <img src={img} alt={`Preview ${index + 1}`} />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="btn-admin-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Add Part'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Parts Table */}
      {isLoading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Compatibility</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <tr key={part._id}>
                  <td>
                    <img 
                      src={part.images[0] || 'https://via.placeholder.com/60x40'} 
                      alt={part.name}
                      className="table-thumbnail"
                    />
                  </td>
                  <td>{part.name}</td>
                  <td>{part.compatibility}</td>
                  <td>{part.condition}</td>
                  <td>
                    <button className="btn-icon delete" onClick={() => handleDelete(part._id || '')} title="Delete">
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

function getSampleParts(): Part[] {
  return [
    { _id: '1', name: 'Hydraulic Pump', compatibility: 'JCB 3DX, JCB 3DX Plus', condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400'] },
    { _id: '2', name: 'Breaker Bits', compatibility: 'All Hydraulic Breakers', condition: 'New', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'] },
    { _id: '3', name: 'Engine Assembly', compatibility: 'CAT 320D, CAT 424B', condition: 'Refurbished', images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400'] },
  ];
}
