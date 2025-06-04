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
    const response = await api.delete(`/${url}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.message || error);
    return null;
  }
};

export const patchSomethingWithId = async (url, id, body) => {
  for (var pair of body.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  try {
    const response = await api.patch(`/${url}/${id}`, body, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.message || error);
    return null;
  }
};

export default {
  getRequest,
  getRequestSimple,
  deleteSomethingWithId,
  patchSomethingWithId,
};
