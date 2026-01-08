const API_BASE = 'http://localhost:5000';

// Machines
export async function getMachines(purpose, category) {
  const params = new URLSearchParams();
  if (purpose) params.append('purpose', purpose);
  if (category) params.append('category', category);
  
  const url = `${API_BASE}/machines${params.toString() ? `?${params.toString()}` : ''}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch machines');
    return await response.json();
  } catch (error) {
    console.error('Error fetching machines:', error);
    return [];
  }
}

// Parts
export async function getParts() {
  try {
    const response = await fetch(`${API_BASE}/parts`);
    if (!response.ok) throw new Error('Failed to fetch parts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching parts:', error);
    return [];
  }
}

// Blogs
export async function getBlogs() {
  try {
    const response = await fetch(`${API_BASE}/blogs`);
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getBlog(id) {
  try {
    const response = await fetch(`${API_BASE}/blogs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch blog');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Enquiries
export async function submitEnquiry(data) {
  const response = await fetch(`${API_BASE}/enquiry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit enquiry');
  }
  
  return await response.json();
}

// Admin Authentication
export async function adminLogin(email, password) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid credentials');
  }
  
  return await response.json();
}

// Admin - Machines
export async function uploadImages(files, token) {
  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('images', file));
  
  const response = await fetch(`${API_BASE}/admin/upload-images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) throw new Error('Failed to upload images');
  return await response.json();
}

export async function addMachine(machine, token) {
  const response = await fetch(`${API_BASE}/admin/machine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(machine),
  });
  
  if (!response.ok) throw new Error('Failed to add machine');
  return await response.json();
}

export async function deleteMachine(title, token) {
  const response = await fetch(`${API_BASE}/admin/machine/${encodeURIComponent(title)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to delete machine');
  return await response.json();
}

// Admin - Parts
export async function addPart(part, token) {
  const response = await fetch(`${API_BASE}/admin/part`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(part),
  });
  
  if (!response.ok) throw new Error('Failed to add part');
  return await response.json();
}

export async function deletePart(id, token) {
  const response = await fetch(`${API_BASE}/admin/part/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to delete part');
  return await response.json();
}

// Admin - Blogs
export async function addBlog(blog, token) {
  const response = await fetch(`${API_BASE}/admin/blog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(blog),
  });
  
  if (!response.ok) throw new Error('Failed to add blog');
  return await response.json();
}

export async function deleteBlog(id, token) {
  const response = await fetch(`${API_BASE}/admin/blog/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to delete blog');
  return await response.json();
}

// Admin - Enquiries
export async function getEnquiries(token) {
  try {
    const response = await fetch(`${API_BASE}/admin/enquiries`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch enquiries');
    return await response.json();
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return [];
  }
}
