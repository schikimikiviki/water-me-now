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

export default getRequest;
