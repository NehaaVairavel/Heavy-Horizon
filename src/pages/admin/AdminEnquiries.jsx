import { useState, useEffect } from 'react';
import { getEnquiries } from '@/lib/api';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('adminToken') || '';

  useEffect(() => { fetchEnquiries(); }, []);
  const fetchEnquiries = async () => { setIsLoading(true); const data = await getEnquiries(token); setEnquiries(data.length > 0 ? data : [{ id: '1', type: 'Rental', machine: 'JCB 3DX', message: 'Interested', mobile: '+91 98765 43210', created_at: '2024-01-15' }]); setIsLoading(false); };
  const filteredEnquiries = filter === 'all' ? enquiries : enquiries.filter(e => e.type.toLowerCase() === filter);
  const openWhatsApp = (mobile) => { window.open(`https://wa.me/${mobile.replace(/[^0-9]/g, '')}`, '_blank'); };

  return (<div className="admin-page"><div className="admin-page-header"><h1>Enquiries</h1><div className="filter-tabs">{['all', 'rental', 'sales', 'parts', 'contact'].map(tab => <button key={tab} className={`filter-tab ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>)}</div></div>{isLoading ? <div className="admin-loading">Loading...</div> : <div className="admin-table-container"><table className="admin-table"><thead><tr><th>Type</th><th>Item</th><th>Message</th><th>Mobile</th><th>Date</th><th>Actions</th></tr></thead><tbody>{filteredEnquiries.map((enquiry, idx) => <tr key={enquiry.id || idx}><td><span className={`badge badge-${enquiry.type.toLowerCase()}`}>{enquiry.type}</span></td><td>{enquiry.machine || enquiry.part || '-'}</td><td>{enquiry.message.substring(0, 50)}</td><td>{enquiry.mobile}</td><td>{new Date(enquiry.created_at || '').toLocaleDateString()}</td><td><button className="btn-icon whatsapp" onClick={() => openWhatsApp(enquiry.mobile)}>WA</button></td></tr>)}</tbody></table></div>}</div>);
}
