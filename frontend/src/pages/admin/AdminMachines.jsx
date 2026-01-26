import { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getMachines, addMachine, deleteMachine, updateMachine, uploadImages } from '@/lib/api';
import { normalizeImages } from '@/lib/images';

// Configure custom fonts
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'roboto', 'times-new-roman', 'calibri', 'georgia'];
Quill.register(Font, true);

// Configure sizes
const Size = Quill.import('formats/size');
Size.whitelist = ['small', 'medium', 'large', 'huge'];
Quill.register(Size, true);

// Quill Modules Configuration for a Word-like experience
const quillModules = {
  toolbar: [
    [{ 'font': Font.whitelist }, { 'size': Size.whitelist }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['clean'],
    ['undo', 'redo']
  ],
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true
  }
};

const quillFormats = [
  'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'header',
  'list', 'bullet',
  'align',
  'clean'
];

const emptyMachine = {
  title: '',
  category: 'Backhoe Loader',
  type: 'Rental',
  model: '',
  year: new Date().getFullYear(),
  hours: 0,
  condition: '', // Used for Description
  images: [],
  status: 'Available',
  location: ''
};

export default function AdminMachines() {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyMachine);

  // Image States
  const [selectedFiles, setSelectedFiles] = useState([]); // File[]
  const [previewUrls, setPreviewUrls] = useState([]);     // string[] (blob URLs)

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMachines();
    return () => {
      // Cleanup preview URLs on unmount to prevent memory leaks
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const fetchMachines = async () => {
    setIsLoading(true);
    try {
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error("Failed to fetch machines", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    // Validate limit (Max 10 images)
    if (previewUrls.length + files.length > 10) {
      setMessage({ type: 'error', text: 'Maximum 10 images allowed' });
      return;
    }

    // Generate previews
    const newFilesWithUrls = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newFilesWithUrls]);
    setPreviewUrls(prev => [...prev, ...newFilesWithUrls.map(f => f.url)]);

    // Clear error if any
    setMessage({ type: '', text: '' });
  };

  const removeImage = (index) => {
    const urlToRemove = previewUrls[index];

    if (urlToRemove.startsWith('blob:')) {
      // Remove from tracked selectedFiles
      setSelectedFiles(prev => prev.filter(f => f.url !== urlToRemove));
      URL.revokeObjectURL(urlToRemove);
    } else {
      // Remove from existing images in formData
      setFormData(prev => ({
        ...prev,
        images: (prev.images || []).filter(u => u !== urlToRemove)
      }));
    }

    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Description (condition)
    const isDescriptionEmpty = !formData.condition || formData.condition === '<p><br></p>' || formData.condition.trim() === '';
    if (isDescriptionEmpty) {
      setMessage({ type: 'error', text: 'Description is mandatory' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Validate Location
    if (!formData.location || formData.location.trim().length < 2) {
      setMessage({ type: 'error', text: 'Location is mandatory (min 2 characters)' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      let uploadedImages = [];

      // 1. Upload new files if any
      if (selectedFiles.length > 0) {
        setUploading(true);
        const filesToUpload = selectedFiles.map(f => f.file);
        const uploadRes = await uploadImages(filesToUpload);
        uploadedImages = uploadRes.images || [];
        setUploading(false);
      }

      // 2. Prepare clean payload
      const finalImages = [
        ...(formData.images || []),
        ...uploadedImages
      ];

      // Remove immutable fields for update
      const cleanPayload = { ...formData };
      delete cleanPayload._id;
      delete cleanPayload.machineCode;

      cleanPayload.images = finalImages;
      cleanPayload.condition = (cleanPayload.condition || '').trim();
      cleanPayload.location = (cleanPayload.location || '').trim();
      cleanPayload.year = Number(cleanPayload.year);
      cleanPayload.hours = Number(cleanPayload.hours);

      if (isEditing) {
        await updateMachine(editId, cleanPayload);
        setMessage({ type: 'success', text: 'Machine updated successfully' });
      } else {
        await addMachine(cleanPayload);
        setMessage({ type: 'success', text: 'Machine added successfully' });
      }

      handleReset();
      await fetchMachines();

    } catch (error) {
      console.error("Error saving machine:", error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || error.message || "Failed to save machine"
      });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleReset = () => {
    // Cleanup tracked blob previews
    selectedFiles.forEach(f => URL.revokeObjectURL(f.url));

    setFormData(emptyMachine);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (machine) => {
    setFormData({
      ...machine,
      condition: machine.condition || ''
    });
    setEditId(machine._id);
    setIsEditing(true);

    // Set existing images as previews
    const existingImages = normalizeImages(machine.images || machine.image);
    setPreviewUrls(existingImages);
    setSelectedFiles([]); // No new files yet

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this machine?')) return;

    try {
      await deleteMachine(id);
      setMessage({ type: 'success', text: 'Machine deleted successfully' });
      fetchMachines();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete machine' });
    }
  };

  const getThumbnail = (machine) => {
    const normalizedImages = normalizeImages(machine?.images || machine?.image);
    return normalizedImages.length > 0 ? normalizedImages[0] : 'https://via.placeholder.com/60x40?text=No+Image';
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Machines</h1>
        <button className="btn-admin-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Machine'}
        </button>
      </div>

      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Add Machine Form */}
      {showForm && (
        <div className="admin-form-container">
          <h2>{isEditing ? 'Edit Machine' : 'Add New Machine'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="admin-form-group">
                <label>Machine Brand *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., JCB 3DX"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Model *</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., 3DX"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="admin-form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Backhoe Loader">Backhoe Loader</option>
                  <option value="Excavator">Excavator</option>
                  <option value="Backhoe Loader with Breaker">Backhoe Loader with Breaker</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Purpose (Type) *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Rental">Rental (Services)</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="admin-form-group">
                <label>Year *</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="2000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Chennai, Tamil Nadu"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Hours *</label>
                <input
                  type="number"
                  value={formData.hours}
                  onChange={e => setFormData({ ...formData, hours: parseInt(e.target.value) })}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'block', marginBottom: '40px' }}>
              <div className="admin-form-group" style={{ width: '100%' }}>
                <label>Description *</label>
                <div className="quill-editor-wrapper" style={{ background: 'white', minHeight: '300px' }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.condition}
                    onChange={(content) => setFormData({ ...formData, condition: content })}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Describe the machine's features, performance, and history..."
                    style={{ height: '250px', marginBottom: '50px' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="admin-form-group" style={{ width: '100%' }}>
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Images ({previewUrls.length}/10)</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={uploading || previewUrls.length >= 10}
                />
                {uploading && <span className="upload-status">Uploading to Cloudinary...</span>}
              </div>

              <div className="image-preview-grid">
                {previewUrls.map((url, index) => (
                  <div key={index} className="image-preview">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{ objectFit: 'cover' }}
                    />
                    <button type="button" onClick={() => removeImage(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-admin-secondary" onClick={handleReset}>
                Cancel
              </button>
              <button type="submit" className="btn-admin-primary" disabled={saving || uploading}>
                {saving || uploading ? 'Processing...' : (isEditing ? 'Update Machine' : 'Add Machine')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Machines Table */}
      {isLoading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Purpose (Type)</th>
                <th>Year</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((machine, index) => (
                <tr key={machine._id || index}>
                  <td>
                    <img
                      src={getThumbnail(machine)}
                      alt={machine.title}
                      className="table-thumbnail"
                    />
                  </td>
                  <td>{machine.title}</td>
                  <td>{machine.category}</td>
                  <td>
                    <span className={`badge badge-${(machine.type || machine.purpose || '').toLowerCase()}`}>
                      {machine.type || machine.purpose}
                    </span>
                  </td>
                  <td>{machine.year}</td>
                  <td>{machine.hours.toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${machine.status.toLowerCase()}`}>
                      {machine.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(machine)}
                      title="Edit"
                      style={{ marginRight: 8, color: 'var(--primary)' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(machine._id)}
                      title="Delete"
                    >
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

function getSampleMachines() {
  return [
    { title: 'JCB 3DX', category: 'Backhoe Loader', purpose: 'Rental', model: '3DX', year: 2020, hours: 5200, condition: 'Pure Earthwork Condition', images: ['https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400'], status: 'Available' },
    { title: 'CAT 320D', category: 'Excavator', purpose: 'Rental', model: '320D', year: 2019, hours: 7200, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'], status: 'Available' },
    { title: 'JCB 3DX with Breaker', category: 'Backhoe Loader with Breaker', purpose: 'Rental', model: '3DX', year: 2020, hours: 5400, condition: 'Good Condition', images: ['https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400'], status: 'Available' },
  ];
}
