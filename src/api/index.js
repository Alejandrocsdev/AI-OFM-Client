// Custom Functions
import axios from 'axios';

export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const api = async (request, handlers = {}) => {
  const { onSuccess, onError, onFinally } = handlers;
  try {
    const { data } = await request;
    if (onSuccess) onSuccess(data);
  } catch (error) {
    if (onError) onError(error);
  } finally {
    if (onFinally) onFinally();
  }
};
