const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('deraya_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const apiFetch = async (endpoint: string, options: any = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

export const apiUpload = async (file: File) => {
  const token = localStorage.getItem('deraya_token');
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }
  return data.url;
};
