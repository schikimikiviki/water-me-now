import api from '../api/axiosConfig';

export const getRequest = async (path) => {
  try {
    const response = await api.get(`/${path}/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.message || error);
    return null;
  }
};

export const getRequestSimple = async (url, options = {}) => {
  const response = await api.get(`/${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  return response;
};

export const deleteSomethingWithId = async (url, id) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await api.delete(`/${url}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.message || error);
    return null;
  }
};

export default { getRequest, getRequestSimple, deleteSomethingWithId };
